import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getProfileById,
  deleteMyProfile,
} from "../controllers/profileController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // JWT auth

const router = express.Router();

// 👇 Add this temporary log
router.use((req, res, next) => {
  console.log("🧭 Profile route hit:", req.method, req.originalUrl);
  next();
});
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.get("/:userId", getProfileById);
router.delete("/me", verifyToken, deleteMyProfile);

export default router;
