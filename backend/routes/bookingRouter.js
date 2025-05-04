import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  cancelBookingById,
  createBooking,
  deleteCancelledBooking,
  getBookingByCarId,
  getBookingById,
  getBookingsByUser,
  getMultipleBooking,
  unAvailableCars,
  updateBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();
bookingRouter.get("/get-booking", protectRoute, getBookingsByUser);
bookingRouter.get("/get-booking-by-car/:carId", getBookingByCarId);
bookingRouter.get("/unavailable", unAvailableCars);

bookingRouter.get("/get-booking-by-id/:id", getBookingById);

bookingRouter.post("/create-booking/:car", protectRoute, createBooking);

bookingRouter.post("/cancel-booking/:id", protectRoute, cancelBookingById);
bookingRouter.post("/update-booking/:id", protectRoute, updateBooking);

bookingRouter.post("/get-multiple", getMultipleBooking);

// bookingRouter.patch("/:bookingId", updateBookingStatus);
bookingRouter.patch("/update-booking/:bookingId", updateBookingStatus);  // ✅


bookingRouter.delete("/delete-booking/:bookingId", deleteCancelledBooking);

export default bookingRouter;
