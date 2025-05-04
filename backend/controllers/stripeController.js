import dotenv from "dotenv";
import Stripe from "stripe";
import Booking from "../models/Booking.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { bookingId, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Booking #${bookingId}` },
            unit_amount: amount * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    });

    // Return the session URL to redirect the user
    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating Stripe checkout session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

const verifyPayment = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment is successful
    if (session.payment_status === "paid") {
      const bookingId = session.metadata.bookingId;

      // Find the booking by its ID
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Update the booking with payment details
      booking.paymentId = session.payment_intent; // Add the payment ID
      booking.isPaid = true; // Mark as paid
      booking.status = "paid"; // Set status to paid

      // Save the updated booking
      await booking.save();

      res.json({ success: true, booking });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export { createCheckoutSession, verifyPayment };
