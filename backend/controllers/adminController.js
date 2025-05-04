import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find({ role: "customer" })
      .select("-password")
      .lean(); // Use .lean() for better performance if you don't need Mongoose docs

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error); // Log for debugging
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({})
      .populate({
        path: "user",
        select: "-password -__v", // exclude sensitive fields
      })
      .populate({
        path: "car",
        select: "brand model carImage", // populate only needed fields
      });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error getting bookings:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const findUserById = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Please login" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "bookings",
        populate: [
          { path: "car" }, // car details
          { path: "user", select: "name email" }, // user details
        ],
      })
      .lean(); // Add .lean() so we can modify easily

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const myBookings = user.bookings.filter(
      (booking) => booking.user._id.toString() === userId
    );

    const userData = {
      ...user,
      avatar: user.avatar || null, // Assuming 'profileImage' holds URL string
      bookings: myBookings,
    };

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in findUserById", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { phoneNumber, profileImageUrl } = req.body;

    const updateData = {};

    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (profileImageUrl) updateData.avatar = profileImageUrl;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

export const payCash = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.isPaid = true;
    booking.paymentId = booking._id;
    booking.status = "paid";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment successful",
      booking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error processing payment", error });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "booking not found",
      });
    }

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Confirmed",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error confirm Booking", error });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      status: { $ne: "cancelled" },
    });

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found or already cancelled.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Booking.findByIdAndUpdate(
        bookingId,
        { status: "cancelled" },
        { session }
      );

      await Car.findByIdAndUpdate(
        booking.car,
        { available: true, bookingId: null },
        { session }
      );

      await User.findByIdAndUpdate(
        booking.user,
        { $pull: { bookings: bookingId } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.json({
        success: true,
        message: "Booking cancelled successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error cancelling booking", error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error cancelling booking", error });
  }
};
