import mongoose from "mongoose";
const mindfulnessActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["meditation", "breathing", "sound", "focus", "spiritual", "motivational", "mind relaxing", "feeling low"], 
    required: true 
  },
  duration: { type: Number },
  resourceUrl: { type: String },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model("MindfulnessActivity", mindfulnessActivitySchema);
