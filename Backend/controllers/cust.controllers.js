import { generatetokendforcust } from "../lib/util.js";
import Cust from "../models/customerModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetPasswordEmail, sendVerificationEamil } from "../nodemailer/email.js";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const signup = async (req, res) => {
  const { fullname, email, password, phoneNo, DOB, licenseNo } = req.body;

  try {
    if (!fullname || !email || !password || !phoneNo || !DOB || !licenseNo) {
      return res.status(400).json({ message: "All fields are required" });
    }
     if (!/^\d{10}$/.test(String(phoneNo))) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }
   
    if (password.length < 6) {      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check for existing email
    const existingEmail = await Cust.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Optionally, check for existing phone number
    const existingPhone = await Cust.findOne({ phoneNo });
    if (existingPhone) {
      return res.status(409).json({ message: "Phone number already exists" });
    }

    const age = calculateAge(DOB);
    if(age < 18) {
      return res.status(400).json({ message: "You must be at least 18 years old to register" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newCust = new Cust({
      fullname,
      email,
      password: hashedPassword,
      phoneNo,
      DOB: new Date(DOB),
      licenseNo,
      age,
      verificationCode
    });

    await newCust.save();
    const token = generatetokendforcust(newCust._id, res); // <-- CAPTURE TOKEN

    sendVerificationEamil(newCust.email, verificationCode);

    res.status(201).json({
      message: "Customer created successfully",
      token, // <-- RETURN TOKEN
      customer: {
        id: newCust._id,
        fullname: newCust.fullname,
        email: newCust.email,
        phoneNo: newCust.phoneNo,
        DOB: newCust.DOB,
        licenseNo: newCust.licenseNo,
        age: newCust.age,
      },
    });
  } catch (error) {
    console.error("Error in signup controller for customer:", error);
    res.status(500).json({ message: "Internal server error in signup controller for customer" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await Cust.findOne({
      verificationCode: code,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during email verification",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Cust.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generatetokendforcust(user._id, res);

    res.status(200).json({
      token,
      customer: {
        id: user._id,
        fullname: user.fullname,
        lastName: user.lastName,
        email: user.email,
        phoneNo: user.phoneNo,
        isVerified: user.isVerified, // <-- ADD THIS LINE
      },
    });

  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error in login controller" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("custtoken", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout customer controllers", error.message);
    res.status(500).json({ message: "Internal server Error in logout customer controllers" });
  }
};

export const CheckAuth = (req, res) => {
  try {
    // req.customer is set by middleware
    res.status(200).json({
      message: "Authorized",
      user: {
        ...req.customer.toObject(),
        isVerified: req.customer.isVerified, // <-- ENSURE THIS IS PRESENT
      }
    });
  } catch (error) {
    console.log("Error in CheckAuth in customer:", error.message);
    res.status(500).json({ message: "Internal Server Error " });
  }
};

export const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // ✅ Generate a secure raw token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // ✅ Hash the token for storage
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = expiry;

    await admin.save();

    // ✅ Send the raw token via email
    await sendResetPasswordEmail(admin.email, rawToken);

    res.status(200).json({ message: "Reset password email sent" });

  } catch (error) {
    console.error("Error in resetPasswordRequest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};