import jwt from "jsonwebtoken";
import Cust from "../models/customerModel.js";

export const protectedCustRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.custtoken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    if (!decoded?.custId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    const customer = await Cust.findById(decoded.custId).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    req.customer = customer;
     
    next();
  } catch (error) {
    console.error("Error in protectedCustRoute middleware:", error);
    res.status(500).json({ message: "Internal server error in protectedCustRoute middleware" });
  }
};
