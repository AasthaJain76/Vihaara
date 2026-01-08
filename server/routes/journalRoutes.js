import express from "express";
import {
  createJournalEntry,
  getAllJournals,
  getJournalById,
  updateJournalEntry,
  deleteJournalEntry,
  regenerateAI,
  getWeeklyAIInsights,
} from "../controllers/journalController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {getMoodAnalytics} from "../controllers/moodController.js";

const router = express.Router();

router.post("/entries", verifyToken, createJournalEntry);
router.get("/entries", verifyToken, getAllJournals);
router.get("/entries/:id", verifyToken, getJournalById);
router.put("/entries/:id", verifyToken, updateJournalEntry);
router.delete("/entries/:id", verifyToken, deleteJournalEntry);

// 🔥 NEW
router.get("/analytics/mood", verifyToken, getMoodAnalytics);
router.post("/:id/regenerate-ai", verifyToken, regenerateAI);
router.get("/weekly-insights/current",verifyToken,getWeeklyAIInsights);

export default router;
