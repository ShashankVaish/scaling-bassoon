import Booking from "../models/booking.model.js";
import Experience from "../models/experience.model.js";
import BookingId from "../models/Booking-summary.model.js";
import crypto from "crypto"; // <-- FIX #1: You must import the crypto module

// REMOVED: const uuid = crypto.randomUUID(); 
// This was the source of your E11000 error. It must be inside the function.

export const createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      promoCode,
      agreedToTerms,
      experienceId,
      experienceTitle,
      date,
      time,
      quantity,
      subtotal,
      taxes,
      total,
      status,
    } = req.body;

    // Your validation is good. This catches errors before hitting the DB.
    if (
      !fullName ||
      !email ||
      !experienceId ||
      !experienceTitle ||
      !date ||
      !time ||
      !quantity ||
      !subtotal ||
      !taxes ||
      !total
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be provided." });
    }

    // Check if the experience actually exists
    const experienceExists = await Experience.findById(experienceId);
    if (!experienceExists) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found." });
    }

    // Create the main booking
    const newBooking = await Booking.create({
      fullName,
      email,
      promoCode,
      agreedToTerms,
      experienceId,
      experienceTitle,
      date,
      time,
      quantity,
      subtotal,
      taxes,
      total,
      status: status || "pending",
    });

    // --- FIX #2: Generate the UUID *inside* the function ---
    // This ensures every booking gets a new, unique ID.
    const Booking_id = crypto.randomUUID();

    // Create the booking summary
    const confirm_booking = await BookingId.create({
      bookingId: Booking_id,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: newBooking,
      BookingId: confirm_booking,
    });

  } catch (error) {
    
    // --- BONUS FIX: Specifically catch the E11000 error ---
    // This can happen if, by some cosmic miracle, two UUIDs collide,
    // or if you have other unique indexes.
    if (error.code === 11000) {
      console.error("Duplicate key error:", error);
      return res.status(409).json({ // 409 Conflict is a great status for this
        success: false,
        message: "A booking with this identifier already exists.",
        error: error.keyValue, // Shows which key was the duplicate
      });
    }
    
    // General error
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Get a single booking by its MongoDB _id
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Populating the experience details is a nice touch.
    const booking = await Booking.findById(id).populate(
      "experienceId", 
      "title location imageUrl" // Only get these fields from the Experience
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found in database." });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};