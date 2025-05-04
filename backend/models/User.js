import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "https://ucarecdn.com/2c2772e9-8dc3-41ad-9c5f-55f5249fefbf/",
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    // Update in userSchema
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
