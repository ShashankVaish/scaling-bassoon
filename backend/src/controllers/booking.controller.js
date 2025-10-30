import Booking from "../models/booking.model.js";
import Experience from "../models/experience.model.js";
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


    const experienceExists = await Experience.findById(experienceId);
    if (!experienceExists) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found." });
    }

    
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

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("experienceId", "title location image");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found in database." });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
