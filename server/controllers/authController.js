import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import generateToken from "../utils/generateToken.js";

/* ==========================================================================
   REGISTER USER + AUTO CREATE PROFILE
========================================================================== */
export const registerUser = async (req, res) => {
  let { email, password, name, preferences } = req.body;

  try {
    email = email.toLowerCase(); // 🟩 Normalize email

    // 1️⃣ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // 2️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 3️⃣ Create User
    const newUser = await User.create({
      email,
      passwordHash,
      name,
      preferences: preferences || {
        aiTone: "friendly",
        responseLength: "medium",
        storeChatHistory: true,
      },
    });

    // 4️⃣ Auto-create profile
    const profile = await Profile.create({
      userId: newUser._id,
      name: newUser.name,
      avatar: "",
      preferences: newUser.preferences,

      // Vihaara-specific fields
      moodHistory: [],
      streaks: {
        journaling: 0,
        moodTracking: 0,
        mindfulness: 0,
      },
      lastMoodDate: null,
      journalsCount: 0,
      aiChatCount: 0,
    });

    // 5️⃣ Generate JWT
    const token = generateToken({ id: newUser._id });

    // 6️⃣ Send Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        preferences: newUser.preferences,
      },
      profile,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================================
   LOGIN USER
========================================================================== */
export const loginUser = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = generateToken({ id: user._id });

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================================
   GET LOGGED-IN USER
========================================================================== */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================================================
   LOGOUT (Client-Side Token Removal)
========================================================================== */
export const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully — remove token on client side",
  });
};
