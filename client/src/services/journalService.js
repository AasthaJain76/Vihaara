// src/services/journalService.js
import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/journal";

// ✅ Create journal
export const createJournalEntry = async (data) => {
  const res = await axiosInstance.post(
    `${BASE_URL}/entries`,
    data
  );
  return res.data;
};

// ✅ Get all journals
export const getAllJournals = async () => {
  const res = await axiosInstance.get(
    `${BASE_URL}/entries`
  );
  return res.data;
};

// ✅ Get mood analytics (🔥 NEW: streak + weekly trends)
export const getMoodAnalytics = async () => {
  const res = await axiosInstance.get(
    `${BASE_URL}/analytics/mood`
  );
  return res.data;
};

// ✅ Update journal
export const updateJournalEntry = async (id, data) => {
  const res = await axiosInstance.put(
    `${BASE_URL}/entries/${id}`,
    data
  );
  return res.data;
};

// ✅ Delete journal
export const deleteJournalEntry = async (id) => {
  const res = await axiosInstance.delete(
    `${BASE_URL}/entries/${id}`
  );
  return res.data;
};

export const regenerateAI = async (id) => {
  const res = await axiosInstance.post(
    `${BASE_URL}/${id}/regenerate-ai`
  );
  return res.data;
};

export const getWeeklyAIInsights = async () => {
  const res = await axiosInstance.get(
    `${BASE_URL}/weekly-insights/current`
  );
  return res.data;
};

