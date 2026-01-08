import mongoose from "mongoose";

const WeeklyInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    summary: {
      type: String,
      default: "",
    },

    dominantMoods: {
      type: [String],
      default: [],
    },

    mentalTrend: {
      type: String,
      default: "",
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// 🛑 Prevent duplicate insights for same week
WeeklyInsightSchema.index(
  { user: 1, weekStart: 1 },
  { unique: true }
);

export default mongoose.model(
  "WeeklyInsight",
  WeeklyInsightSchema
);
