import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRouter.js";
import carRouter from "./routes/carRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import webhookRoutes from "./routes/webhook.js";

import connectToMongoDB from "./database/connectToMongoDB.js";
import { startBookingAutoCancelJob } from "./jobs/cron.js";
import {
  createCheckoutSession,
  verifyPayment,
} from "./controllers/stripeController.js";

dotenv.config();

const app = express();
app.use(express.json());
connectToMongoDB();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

startBookingAutoCancelJob();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/car", carRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);
app.post("/api/payment/create-checkout-session", createCheckoutSession);
app.post("/api/payment/verify-payment", verifyPayment);
app.use("/webhook", webhookRoutes); // webhook must use raw body

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
