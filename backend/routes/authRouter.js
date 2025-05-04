import express from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  signup,
} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/get-profile", protectRoute, getProfile);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
