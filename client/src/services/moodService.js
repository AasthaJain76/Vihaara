// src/services/moodService.js
import axiosInstance from "../utils/axiosInstance";

const API_URL = "/mood";

// 📆 Get moods by range: daily | weekly | monthly
export const getMoodsByRange = async (range) => {
  if (!["daily", "weekly", "monthly"].includes(range)) {
    throw new Error("Invalid range. Choose: daily, weekly, monthly");
  }

  const res = await axiosInstance.get(`${API_URL}/range`, {
    params: { range },
  });

  return res.data; // { success, range, total, moods }
};

// 📋 Get all mood logs
export const getMoodLogs = async () => {
  const res = await axiosInstance.get(`${API_URL}/all`);
  return res.data; // array of MoodLog objects
};

// ➕ Create new mood entry
export const createMoodLog = async (data) => {
  // data = { moodValue: 1-5, note?, tags? }
  const res = await axiosInstance.post(`${API_URL}/create`, data);
  return res.data;
};

// ✏️ Update existing mood entry
export const updateMoodLog = async (id, data) => {
  const res = await axiosInstance.put(`${API_URL}/update/${id}`, data);
  return res.data;
};

// 🗑 Delete mood entry
export const deleteMoodLog = async (id) => {
  const res = await axiosInstance.delete(`${API_URL}/delete/${id}`);
  return res.data;
};
