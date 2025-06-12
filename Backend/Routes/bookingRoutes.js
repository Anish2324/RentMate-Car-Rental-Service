import express from "express";
import {
  addDays,
  getAllBookedDatesForCar,
  getBookedDatesForCar,
  getBookingsByCustomer,
} from "../controllers/booking.controller.js";
import { protectedCustRoute } from "../middleware/Customer.middleware.js";

const router = express.Router();
router.post("/add-days/:Reg_no", protectedCustRoute, addDays);
router.get("/get-bookings", protectedCustRoute, getBookingsByCustomer); 
//router.get("/all-booked-dates/:carId", getBookedDatesForCar);
//router.get("/booked-dates/:carId", getBookedDatesForCar);
// router.get("/all-booked-dates/:carId", getAllBookedDatesForCar);
// router.get("/all-booked-dates/:carId", getAllBookedDatesForCar);
// router.get(`/book/all-booked-dates/${bookedCar._id}`,getAllBookedDatesForCar)
//router.get("/all-booked-dates/:Reg_No", getAllBookedDatesForCar);
router.get("/all-booked-dates/:Reg_No", getAllBookedDatesForCar);

export default router;
