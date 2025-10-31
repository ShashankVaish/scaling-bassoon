import mongoose, { Schema } from "mongoose";

// Define the schema for the BookingId lookup
const bookingIdSchema = new Schema(
  {
    /**
     * This field stores the unique _id from the main 'Booking' collection.
     * We set 'ref' so Mongoose knows it's a foreign key.
     */
    bookingId: {
      type: String,
      ref: "Booking", // Refers to your *other* Booking model
      required: true,
      unique: true, // You'd only want one entry per booking
    },

    /**
     * The user's email, with the same validation
     * as your main Booking schema.
     */
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the model
// The model will be named 'BookingId' and the collection 'bookingids'
const BookingId = mongoose.model("BookingId", bookingIdSchema);

export default BookingId;