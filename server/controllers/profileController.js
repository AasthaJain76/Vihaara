import Profile from "../models/Profile.js";
import User from "../models/User.js";

/**
 * 🧠 Create or Update Logged-in User Profile
 */
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Profile data (stored in Profile Model)
    const profileData = {
      age: req.body.age,
      gender: req.body.gender,
      avatar: req.body.avatar,
    };

    // Update User Preferences
    if (req.body.preferences) {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            "preferences.tone": req.body.preferences.tone,
            "preferences.responseLength": req.body.preferences.responseLength,
            "preferences.theme": req.body.preferences.theme,
          },
        },
        { new: true }
      );
    }

    // Create or Update Profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true }
    ).populate("userId", "name email");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};


/**
 * 👤 Get Logged-in User Profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id })
      .populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};


/**
 * 🔍 Get Any User Profile by ID
 */
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId })
      .populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Get profile by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};


/**
 * 🗑 Delete Logged-in User + Profile
 */
export const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    await Profile.findOneAndDelete({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account and profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete account error:", error);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
};
