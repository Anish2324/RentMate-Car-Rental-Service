import React, { useState, useEffect } from "react";
import { useBookingStore } from "../store/bookingStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiLoader,
  FiCreditCard,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// --- DISCLAIMER ---
// This page uses the /book/all-booked-dates/:carId endpoint to fetch all individual booked dates for the selected car.
// The endpoint returns an array of ISO date strings (YYYY-MM-DD).
// These dates are used to disable and style already booked dates in the calendar, ensuring users cannot select them.

const Booking = () => {
  const {
    bookedCar,
    bookingResult,
    bookingLoading,
    bookingError,
    bookCar,
    clearBookedCar,
  } = useBookingStore();

  const [noOfDays, setNoOfDays] = useState("");
  const [startingDate, setStartingDate] = useState(null);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  // Security check animation
  useEffect(() => {
    const timer = setTimeout(() => setSecurityCheck(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all booked dates for this car (by Reg_No) when "Check Availability" is clicked
const handleCheckAvailability = async () => {
  if (!bookedCar?.Reg_No) {
    toast.error("Car registration number not found.");
    return;
  }
  setChecking(true);
  try {
    const res = await axios.get(`/book/all-booked-dates/${bookedCar.Reg_No}`);
    console.log("Booked Dates API response:", res.data);
    setBookedDates(res.data.bookedDates || []);
    setShowDisclaimer(true);
  } catch {
    setBookedDates([]);
    toast.error("Failed to fetch booked dates.");
  }
  setChecking(false);
};

  if (!bookedCar) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="bg-gray-800/90 p-8 rounded-xl shadow-lg text-center border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-white">
            No Car Selected
          </h2>
          <p className="text-gray-400">
            Please select a car to book from the listings.
          </p>
          <button
            className="mt-6 px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow border border-blue-900 transition-all duration-200"
            onClick={() => navigate("/viewcars")}
          >
            Go to Car Listings
          </button>
        </div>
      </div>
    );
  }

  // Helper to get all booked dates as Date objects
  const getAllBookedDates = () => {
    return bookedDates.map((dateStr) => {
      const d = new Date(dateStr);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    });
  };

  // Helper to check if a date is already booked
  const isDateAlreadyBooked = (date) => {
    return getAllBookedDates().some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  // Helper to check if the selected range conflicts with existing bookings
  const isRangeAvailable = (startDate, days) => {
    if (!startDate || !days) return true;

    const numDays = parseInt(days);
    const start = new Date(startDate);

    for (let i = 0; i < numDays; i++) {
      const checkDate = new Date(start);
      checkDate.setDate(start.getDate() + i);
      if (isDateAlreadyBooked(checkDate)) {
        return false;
      }
    }
    return true;
  };

  // Helper to check if a date is in the current user's selection range
  const isDateInCurrentSelection = (date) => {
    if (!startingDate || !noOfDays) return false;

    const checkDate = new Date(date);
    const start = new Date(startingDate);
    const days = parseInt(noOfDays);

    // Normalize times to midnight
    checkDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < days; i++) {
      const rangeDate = new Date(start);
      rangeDate.setDate(start.getDate() + i);
      rangeDate.setHours(0, 0, 0, 0);

      if (checkDate.getTime() === rangeDate.getTime()) {
        return true;
      }
    }
    return false;
  };

  // Enhanced dayClassName function with improved styling
  const getDayClassName = (date) => {
    const isAlreadyBooked = getAllBookedDates().some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
    const isInCurrentSelection = isDateInCurrentSelection(date);

    if (isAlreadyBooked) {
      return "booked-date-enhanced";
    } else if (isInCurrentSelection) {
      return "current-selection-enhanced";
    }
    return "available-date";
  };

  // Handle number of days change with validation
  const handleDaysChange = (e) => {
    const newDays = e.target.value;
    setNoOfDays(newDays);

    if (startingDate && newDays) {
      if (!isRangeAvailable(startingDate, parseInt(newDays))) {
        setStartingDate(null);
        toast.info(
          "Starting date cleared due to booking conflicts. Please select a new date."
        );
      }
    }
  };

  // Handle starting date change with validation
  const handleDateChange = (date) => {
    if (date && isDateAlreadyBooked(date)) {
      toast.error(
        "This date is already booked. Please select an available date."
      );
      return;
    }

    setStartingDate(date);

    if (date && noOfDays) {
      if (!isRangeAvailable(date, parseInt(noOfDays))) {
        toast.error(
          "Selected date range conflicts with existing bookings. Please choose different dates."
        );
      }
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!noOfDays || !startingDate) {
      toast.error("Please enter number of days and starting date");
      return;
    }

    const numDays = parseInt(noOfDays);
    if (numDays <= 0) {
      toast.error("Number of days must be greater than 0");
      return;
    }

    if (!isRangeAvailable(startingDate, numDays)) {
      toast.error(
        "Selected date range conflicts with existing bookings. Please choose different dates."
      );
      return;
    }

    try {
      await bookCar({ noOfDays: numDays, startingDate });

      if (!bookingError && !bookingLoading) {
        // Refresh booked dates after successful booking
        const res = await axios.get(
          `/book/all-booked-dates/${bookedCar.Reg_No}`
        );
        setBookedDates(res.data.bookedDates || []);

        // Clear form
        setNoOfDays("");
        setStartingDate(null);
      }
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handlePayment = () => {
    navigate("/payment");
  };

  const totalCost =
    bookedCar.rental_rate && noOfDays
      ? Number(bookedCar.rental_rate) * Number(noOfDays)
      : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden py-10 px-2">
      {/* Security overlay */}
      <AnimatePresence>
        {!securityCheck && (
          <motion.div
            className="absolute inset-0 bg-gray-900 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-8 max-w-md">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-16 h-16 mb-6"
              >
                <FiCreditCard className="w-full h-full text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Booking Portal Security Check
              </h3>
              <p className="text-gray-400">Verifying secure access...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back navigation */}
      <motion.button
        type="button"
        className="fixed top-6 left-6 px-6 py-2 rounded-full bg-gray-800 text-white font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-700 z-50 flex items-center gap-2"
        onClick={() => {
          clearBookedCar();
          navigate("/viewcars");
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft className="w-5 h-5" />
        Car Listings
      </motion.button>

      {/* Main card */}
      <motion.div
        className="backdrop-blur-lg bg-gray-800/90 shadow-xl rounded-xl p-8 w-full max-w-2xl border border-gray-700 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: securityCheck ? 0 : 1.5 }}
      >
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-pink-500/20 opacity-30 blur-sm"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={securityCheck ? "visible" : "hidden"}
          className="relative"
        >
          <motion.h2
            className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-pink-500 mb-8 tracking-tight"
            variants={itemVariants}
          >
            Book Your Car
          </motion.h2>

          {/* Check Availability Button */}
          <div className="flex justify-center mb-4">
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={handleCheckAvailability}
              disabled={checking}
            >
              {checking ? "Checking..." : "Check Availability"}
            </button>
          </div>

          {/* Moving Disclaimer with Booked Dates */}
          {showDisclaimer && (
            <div className="overflow-x-hidden mb-6">
              <div className="relative w-full">
                <motion.div
                  className="whitespace-nowrap text-sm font-semibold text-pink-400 bg-gray-900/80 px-4 py-2 rounded-lg border border-pink-600 shadow flex items-center gap-2"
                  initial={{ x: "100%" }}
                  animate={{ x: "-100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.max(10, (bookedDates.length || 1) * 1.5),
                    ease: "linear",
                  }}
                  style={{ display: "inline-block", minWidth: "100%" }}
                >
                  <span className="mr-4">
                    🚫 <b>Booked Dates:</b>
                  </span>
                  {bookedDates.length === 0 ? (
                    <span className="text-green-400">No bookings yet!</span>
                  ) : (
                    bookedDates.map((date, idx) => (
                      <span
                        key={date + idx}

                        className="mx-2 px-2 py-1 bg-pink-700/70 text-white rounded shadow border border-pink-400"
                      >
                        {new Date(date).toLocaleDateString()}
                      </span>
                    ))
                  )}
                </motion.div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              className="w-full md:w-1/2 flex flex-col items-center"
              variants={itemVariants}
            >
              {bookedCar.image_url ? (
                <img
                  src={bookedCar.image_url}
                  alt={bookedCar.Car_Model}
                  className="rounded-xl w-64 h-40 object-cover shadow-lg mb-4 transition-transform duration-300 hover:scale-105 border-4 border-blue-900"
                />
              ) : (
                <div className="rounded-xl w-64 h-40 bg-gray-700 flex items-center justify-center text-gray-400 mb-4 border-4 border-blue-900">
                  No Image
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">
                  {bookedCar.Car_company} {bookedCar.Car_Model}
                </h3>
                <div className="text-gray-400 text-sm mb-1">
                  <span className="font-semibold">Reg No:</span>{" "}
                  {bookedCar.Reg_No}
                </div>
                <div className="text-gray-400 text-sm mb-1">
                  <span className="font-semibold">Year:</span> {bookedCar.year}
                </div>
                <div className="text-gray-400 text-sm mb-1">
                  <span className="font-semibold">Fuel:</span> {bookedCar.fuel}{" "}
                  &nbsp;|&nbsp;
                  <span className="font-semibold">Seats:</span>{" "}
                  {bookedCar.seats}
                </div>
                <div className="text-gray-400 text-sm mb-1">
                  <span className="font-semibold">Location:</span>{" "}
                  {bookedCar.location?.street}, {bookedCar.location?.city}
                </div>
                <div className="text-lg font-semibold text-blue-400 mt-2">
                  ₹{bookedCar.rental_rate}/day
                </div>
              </div>
            </motion.div>

            <motion.form
              className="w-full md:w-1/2 bg-gray-900/70 rounded-xl p-6 shadow-inner flex flex-col gap-4 transition-all duration-300 border border-blue-900"
              onSubmit={handleBooking}
              variants={itemVariants}
            >
              <label className="font-semibold text-gray-300 flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                Number of Days
                <input
                  type="number"
                  min="1"
                  className="mt-1 w-full px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={noOfDays}
                  onChange={handleDaysChange}
                  required
                />
              </label>

              <label className="font-semibold text-gray-300 flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                Starting Date
                <DatePicker
                  selected={startingDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  excludeDates={getAllBookedDates()}
                  dateFormat="yyyy-MM-dd"
                  className="mt-1 w-full text-white bg-gray-800 px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholderText="Select a starting date"
                  required
                  dayClassName={getDayClassName}
                  inline={false}
                />
              </label>

              {/* Show booking range preview */}
              {startingDate && noOfDays && (
                <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="font-semibold text-blue-400 mb-1">
                    Booking Preview:
                  </div>
                  <div>From: {startingDate.toLocaleDateString()}</div>
                  <div>
                    To:{" "}
                    {new Date(
                      new Date(startingDate).setDate(
                        startingDate.getDate() + parseInt(noOfDays) - 1
                      )
                    ).toLocaleDateString()}
                  </div>
                  <div>
                    Duration: {noOfDays} day
                    {parseInt(noOfDays) > 1 ? "s" : ""}
                  </div>
                </div>
              )}

              <div className="text-lg font-bold text-pink-400 mt-2">
                Total Cost: <span className="text-blue-400">₹{totalCost}</span>
              </div>

              <button
                type="submit"
                disabled={
                  bookingLoading ||
                  !isRangeAvailable(startingDate, parseInt(noOfDays))
                }
                className={`mt-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-blue-600 hover:scale-105 ${
                  bookingLoading ||
                  !isRangeAvailable(startingDate, parseInt(noOfDays))
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2 w-5 h-5" />
                    Booking...
                  </div>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              {bookingError && (
                <div className="mt-2 p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-center transition-all duration-300">
                  {bookingError}
                </div>
              )}

              {bookingResult && (
                <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300 shadow transition-all duration-300">
                  <div className="font-bold mb-1">Booking Confirmed!</div>
                  <div>Booking ID: {bookingResult._id}</div>
                  <div>Cost: ₹{bookingResult.cost}</div>
                  <div>Days: {bookingResult.no_of_days}</div>
                  <div className="text-sm text-gray-400 mt-2">
                    Thank you for booking with Rentmate!
                  </div>
                  <button
                    className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                    onClick={handlePayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </motion.form>
          </div>
        </motion.div>
      </motion.div>

      {/* Security badge */}
      <motion.div
        className="fixed bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm text-xs text-gray-400 px-3 py-2 rounded-full border border-gray-700 flex items-center gap-2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span>Secure Booking</span>
      </motion.div>

      <style>
        {`
          .booked-date-enhanced {
            background: linear-gradient(135deg, #374151, #1f2937) !important;
            color: #6b7280 !important;
            pointer-events: none !important;
            cursor: not-allowed !important;
            filter: blur(2px) grayscale(100%) !important;
            text-decoration: line-through !important;
            opacity: 0.3 !important;
            position: relative !important;
            transform: scale(0.85) !important;
            border: 2px dashed #ef4444 !important;
            border-radius: 6px !important;
            animation: shake 0.5s ease-in-out !important;
          }
          .booked-date-enhanced::before {
            content: "❌";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 8px;
            z-index: 1;
            filter: none;
          }
          .booked-date-enhanced::after {
            content: "BOOKED";
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 6px;
            background: #ef4444;
            color: white;
            padding: 1px 3px;
            border-radius: 2px;
            white-space: nowrap;
            filter: none;
          }
          .current-selection-enhanced {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
            color: #ffffff !important;
            filter: blur(0.5px) !important;
            opacity: 0.9 !important;
            transform: scale(1.05) !important;
            transition: all 0.3s ease !important;
            border: 2px solid #60a5fa !important;
            border-radius: 8px !important;
            font-weight: bold !important;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2) !important;
            animation: pulse 2s infinite !important;
          }
          .available-date {
            transition: all 0.2s ease !important;
            border-radius: 4px !important;
          }
          .available-date:hover {
            background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
            color: white !important;
            transform: scale(1.1) !important;
            box-shadow: 0 0 10px rgba(79, 70, 229, 0.5) !important;
            filter: brightness(1.2) !important;
          }
          @keyframes shake {
            0%, 100% { transform: scale(0.85) translateX(0); }
            25% { transform: scale(0.85) translateX(-2px); }
            75% { transform: scale(0.85) translateX(2px); }
          }
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
            50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.8); }
          }
          .react-datepicker {
            background-color: #1f2937 !important;
            border: 2px solid #374151 !important;
            border-radius: 12px !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
          }
          .react-datepicker__header {
            background-color: #111827 !important;
            border-bottom: 2px solid #374151 !important;
            border-radius: 10px 10px 0 0 !important;
          }
          .react-datepicker__current-month {
            color: #ffffff !important;
            font-weight: bold !important;
          }
          .react-datepicker__day-name {
            color: #9ca3af !important;
            font-weight: 600 !important;
          }
          .react-datepicker__day {
            color: #ffffff !important;
            font-weight: 500 !important;
            margin: 2px !important;
          }
          .react-datepicker__day--selected {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
            color: white !important;
            border-radius: 6px !important;
          }
          .react-datepicker__day--keyboard-selected {
            background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
            color: white !important;
            border-radius: 6px !important;
          }
          .react-datepicker__day--disabled {
            background: #374151 !important;
            color: #6b7280 !important;
            pointer-events: none !important;
            filter: blur(1px) !important;
            opacity: 0.4 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Booking;