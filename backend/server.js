import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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

// Cron Job
startBookingAutoCancelJob();

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/car", carRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);
app.post("/api/payment/create-checkout-session", createCheckoutSession);
app.post("/api/payment/verify-payment", verifyPayment);
app.use("/webhook", webhookRoutes); // webhook must use raw body

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "frontend/build")));

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Catch-all to serve index.html for React Router (except for API or webhook paths)
app.get("*", (req, res) => {
  if (
    req.originalUrl.startsWith("/api") ||
    req.originalUrl.startsWith("/webhook")
  ) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
