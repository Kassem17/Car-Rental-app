import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import dotenv from "dotenv";

dotenv.config();

const webhookRoutes = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

webhookRoutes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;
      const paymentId = session.payment_intent;

      try {
        await Booking.findByIdAndUpdate(bookingId, {
          status: "paid",
          paymentId: paymentId,
        });
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }

    res.json({ received: true });
  }
);
export default webhookRoutes;
