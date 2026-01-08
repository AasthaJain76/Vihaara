import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // ✅ JWT middleware

const router = express.Router();

// ✅ Send message to AI & get reply
router.post("/send", verifyToken, sendMessage);

// ✅ Fetch user's chat history
router.get("/history", verifyToken, getChatHistory);

export default router;
