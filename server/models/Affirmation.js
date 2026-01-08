import mongoose from "mongoose";

const affirmationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Affirmation", affirmationSchema);
