import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    promoCode: {
      type: String,
      default: "",
      trim: true,
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Experience details
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience", // reference to Experience model
      required: true,
    },
    experienceTitle: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },

    // Pricing details
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxes: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
