import User from "../models/User.js";
import Booking from "../models/Booking.js";

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

// export const getAllBookings = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Find all bookings and populate the car and user fields, including carImage
//     const bookings = await Booking.find({}).populate("user").populate("car");

//     res.status(200).json({ success: true, bookings });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error in getting bookings", error });
//   }
// };

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
        select: "name model carImage", // populate only needed fields
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
