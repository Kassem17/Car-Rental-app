import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  cancelBookingById,
  createBooking,
  getBookingByCarId,
  getBookingById,
  getBookingsByUser,
  updateBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();
bookingRouter.get("/get-booking", protectRoute, getBookingsByUser);
bookingRouter.get("/get-booking-by-car/:carId", getBookingByCarId);

bookingRouter.get("/get-booking-by-id/:id", getBookingById);

bookingRouter.post("/create-booking/:car", protectRoute, createBooking);

bookingRouter.post("/cancel-booking/:id", protectRoute, cancelBookingById);
bookingRouter.post("/update-booking/:id", protectRoute, updateBooking);


bookingRouter.patch("/:bookingId", updateBookingStatus);

export default bookingRouter;
