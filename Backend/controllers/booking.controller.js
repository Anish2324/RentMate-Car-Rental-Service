import Booking from "../models/bookingModel.js";
import Car from "../models/carsModel.js";

// Helper to check for overlapping bookings
const hasOverlap = async (carId, requestedStart, requestedDays) => {
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setDate(requestedEnd.getDate() + Number(requestedDays) - 1);

  // Find any booking for this car that overlaps with the requested range
  const overlappingBooking = await Booking.findOne({
    car: carId,
    $expr: {
      $and: [
        {
          $lte: [
            "$starting_date",
            requestedEnd
          ]
        },
        {
          $gte: [
            {
              $add: [
                "$starting_date",
                { $multiply: ["$no_of_days", 24 * 60 * 60 * 1000] }
              ]
            },
            requestedStart
          ]
        }
      ]
    }
  });

  return !!overlappingBooking;
};

export const addDays = async (req, res) => {
  try {
    const { no_of_days, starting_date } = req.body;
    const { Reg_no } = req.params; // Correct param key

    if (!no_of_days) {
      return res
        .status(400)
        .json({ message: "Missing no_of_days", body: req.body });
    }
    if (!Reg_no) {
      return res
        .status(400)
        .json({ message: "Missing Reg_no", params: req.params });
    }
    if (!starting_date) {
      return res
        .status(400)
        .json({ message: "Missing starting_date", body: req.body });
    }

    const days = Number(no_of_days);
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ message: "Invalid number of days" });
    }

    const car = await Car.findOne({ Reg_No: Reg_no });
    if (!car) {
      return res
        .status(404)
        .json({ message: "Car not found with the given Reg_no" });
    }

    const rentalRate = Number(car.rental_rate);
    if (isNaN(rentalRate)) {
      return res
        .status(500)
        .json({ message: "Invalid rental rate in database" });
    }

    const cost = days * rentalRate;

    const customer = req.customer?._id || null;

    if (!customer) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No customer info from token" });
    }

    // Prevent overlapping bookings for the same car
    const requestedStart = new Date(starting_date);
    const overlap = await hasOverlap(car._id, requestedStart, days);
    if (overlap) {
      return res.status(400).json({
        message: "Car is already booked for the selected dates.",
      });
    }

    const newBooking = new Booking({
      car: car._id,
      Reg_no: car.Reg_No,
      rental_rate: rentalRate,
      no_of_days: days,
      cost,
      customer,
      starting_date, // include if available
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error in addDays controller:", error);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

export const getBookingsByCustomer = async (req, res) => {
  try {
    const customerId = req.customer?._id;

    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Customer not logged in." });
    }

    // Populate only Reg_No and car_category (and _id by default)
    const bookings = await Booking.find({ customer: customerId }).populate(
      "car",
      "Reg_No car_category image_url Car_company Car_Model"
    );

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

export const getBookedDatesForCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const bookings = await Booking.find({ car: carId });
    const bookedRanges = bookings.map((b) => {
      const start = new Date(b.starting_date);
      const end = new Date(start);
      end.setDate(start.getDate() + b.no_of_days - 1);
      return { start: start.toISOString(), end: end.toISOString() };
    });
    res.json({ bookedRanges });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booked dates", error: error.message });
  }
};
const getAllBookedDates = () => {
  const dates = [];
  bookedRanges.forEach((range) => {
    const start = new Date(range.start);
    const end = new Date(range.end);
    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      // Set time to midnight for correct comparison
      dates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    }
  });
  return dates;
};


export const getAllBookedDatesForCar = async (req, res) => {
  try {
    const { Reg_No } = req.params;
    const bookings = await Booking.find({ car: Reg_No });

    // Expand each booking into individual dates
    const bookedDates = [];
    bookings.forEach((b) => {
      const start = new Date(b.starting_date);
      for (let i = 0; i < b.no_of_days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        bookedDates.push(d.toISOString().split('T')[0]); // 'YYYY-MM-DD'
      }
    });

    res.json({ bookedDates });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booked dates", error: error.message });
  }
};