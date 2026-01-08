import MoodLog from "../models/MoodLog.js";
import Profile from "../models/Profile.js";
import JournalEntry from "../models/JournalEntry.js";

// Helper to map number → text
const moodMap = {
  1: "very sad",
  2: "sad",
  3: "neutral",
  4: "happy",
  5: "very happy",
};

// Create new mood entry
export const createMood = async (req, res) => {
  try {
    const { moodValue, note, tags } = req.body;

    if (!moodValue || moodValue < 1 || moodValue > 5) {
      return res.status(400).json({ message: "Mood value must be between 1–5" });
    }

    const mood = await MoodLog.create({
      user: req.userId,
      moodValue,
      moodLabel: moodMap[moodValue],
      note: note || "",
      tags: tags || [],
      date: new Date(),
    });

    res.status(201).json(mood);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all moods
export const getMoods = async (req, res) => {
  try {
    const moods = await MoodLog.find({ user: req.userId }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update mood
export const updateMood = async (req, res) => {
  try {
    const { moodValue, note, tags } = req.body;

    const updateData = {
      note,
      tags,
      updatedAt: new Date(),
    };

    if (moodValue) {
      updateData.moodValue = moodValue;
      updateData.moodLabel = moodMap[moodValue];
    }

    const mood = await MoodLog.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true }
    );

    if (!mood) return res.status(404).json({ message: "Mood entry not found" });

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete mood
export const deleteMood = async (req, res) => {
  try {
    const mood = await MoodLog.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!mood) return res.status(404).json({ message: "Mood entry not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getMoodsByRange = async (req, res) => {
  try {
    const userId = req.userId; // from verifyToken
    const { range } = req.query; // daily | weekly | monthly

    if (!range) {
      return res.status(400).json({
        success: false,
        message: "Range is required (daily, weekly, monthly)",
      });
    }

    const now = new Date();
    let startDate;

    if (range === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "weekly") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (range === "monthly") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid range type. Choose daily, weekly, or monthly.",
      });
    }

    // Fetch moods from MoodLog collection
    const moods = await MoodLog.find({
      user: userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      range,
      total: moods.length,
      moods,
    });
  } catch (err) {
    console.error("❌ Error in getMoodsByRange:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching moods",
    });
  }
};


export const getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const journals = await JournalEntry.find({ user: userId }).sort({
      createdAt: 1,
    });

    // 1️⃣ Mood Count
    const moodCount = {
      happy: 0,
      sad: 0,
      angry: 0,
      stressed: 0,
      neutral: 0,
    };

    journals.forEach((j) => {
      moodCount[j.mood]++;
    });

    // 2️⃣ Weekly Trend (last 7 days)
    const last7Days = {};
    journals.forEach((j) => {
      const date = j.createdAt.toISOString().split("T")[0];
      last7Days[date] = (last7Days[date] || 0) + 1;
    });

    const weeklyTrend = Object.entries(last7Days)
      .slice(-7)
      .map(([date, count]) => ({
        date,
        count,
      }));

    // 3️⃣ Longest Positive Streak
    let longestStreak = 0;
    let currentStreak = 0;

    journals.forEach((j) => {
      if (j.mood === "happy") {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    res.status(200).json({
      success: true,
      moodCount,
      weeklyTrend,
      longestPositiveStreak: longestStreak,
    });
  } catch (error) {
    console.error("Mood analytics error:", error);
    res.status(500).json({ message: "Failed to fetch mood analytics" });
  }
};
