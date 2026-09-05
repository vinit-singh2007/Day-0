import { Submission } from "../models/submission.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing.",
      });
    }

    // Latest submissions pehle lane ke liye timestamp base par sort karein
    const submissions = await Submission.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json(submissions);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};