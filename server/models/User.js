import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Identity
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // 🎛 User’s AI Preferences (global)
    preferences: {
      tone: {
        type: String,
        enum: ["friendly", "clinical", "motivational", "spiritual"],
        default: "friendly",
      },
      responseLength: {
        type: String,
        enum: ["short", "medium", "detailed"],
        default: "medium",
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },

    // 🕒 Activity Tracking
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    streakCount: {
      type: Number,
      default: 0,
    },

    // 🔐 Access Level
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🆘 Optional: For future password reset + email verification
    resetToken: String,
    resetTokenExpire: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
