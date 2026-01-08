import JournalEntry from "../models/JournalEntry.js";
import { generateAIInsights } from "../utils/aiHelper.js"; 
import { generateWeeklyInsights } from "../utils/aiHelper.js";
// ⬆️ this should call OpenAI / Gemini

// 📅 normalize date (remove time)
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 🔥 calculate journal streak
const calculateStreak = (entries) => {
  if (!entries.length) return 0;

  let streak = 1;
  let prevDate = normalizeDate(entries[0].createdAt);

  for (let i = 1; i < entries.length; i++) {
    const currDate = normalizeDate(entries[i].createdAt);

    const diff =
      (prevDate - currDate) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
      prevDate = currDate;
    } else {
      break;
    }
  }

  return streak;
};

// 📊 weekly mood summary
const getWeeklyMoodSummary = (entries) => {
  const summary = {};

  entries.forEach(e => {
    summary[e.mood] = (summary[e.mood] || 0) + 1;
  });

  return summary;
};


// 🔖 convert score → label
const getSentimentLabel = (score) => {
  if (score > 0.3) return "positive";
  if (score < -0.3) return "negative";
  return "neutral";
};

// 💡 rule-based logic
const generateRuleBasedSuggestions = (recentEntries, mood) => {
  const suggestions = [];

  const negativeCount = recentEntries.filter(
    e => e.sentimentLabel === "negative"
  ).length;

  if (negativeCount >= 2) {
    suggestions.push(
      "You’ve been feeling low recently. Try taking short breaks or practicing mindfulness."
    );
  }

  if (mood === "stressed") {
    suggestions.push(
      "Try a 2-minute deep breathing exercise to reduce stress."
    );
  }

  if (mood === "angry") {
    suggestions.push(
      "Writing down what triggered this feeling may help you calm down."
    );
  }

  return suggestions;
};

/**
 * ✍️ Create new journal entry
 */
export const createJournalEntry = async (req, res) => {
  try {
    console.log("req.userId:", req.userId);
    console.log("req.user:", req.user);
    const { entryText, mood } = req.body;

    if (!entryText?.trim()) {
      return res.status(400).json({ message: "Journal entry cannot be empty" });
    }

    const userId = req.user.id; // ✅ FIX

    // 🔹 TEMP sentiment
    const sentimentScore = 0;
    const sentimentLabel = getSentimentLabel(sentimentScore);

    // 🔹 fetch recent journals
    const recentEntries = await JournalEntry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3);

    const aiSuggestions = generateRuleBasedSuggestions(
      recentEntries,
      mood || "neutral"
    );

    const newEntry = await JournalEntry.create({
      user: userId, // ✅ FIX
      entryText,
      mood: mood || "neutral",
      aiSummary: "",
      aiSuggestions,
      sentimentScore,
      sentimentLabel
    });

    res.status(201).json({
      success: true,
      message: "Journal created successfully",
      entry: newEntry,
    });

  } catch (error) {
    console.error("❌ Error creating journal:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * 📚 Get all journals for logged-in user
 */
export const getAllJournals = async (req, res) => {
  try {
    const journals = await JournalEntry
      .find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(journals);

  } catch (error) {
    console.error("❌ Error fetching journals:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 🔍 Get single journal by ID
 */
export const getJournalById = async (req, res) => {
  try {
    const journal = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);

  } catch (error) {
    console.error("❌ Error fetching journal by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 📝 Update journal
 */
export const updateJournalEntry = async (req, res) => {
  try {
    const { entryText, mood, aiSummary, aiSuggestions, sentimentScore } = req.body;

    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },

      {
        ...(entryText && { entryText }),
        ...(mood && { mood }),
        ...(aiSummary && { aiSummary }),
        ...(aiSuggestions && { aiSuggestions }),
        ...(sentimentScore && { sentimentScore }),
        updatedAt: new Date()
      },

      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({
      success: true,
      message: "Journal updated",
      entry: updated,
    });

  } catch (error) {
    console.error("❌ Error updating journal:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 🗑 Delete journal
 */
export const deleteJournalEntry = async (req, res) => {
  try {
    const deleted = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({
      success: true,
      message: "Journal deleted successfully"
    });

  } catch (error) {
    console.error("❌ Error deleting journal:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * 📊 Mood analytics (streak + weekly trends)
 */
export const getMoodAnalytics = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    if (!entries.length) {
      return res.json({
        success: true,
        streak: 0,
        weeklySummary: {}
      });
    }

    // 🔥 streak
    const streak = calculateStreak(entries);

    // 📊 last 7 days
    const last7Days = entries.filter(e => {
      const diff =
        (Date.now() - new Date(e.createdAt)) /
        (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    const weeklySummary = getWeeklyMoodSummary(last7Days);

    res.json({
      success: true,
      streak,
      weeklySummary
    });

  } catch (error) {
    console.error("❌ Mood analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const regenerateAI = async (req, res) => {
  try {
    const journalId = req.params.id;
    const userId = req.userId; // ✅ CONSISTENT

    // ✅ Use JournalEntry (correct model)
    const journal = await JournalEntry.findOne({
      _id: journalId,
      user: userId,
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found",
      });
    }

    // 🔄 Reset AI fields
    journal.aiSummary = "";
    journal.aiSuggestions = [];
    journal.sentimentScore = 0;
    journal.sentimentLabel = "neutral";

    await journal.save();

    // 🚀 Respond immediately
    res.status(200).json({
      success: true,
      message: "AI regeneration started",
    });

    // 🧠 Async AI processing
    (async () => {
      try {
        const aiResult = await generateAIInsights(journal.entryText);

        journal.aiSummary = aiResult.summary;
        journal.aiSuggestions = aiResult.suggestions;
        journal.sentimentScore = aiResult.sentimentScore;
        journal.sentimentLabel = aiResult.sentimentLabel;

        await journal.save();
      } catch (err) {
        console.error("AI regeneration failed:", err);
      }
    })();

  } catch (error) {
    console.error("Regenerate AI error:", error);
  }
};


export const getWeeklyAIInsights = async (req, res) => {
  try {
    const userId = req.userId;

    // 📅 Last 7 days
    const last7Days = await JournalEntry.find({
      user: userId,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    }).sort({ createdAt: 1 });

    if (!last7Days.length) {
      return res.json({
        success: true,
        insights: null,
        message: "Not enough journal data",
      });
    }

    const insights = await generateWeeklyInsights(last7Days);

    res.json({
      success: true,
      insights,
    });

  } catch (error) {
    console.error("❌ Weekly AI controller error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
