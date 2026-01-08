import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  createMood, 
  getMoods, 
  getMoodsByRange, 
  updateMood, 
  deleteMood 
} from "../controllers/moodController.js";

const router = express.Router();

router.post("/create", verifyToken, createMood);
router.get("/all", verifyToken, getMoods);
router.get("/range", verifyToken, getMoodsByRange);
router.put("/update/:id", verifyToken, updateMood);
router.delete("/delete/:id", verifyToken, deleteMood);

export default router;
