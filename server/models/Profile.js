import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  // 👤 Basic info
  name: { type: String, default: "" },
  age: { type: Number, default: null },
  gender: { type: String, default: "prefer not to say" },
  avatar: { type: String, default: "" },

  // 🧠 Mental health preferences
  preferences: {
    tone: { type: String, default: "friendly" },        // friendly, clinical, motivational, spiritual
    responseLength: { type: String, default: "medium" },// short, medium, detailed
    theme: { type: String, default: "light" },          // light, dark
  },

  // 📔 Optional journal or mood stats (expandable)
  moodHistory: [
    {
      mood: { type: String },
      note: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],

}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
