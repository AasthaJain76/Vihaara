import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Store numeric mood (1-5)
  moodValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  // Auto-generated label
  moodLabel: {
    type: String,
    enum: ["very sad", "sad", "neutral", "happy", "very happy"],
    required: true,
  },

  note: { type: String, default: "" },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("MoodLog", moodLogSchema);
