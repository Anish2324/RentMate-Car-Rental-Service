import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../lib/util.js";
import { sendVerificationEamil, sendWelcomeEmail } from "../nodemailer/email.js";

import crypto from "crypto";
import { sendResetPasswordEmail } from "../nodemailer/email.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phoneNo } = req.body;

  try {
    if (!firstName || !email || !password || !phoneNo) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\d{10}$/.test(String(phoneNo))) {
      return res.status(400).json({ message: "Phone number must be 10 digits ---" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be a minimum of 6 characters" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode= Math.floor(100000 + Math.random() * 900000).toString()

    const newAdmin = new Admin({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      phoneNo,
      verificationCode
      
    });

    await newAdmin.save();

    // ✅ Create JWT and set cookie
    generatetoken(newAdmin._id, res);

    sendVerificationEamil(newAdmin.email,verificationCode)
   // sendWelcomeEmail(newAdmin.email,newAdmin.firstName);

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: `${newAdmin.firstName} ${newAdmin.lastName}`,
            isverified: newAdmin.isVerified // <-- add this line

      }
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error in signup controller" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await Admin.findOne({
      verificationCode: code,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    user.isVerified = true; // fixed typo
    user.verificationCode = undefined; // properly set to undefined
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
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and set cookie
    const token = generatetoken(user._id, res);

    // ✅ Send a proper response after setting the cookie
    res.status(200).json({
      message: "Login successful",
     
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
         isverified: user.isVerified
      },
    });

  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error in login controller" });
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







export const logout =  async ( req,res)=>{
        try{
            res.cookie("jwt","",{maxAge:0})
            res.status(200).json({message: " Logged out successfully"})

        }catch(error){
            console.log("Error in logout controllers",error.message)
            res.status(500).json({message : "Internal server Error in logout controllers"})
        }
};

export const CheckAuth = (req, res) => {
    try {
      res.status(200).json({ message: "Authorized", user: req.user });
    } catch (error) {
      console.log("Error in CheckAuth:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };




  export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user._id; // ⬅️ Make sure `req.user` is populated by your auth middleware

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // ✅ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // ✅ Hash new password and update
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error in changePassword:", error.message);
    res.status(500).json({ message: "Internal server error in changePassword" });
  }
};
