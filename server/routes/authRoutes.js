import express from "express";
import { registerUser, loginUser, getMe, logoutUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📝 Register a new user
router.post("/signup", registerUser);

// 🔐 Login user
router.post("/login", loginUser);

// 👤 Get current user (protected)
router.get("/me", verifyToken, getMe);

// 🚪 Logout (client-side removes token)
router.post("/logout", verifyToken, logoutUser);

export default router;
