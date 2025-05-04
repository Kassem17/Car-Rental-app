// cron.js
import cron from "node-cron";
import Booking from "../models/Booking.js";

export const startBookingAutoCancelJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running auto-cancel unpaid bookings...");

    try {
      const today = new Date();

      const result = await Booking.updateMany(
        {
          endDate: { $lt: today },
          status: { $nin: ["paid", "cancelled"] },
        },
        { $set: { status: "cancelled" } }
      );

      console.log(`✅ Auto-cancelled ${result.modifiedCount} bookings.`);
    } catch (error) {
      console.error("❌ Error in auto-cancel bookings cron job", error);
    }
  });
};
