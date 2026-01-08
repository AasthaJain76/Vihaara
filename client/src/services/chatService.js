// src/services/chatService.js
import axiosInstance from "../utils/axiosInstance";

const API_URL = "/chat";

/**
 * Send a new message to AI
 * @param {string} message - User message
 * @param {string} [tone] - Optional tone for AI (supportive, friendly, etc.)
 * @param {string} [contextId] - Optional chat session ID to maintain context
 * @returns {Promise<Object>} - Returns AI reply and updated chat session
 */
export const sendMessage = async ({ message, tone, contextId }) => {
  const res = await axiosInstance.post(`${API_URL}/send`, {
    message,
    tone,
    contextId,
  });
  return res.data; // { success, reply, chatSession }
};

/**
 * Fetch recent chat history for logged-in user
 * @param {number} [limit=20] - Number of recent chat sessions to fetch
 * @returns {Promise<Array>} - Returns array of chat sessions
 */
export const getChatHistory = async (limit = 20) => {
  const res = await axiosInstance.get(`${API_URL}/history`, {
    params: { limit },
  });
  return res.data.chats;
};
