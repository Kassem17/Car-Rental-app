import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    carImage: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
