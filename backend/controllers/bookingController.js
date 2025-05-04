import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

// Utility to check for overlapping bookings
const isCarAvailable = async (carId, startDate, endDate) => {
  const overlappingBookings = await Booking.find({
    car: carId,
    status: { $ne: "cancelled" }, // ignore cancelled bookings
    $and: [{ startDate: { $lt: endDate } }, { endDate: { $gt: startDate } }],
  });

  return overlappingBookings.length === 0;
};

// Create a new booking
export const createBooking = async (req, res) => {
  const { startDate, endDate, totalAmount } = req.body;
  const { car } = req.params;
  const user = req.user.userId; // Get the logged-in user from req.user

  if (!car || !startDate || !endDate || !totalAmount) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Please Login to book" });
  }

  const userRole = await User.findById(user);

  if (userRole.role === "admin") {
    return res
      .status(401)
      .json({ success: false, message: "Admin cannot book a car" });
  }

  try {
    // Ensure the car exists in the database
    const carExists = await Car.findById(car);
    if (!carExists) {
      return res.status(404).json({ message: "Car not found." });
    }

    const available = await isCarAvailable(car, startDate, endDate);

    if (!available) {
      return res.status(409).json({
        success: false,
        message: "Car is already booked for the selected dates.",
      });
    }

    const newBooking = await Booking.create({
      user,
      car,
      startDate,
      endDate,
      totalAmount,
      status: "pending",
    });

    await Promise.all([
      Car.findByIdAndUpdate(car, {
        $push: { bookings: newBooking._id },
      }),
      User.findByIdAndUpdate(user, { $push: { bookings: newBooking._id } }),
    ]);

    res.status(201).json({
      success: true,
      message: "Car Booked Successfully",
      newBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating booking", error });
  }
};

// Get all bookings for the current user
export const getBookingsByUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("car")
      .sort({ createdAt: -1 }); //latest first
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in get Bookings By User",
      error,
    });
  }
};

// Cancel a booking
export const cancelBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
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
        userId,
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

// Admin: Update a booking (e.g., change dates or car)
export const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate, car } = req.body;
    const booking = await Booking.findById(req.params);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Validate the car if provided
    if (car) {
      const carExists = await Car.findById(car);
      if (!carExists) {
        return res.status(404).json({ message: "Car not found." });
      }
    }

    // Ensure startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Invalid dates." });
    }

    const available = await isCarAvailable(
      car || booking.car,
      startDate,
      endDate
    );

    if (!available) {
      return res
        .status(409)
        .json({ message: "Car not available for new dates." });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    if (car) booking.car = car;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in update Booking", error });
  }
};

export const getBookingByCarId = async (req, res) => {
  try {
    const { carId } = req.params;

    if (!carId) {
      return res.status(400).json({ message: "Car id is required" });
    }

    const carBooking = await Booking.find({ car: carId }).populate("car");
    if (carBooking.length === 0) {
      return res.status(201).json({});
    }
    res.status(200).json({ success: true, carBooking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in getting Booking", error });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Booking id is required" });
    }

    const booking = await Booking.findById(id)
      .populate("car")
      .populate("user")
      .select("-password");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching booking", error });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body; // Status is passed in the request body

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the status of the booking
    booking.status = status;
    await booking.save();

    return res.status(200).json(booking); // Send back the updated booking
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update booking status" });
  }
};

export const getMultipleBooking = async (req, res) => {
  try {
    const { bookingIds } = req.body;

    if (!bookingIds || !Array.isArray(bookingIds)) {
      return res.status(400).json({ message: "Invalid booking IDs provided" });
    }

    const bookings = await Booking.find({
      _id: { $in: bookingIds },
    }).populate("car", "brand model"); // Populate car details if needed

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error getMultipleBooking" });
  }
};

export const unAvailableCars = async (rea, res) => {
  try {
    const now = new Date();

    const bookings = await Booking.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: "confirmed",
    }).select("car startDate endDate status");
    const unavailableCarIds = bookings.map((b) => b.car.toString());
    res.status(200).json({
      success: true,
      message: "car is unavailable",
      unavailableCarIds,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error unAvailableCars " });
  }
};

export const deleteCancelledBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the booking first
      const booking = await Booking.findById(bookingId).session(session);

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }

      if (booking.status !== "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Only cancelled bookings can be deleted",
        });
      }

      // Delete the booking
      await Booking.deleteOne({ _id: bookingId }).session(session);

      // Update the car if it exists
      if (booking.car) {
        await Car.findByIdAndUpdate(
          booking.car,
          {
            $set: { available: true },
            $unset: { bookingId: "" },
          },
          { session }
        );
      }

      // Update the user if it exists
      if (booking.user) {
        await User.findByIdAndUpdate(
          booking.user,
          { $pull: { bookings: bookingId } },
          { session }
        );
      }

      await session.commitTransaction();
      res.status(200).json({
        success: true,
        message: "Cancelled booking deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting cancelled booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cancelled booking",
      error: error.message,
    });
  }
};
