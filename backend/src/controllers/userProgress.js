import { Submission } from '../models/submission.js';

// 1. User ki domain-wise progress fetch karne ka controller
export const getUserProgress = async (req, res) => {
  try {
    const { domain } = req.params;
    // JWT Authentication middleware se req.user._id milega
    const userId = req.user?._id || req.query.userId; 

    if (!userId) {
      return res.status(400).json({ error: "User ID missing hai." });
    }

    const submission = await Submission.findOne({ userId, domain });

    if (!submission) {
      return res.status(200).json({ completedDays: [] });
    }

    return res.status(200).json({ 
      completedDays: submission.completedDays || [] 
    });
  } catch (error) {
    console.error("Progress fetch Error:", error);
    return res.status(500).json({ error: "Progress load nahi ho payi." });
  }
};

// 2. Assessment Evaluation aur DB me Save karne ka controller
export const evaluateAssessment = async (req, res) => {
  try {
    const { domain, day, userResponse, taskTitle } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!userId || !domain || !day) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 🤖 Yahan aapka AI Evaluation logic aayega (e.g., OpenAI / Gemini API call)
    const evalResult = {
      score: 85,
      feedback: "Good attempt! Solution is structured well.",
      status: "PASS"
    };

    // 💾 MongoDB me Save/Update (Upsert)
    // $addToSet: duplicate day array me enter nahi hone dega
    const updatedSubmission = await Submission.findOneAndUpdate(
      { userId, domain },
      { 
        $addToSet: { completedDays: day },
        $push: { 
          responses: { 
            day, 
            response: userResponse, 
            taskTitle,
            evaluation: evalResult,
            submittedAt: new Date()
          } 
        }
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      evaluation: evalResult,
      completedDays: updatedSubmission.completedDays
    });

  } catch (error) {
    console.error("Evaluation Error:", error);
    return res.status(500).json({ error: "Evaluation process fail ho gaya." });
  }
};