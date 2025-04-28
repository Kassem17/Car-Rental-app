import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  findUserById,
  getAllBookings,
  getAllUsers,
  markBookingAsPaid,
  payCash,
  updateProfile,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/get-all-users", protectRoute, getAllUsers);
adminRouter.get("/get-bookings", protectRoute, getAllBookings);

adminRouter.get("/get-user", protectRoute, findUserById);

adminRouter.post("/update-profile", protectRoute, updateProfile);
adminRouter.post("/pay-cash", payCash);
adminRouter.post("/mark-booking-as-paid", markBookingAsPaid);

export default adminRouter;
