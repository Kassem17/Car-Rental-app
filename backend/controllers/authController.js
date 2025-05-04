import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phoneNumber } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json({ success: true, message: "Signup successful", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in signup", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in login", error });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in logout", error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in getting profile", error });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`; // frontend link

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset</p><a href="${resetUrl}">Click here</a> to reset your password.`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
