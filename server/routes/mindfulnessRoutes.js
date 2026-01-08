// src/routes/mindfulnessRoutes.js
import express from "express";
import {
  getActivities,
  createActivity,
  getActivitiesByCategory
} from "../controllers/mindfulnessController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // JWT auth

const router = express.Router();

// Public routes
router.get("/activities", getActivities);
router.get("/activities/:category", getActivitiesByCategory);

// Admin route to add activities
router.post("/activities", verifyToken, createActivity);

export default router;
