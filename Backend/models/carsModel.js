import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  image_url: {
    type: String,
  },
  Reg_No: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  Car_company: {
    type: String,
    required: true,
  },
  Car_Model: {
    type: String,
    required: true,
  },
  rental_rate: {
    type: Number,
    required: true,
  },
  availability: {
    type: String, 
    enum: ["true", "false"],
  },
  fuel: {
  type: String,
  enum: ['petrol', 'diesel', 'electric'],
  required: true
},
car_category:{
  type : String,
  enum:[ 'sedan', 'suv', 'luxury','economical'],
},
seats: {
  type: Number,
  enum: [1,2,3,4, 5, 6, 7, 8],
  required: true
},


  location: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },

  // ✅ Reference to Admin
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin", // This should match the model name in mongoose.model("admin", ...)
    required: true,
  },
});

const Car = mongoose.model("car", CarSchema);
export default Car;
