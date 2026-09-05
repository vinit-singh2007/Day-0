import { GoogleGenAI, Type } from "@google/genai";
import { Submission } from "../models/submission.js";
import NodeCache from "node-cache";

// Initialize cache: standard TTL of 1 hour (3600 seconds)
const assessmentCache = new NodeCache({ stdTTL: 3600 });

// 1. 🛠️ User Progress fetch karne ka handler (GET request ke liye)
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const { domain } = req.params;

    if (!userId || !domain) {
      return res.status(400).json({ error: "User ID aur Domain zaroori hain." });
    }

    // Database se user ka submission status fetch karein
    const submission = await Submission.findOne({ userId, domain });

    if (!submission) {
      return res.status(200).json({ completedDays: [] });
    }

    return res.status(200).json({ completedDays: submission.completedDays || [] });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return res.status(500).json({ error: "Progress fetch nahi ho payi." });
  }
};

// 2. 🛠️ Daily Assessment evaluate karne aur DB me Save karne ka handler
export const handleAssesment = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ error: "User identity missing. Please log in again." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server API key configuration error." });
    }

    const { domain, day, userResponse, taskTitle, dataset, scenario, task, submission } = req.body;

    if (!userResponse || userResponse.trim().length < 10) {
      return res.status(400).json({ error: "Please provide a detailed response before submitting." });
    }

    // 💡 Caching Step: Unique cache key based on user response, domain, and day
    const cacheKey = `assessment_${userId}_${domain}_${day}_${userResponse.trim()}`;

    if (assessmentCache.has(cacheKey)) {
      console.log("⚡ Serving assessment evaluation from cache...");
      const cachedData = assessmentCache.get(cacheKey);
      
      const updatedSubmission = await Submission.findOneAndUpdate(
        { userId, domain },
        {
          $addToSet: { completedDays: Number(day) },
          $push: {
            responses: {
              day: Number(day),
              response: userResponse,
              taskTitle: taskTitle,
              evaluation: cachedData.parsedData,
              submittedAt: new Date(),
            },
          },
        },
        { upsert: true, returnDocument: 'after' } 
      );

      return res.status(200).json({
        score: cachedData.parsedData.skillScore.overallScore,
        feedback: cachedData.parsedData.aiSuggestions.join(" "),
        strengths: cachedData.parsedData.strengths,
        improvements: cachedData.parsedData.weaknesses,
        completedDays: updatedSubmission.completedDays,
        source: "cache"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an industry technical assessor evaluating a candidate's submission for a ${domain} role.

      --- QUESTION & CONTEXT ---
      Day: ${day}
      Task Title: ${taskTitle}
      Target Dataset: ${dataset}
      Company Scenario: ${scenario}
      Assigned Task: ${task}
      Submission Requirement: ${submission}

      --- CANDIDATE RESPONSE ---
      "${userResponse}"

      --- INSTRUCTIONS ---
      Evaluate technical competency, problem-solving skills, and communication quality.
      Do NOT provide salary estimations for individual daily submissions.
    `;

    let response;
    let attempts = 0;
    const maxAttempts = 3;

    // 💡 Robust Retry Loop with Exponential Back-off for 429 Errors
    while (attempts < maxAttempts) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash", 
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                skillScore: {
                  type: Type.OBJECT,
                  properties: {
                    technicalScore: { type: Type.INTEGER },
                    problemSolvingScore: { type: Type.INTEGER },
                    communicationScore: { type: Type.INTEGER },
                    overallScore: { type: Type.INTEGER },
                  },
                  required: ["technicalScore", "problemSolvingScore", "communicationScore", "overallScore"],
                },
                aiSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                weaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["skillScore", "aiSuggestions", "strengths", "weaknesses"],
            },
          },
        });
        break; 
      } catch (err) {
        attempts++;
        console.warn(`Attempt ${attempts} failed. Error: ${err.message}`);
        
        if (attempts >= maxAttempts) throw err;

        const waitTime = attempts === 1 ? 5000 : 14000; 
        console.log(`Waiting ${waitTime / 1000} seconds before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    const parsedData = JSON.parse(response.text);

    // 💾 DB Step: Fixed deprecated option 'new: true' -> 'returnDocument: "after"'
    const updatedSubmission = await Submission.findOneAndUpdate(
      { userId, domain },
      {
        $addToSet: { completedDays: Number(day) },
        $push: {
          responses: {
            day: Number(day),
            response: userResponse,
            taskTitle: taskTitle,
            evaluation: parsedData,
            submittedAt: new Date(),
          },
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    // 💡 Save result into Cache
    assessmentCache.set(cacheKey, { parsedData });

    return res.status(200).json({
      score: parsedData.skillScore.overallScore,
      feedback: parsedData.aiSuggestions.join(" "),
      strengths: parsedData.strengths,
      improvements: parsedData.weaknesses,
      completedDays: updatedSubmission.completedDays,
      source: "api"
    });

  } catch (error) {
    console.error("Database or AI Error:", error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: "AI rate limit reached. Please wait roughly 15 seconds before submitting your response again." 
      });
    }

    return res.status(500).json({ error: "Failed to evaluate assessment due to connection error." });
  }
};

// 3. 🎯 INTEGRATED: Next Milestone Dashboard Card Fetch Handler
export const getUserMilestone = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // User ke saare active & completed domain submissions fetch karein
    const submissions = await Submission.find({ userId });

    if (!submissions || submissions.length === 0) {
      return res.status(200).json({
        hasActiveDomain: false,
        message: "No active domain found. Please start a domain assessment.",
      });
    }

    // Active domain search: Jo incomplete ho (completedDays < 7)
    const activeSubmission = submissions.find(
      (sub) => !sub.completedDays || sub.completedDays.length < 7
    );

    if (!activeSubmission) {
      return res.status(200).json({
        hasActiveDomain: false,
        message: "All domains completed successfully!",
      });
    }

    const completedCount = activeSubmission.completedDays ? activeSubmission.completedDays.length : 0;
    const currentDay = completedCount + 1;
    const remainingDays = 7 - completedCount;
    const progressPercentage = Math.round((completedCount / 7) * 100);

    return res.status(200).json({
      hasActiveDomain: true,
      domain: activeSubmission.domain,
      currentLevel: `Level ${currentDay}`,
      completedDaysCount: completedCount,
      remainingDays: remainingDays,
      progressPercentage: progressPercentage,
    });
  } catch (error) {
    console.error("Milestone fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard milestone data" });
  }
};