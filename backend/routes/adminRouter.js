import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  cancelBooking,
  confirmBooking,
  findUserById,
  getAllBookings,
  getAllUsers,
  payCash,
  updateProfile,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/get-all-users", protectRoute, getAllUsers);
adminRouter.get("/get-bookings", protectRoute, getAllBookings);

adminRouter.get("/get-user", protectRoute, findUserById);

adminRouter.post("/update-profile", protectRoute, updateProfile);
adminRouter.post("/pay-cash", payCash);

adminRouter.post("/confirm-booking", confirmBooking);

adminRouter.post("/admin-cancel", cancelBooking);

export default adminRouter;
