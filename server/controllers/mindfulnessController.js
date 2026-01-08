import MindfulnessActivity from "../models/MindfulnessActivity.js";

const validCategories = ["meditation", "breathing", "sound", "focus", "spiritual","motivational","feeling low","mind relaxing"];

// GET all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await MindfulnessActivity.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      activities,
    });
  } catch (err) {
    console.error("❌ Error fetching activities:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET activities by category
export const getActivitiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(", ")}`
      });
    }

    const activities = await MindfulnessActivity.find({ category });

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (err) {
    console.error("❌ Error fetching category activities:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE new activity
export const createActivity = async (req, res) => {
  try {
    const { title, category, duration, resourceUrl, description } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Title is required and must be a string." });
    }
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category is required and must be one of: ${validCategories.join(", ")}`
      });
    }
    if (duration && typeof duration !== "number") {
      return res.status(400).json({ success: false, message: "Duration must be a number." });
    }
    if (resourceUrl && typeof resourceUrl !== "string") {
      return res.status(400).json({ success: false, message: "Resource URL must be a string." });
    }
    if (description && typeof description !== "string") {
      return res.status(400).json({ success: false, message: "Description must be a string." });
    }

    const activity = await MindfulnessActivity.create({ title, category, duration, resourceUrl, description });

    res.status(201).json({
      success: true,
      activity,
    });
  } catch (err) {
    console.error("❌ Error creating activity:", err);
    res.status(500).json({ message: "Server error" });
  }
};
