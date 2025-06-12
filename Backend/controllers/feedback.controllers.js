import Feedback from "../models/feedbackmodel.js";
import Booking from "../models/bookingModel.js";
import Car from "../models/carsModel.js";

/**
 * Controller for submitting feedback.
 * Only customers who booked a specific car can give feedback for it.
 */
// controllers/feedback.controllers.js
export const giveFeedback = async (req, res) => {
  try {
    const { rating, comment, bookingId } = req.body;
    const { Reg_No } = req.params;
    const customerId = req.customer._id;

    if (!rating || !Reg_No || !bookingId) {
      return res.status(400).json({ message: "Rating, Reg_No, and bookingId are required." });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    const car = await Car.findOne({ Reg_No });
    if (!car) return res.status(404).json({ message: "Car not found." });

    // Check booking exists and belongs to customer
    const booking = await Booking.findOne({ _id: bookingId, car: car._id, customer: customerId });
    if (!booking) {
      return res.status(403).json({ message: "You can only leave feedback for your own bookings." });
    }

    // Check for existing feedback for this booking
    const existingFeedback = await Feedback.findOne({
      customer: customerId,
      car: car._id,
      booking: bookingId,
    });
    if (existingFeedback) {
      return res.status(409).json({ message: "Feedback already submitted for this booking." });
    }

    const feedback = new Feedback({
      rating: numericRating,
      comment: comment?.trim() || "",
      car: car._id,
      customer: customerId,
      booking: bookingId,
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully.", feedback });
  } catch (error) {
    res.status(500).json({ message: "Internal server error while submitting feedback.", error: error.message });
  }
};





export const getFeedbacksByCar = async (req, res) => {
  try {
    const { Reg_No } = req.params;

    if (!Reg_No) {
      return res.status(400).json({ message: "Car Reg_No is required" });
    }

    // Find the car by Reg_No
    const car = await Car.findOne({ Reg_No });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Find all feedbacks for this car and populate customer details
    const feedbacks = await Feedback.find({ car: car._id })
      .populate({
        path: "customer",
        select: "fullname email", // select fields you want from customer
      })
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({ car: Reg_No, feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error fetching feedbacks" });
  }
};