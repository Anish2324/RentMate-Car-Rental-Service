// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
 
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["CREATED", "APPROVED", "COMPLETED", "FAILED"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer", // or "Cust", if using a separate customer model
    required: true,
  },
  // bookingId : {
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"booking"
  // },
 
},
{timestamps:true});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
