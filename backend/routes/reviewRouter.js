import express from "express";
import { getAllReviews, submitReview } from "../controllers/userController.js";

const reviewRouter = express.Router();

reviewRouter.post("/submit-review", submitReview);

reviewRouter.get("/get-reviews", getAllReviews);

export default reviewRouter;
