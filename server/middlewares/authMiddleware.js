import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No header or wrong format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user associated with token
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user data to request
    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    // Invalid token
    return res.status(403).json({ message: "Invalid token" });
  }
};
