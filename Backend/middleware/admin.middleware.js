import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const protectedAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.adminId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Optional: Fetch admin from DB if needed in route
    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Attach to request
    req.admin = admin; // for full admin details if needed
    req.adminId = decoded.adminId; // for quick reference (e.g., saving to DB)

    next();
  } catch (error) {
    console.error("Error in protectedAdminRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token failed or expired" });
  }
};
