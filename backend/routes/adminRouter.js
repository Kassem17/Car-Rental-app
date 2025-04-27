import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  findUserById,
  getAllBookings,
  getAllUsers,
  updateProfile,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/get-all-users", protectRoute, getAllUsers);
adminRouter.get("/get-bookings", protectRoute, getAllBookings);

adminRouter.get("/get-user", protectRoute, findUserById);

adminRouter.post("/update-profile", protectRoute, updateProfile);

export default adminRouter;
