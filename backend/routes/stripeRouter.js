import express from "express";
import { createCheckoutSession } from "../controllers/stripeController.js";
import protectRoute from "../middleware/protectRoute.js";

const stripeRouter = express.Router();

stripeRouter.post(
  "/create-checkout-session",
  protectRoute,
  createCheckoutSession
);

export default stripeRouter;
