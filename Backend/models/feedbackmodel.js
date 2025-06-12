import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "car",
      required: true,
    },
     booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // NEW
    
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
