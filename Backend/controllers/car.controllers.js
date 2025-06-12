import Car from "../models/carsModel.js";
import cloudinary from "../lib/cloudinary.js";

export const addCar = async (req, res) => {
  try {
    console.log("Received request to add car");

    const {
      image_url,
      Reg_No,
      year,
      Car_company,
      Car_Model,
      rental_rate,
      availability,
      location,
      fuel,
      seats,
      car_category,
    } = req.body;

    const adminId = req.adminId;
    console.log("Admin ID:", adminId);

    if (!adminId) {
      console.log("Unauthorized access attempt - no admin ID");
      return res
        .status(401)
        .json({ message: "Unauthorized. Admin not authenticated." });
    }

    // Check required fields
    if (
      !Reg_No ||
      !Car_company ||
      !Car_Model ||
      !rental_rate ||
      !location ||
      !fuel ||
      !seats ||
      !car_category
    ) {
      console.log("Missing required fields:", {
        Reg_No,
        Car_company,
        Car_Model,
        rental_rate,
        availability,
        location,
        fuel,
        seats,
        car_category,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCar = await Car.findOne({ Reg_No });
    console.log("Existing car check:", existingCar);

    if (existingCar) {
      console.log(`Duplicate registration number found: ${Reg_No}`);
      return res
        .status(409)
        .json({ message: `Car with Reg_No ${Reg_No} already exists` });
    }

    let uploadedImageUrl = "";
    if (image_url) {
      console.log("Uploading image to Cloudinary...");
      const uploadResponse = await cloudinary.uploader.upload(image_url, {
        folder: "cars",
      });
      uploadedImageUrl = uploadResponse.secure_url;
      console.log("Image uploaded to Cloudinary. URL:", uploadedImageUrl);
    }

    const newCarData = {
      image_url: uploadedImageUrl,
      Reg_No,
      year: Number(year),
      Car_company,
      Car_Model,
      rental_rate: Number(rental_rate),
      availability: availability === true || availability === "true",
      location,
      seats: Number(seats),
      fuel,
      car_category,
      admin: adminId,
    };
    console.log("New car data to be saved:", newCarData);

    const newCar = new Car(newCarData);
    await newCar.save();
    console.log("New car saved to database");

    res.status(201).json({
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error("Error while adding car:", error);
    res
      .status(500)
      .json({ message: "Failed to add car", error: error.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.car_category = new RegExp(`^${category}$`, "i"); // case-insensitive
    const cars = await Car.find(filter);
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch cars", error: error.message });
  }
};

export const getCarsByYearOrHigher = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year || isNaN(year)) {
      return res
        .status(400)
        .json({
          message: "Valid 'year' field is required in the request body",
        });
    }

    const numericYear = parseInt(year);

    // Find cars where year >= given year
    const cars = await Car.find({ year: { $gte: numericYear } });

    res.status(200).json(cars);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch cars", error: error.message });
  }
};

export const getCarsByCompany = async (req, res) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res
        .status(400)
        .json({ message: "Company name is required in query parameter" });
    }

    // Case-insensitive match for car company
    const cars = await Car.find({
      Car_company: { $regex: new RegExp(company, "i") },
    });

    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cars", error: error.message });
  }
};

export const filter = async (req, res) => {
  try {
    const { category } = req.query;
    console.log("Filtering cars by category:", category);

    let filter = {};
    if (category) {
      filter.car_category = category;
    }

    const cars = await Car.find(filter);
    console.log(`Found ${cars.length} cars`);

    res.status(200).json({ cars });
  } catch (error) {
    console.error("Error filtering cars:", error);
    res
      .status(500)
      .json({ message: "Failed to filter cars", error: error.message });
  }
};
export const updateCarByRegNo = async (req, res) => {
  try {
    const { Reg_No } = req.params;
    const updateData = req.body;

    if (!Reg_No) {
      return res.status(400).json({ message: "Reg_No is required" });
    }

    const updatedCar = await Car.findOneAndUpdate(
      { Reg_No }, // filter
      updateData, // new data
      { new: true } // return the updated doc
    );

    if (!updatedCar) {
      return res
        .status(404)
        .json({ message: "Car not found with given Reg_No" });
    }

    res
      .status(200)
      .json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update car", error: error.message });
  }
};

export const getCarsSortedByRentalRate = async (req, res) => {
  try {
    const cars = await Car.find().sort({ rental_rate: 1 }); // ascending
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cars", error: error.message });
  }
};

export const getCarsSortedByYear = async (req, res) => {
  try {
    const cars = await Car.find().sort({ year: -1 }); // descending
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cars", error: error.message });
  }
};

export const getAdminByCarRegNo = async (req, res) => {
  try {
    const { Reg_No } = req.body;

    if (!Reg_No) {
      return res
        .status(400)
        .json({ message: "Reg_No is required in the request body" });
    }

    // Find the car and populate the admin field excluding sensitive info
    const car = await Car.findOne({ Reg_No }).populate(
      "admin",
      "-password -__v"
    );

    if (!car) {
      return res
        .status(404)
        .json({ message: "Car not found with the given Reg_No" });
    }

    if (!car.admin) {
      return res
        .status(404)
        .json({ message: "Admin details not found for this car" });
    }

    res.status(200).json({ admin: car.admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get admin details", error: error.message });
  }
};

export const deleteCarByRegNo = async (req, res) => {
  try {
    const { Reg_No } = req.params;
    const adminId = req.adminId; // Set by protectedAdminRoute middleware

    if (!Reg_No) {
      return res.status(400).json({ message: "Reg_No is required" });
    }
    if (!adminId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Admin not authenticated." });
    }

    // Find the car
    const car = await Car.findOne({ Reg_No });
    if (!car) {
      return res
        .status(404)
        .json({ message: "Car not found with given Reg_No" });
    }

    // Check if the requesting admin is the one who added the car
    if (car.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this car." });
    }

    await Car.deleteOne({ Reg_No });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete car", error: error.message });
  }
};

export const getCarsByAdmin = async (req, res) => {
  try {
    const adminId = req.adminId; // Set by protectedAdminRoute middleware

    if (!adminId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Admin not authenticated." });
    }

    const cars = await Car.find({ admin: adminId });

    res.status(200).json({ cars });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch cars for this admin",
        error: error.message,
      });
  }
};
