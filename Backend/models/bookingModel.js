import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    // optional
  },
  starting_date: {
    type: Date,
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'car', // Note: Your model is named 'car', not 'Car'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
  },
  no_of_days: {
    type: Number,
    required:true
  },
  cost: {
    type: Number,
  },
  rental_rate: {
    type: Number, // this will store snapshot from the Car model
  },
  Reg_no:{
    type: String,
    required:true
  }
}, { timestamps: true });

const Booking = mongoose.model("booking", BookingSchema);
export default Booking;
