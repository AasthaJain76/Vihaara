import ChatSession from "../models/ChatSession.js";
import { callAI } from "../utils/aiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, tone, contextId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const userId = req.userId;

    // Fetch previous chat context if any
    let contextMessages = [];
    if (contextId) {
      const context = await ChatSession.findOne({ _id: contextId, user: userId });
      if (context) contextMessages = context.messages;
    }

    // Format context for AI prompt
    const contextString = contextMessages
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    // Call AI to get reply
    const aiReply = await callAI({
      userId,
      message,
      tone: tone || "supportive",
      context: contextString,
    });

    let chatSession;

    if (contextId) {
      // Update existing chat session with new messages
      chatSession = await ChatSession.findByIdAndUpdate(
        contextId,
        {
          $push: {
            messages: {
              $each: [
                { role: "user", text: message },
                { role: "ai", text: aiReply },
              ],
            },
          },
        },
        { new: true }
      );
    } else {
      // Create a new chat session
      chatSession = await ChatSession.create({
        user: userId,
        messages: [
          { role: "user", text: message },
          { role: "ai", text: aiReply },
        ],
      });
    }

    res.status(200).json({
      success: true,
      reply: aiReply,
      chatSession,
    });

  } catch (err) {
    console.error("💥 Error in sendMessage:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20 } = req.query;

    const chats = await ChatSession.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      chats,
    });

  } catch (err) {
    console.error("💥 Error in getChatHistory:", err);
    res.status(500).json({ message: "Server error" });
  }
};
