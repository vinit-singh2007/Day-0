import dotenv from "dotenv";
dotenv.config();

import { Submission } from "../models/submission.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFullAIReview = async (req, res) => {
  try {
    const { userId, domain } = req.body;

    const submissionDoc = await Submission.findOne({ userId, domain });

    const currentCount = submissionDoc?.responses?.length || 0;
    if (!submissionDoc || currentCount < 7) {
      return res.status(400).json({
        error: `Please complete all 7 days before requesting a review. Current completed: ${currentCount}/7`
      });
    }

    // 🚀 1. Check karo ki kya review pehle se database me saved hai ya nahi?
    if (submissionDoc.aiReview && Object.keys(submissionDoc.aiReview).length > 0) {
      console.log("Serving AI Review from Database Cache (No API Call) ⚡");
      return res.status(200).json(submissionDoc.aiReview);
    }

    // 2. Agar saved nahi hai, tabhi Gemini API ko call karo
    console.log("Generating fresh AI Review from Gemini API...");
    const sortedResponses = submissionDoc.responses.sort((a, b) => a.day - b.day);

    const formattedSubmissions = sortedResponses.map((sub) => `
      Day ${sub.day}:
      Task: ${sub.taskTitle || "N/A"}
      User Response: ${sub.response}
    `).join("\n\n---\n\n");

    const prompt = `
      You are an expert AI Technical Recruiter evaluating a candidate's 7-day practical assessment for the domain: "${domain}".

      Candidate's Submissions:
      ${formattedSubmissions}

      Analyze all 7 days of performance and generate a JSON response strictly matching this structure:
      {
        "overallScore": number (0-100),
        "overallSummary": "A comprehensive paragraph evaluating candidate's overall readiness, consistency, and depth of technical knowledge.",
        "keyQualities": ["Quality 1", "Quality 2", "Quality 3", "Quality 4"],
        "topRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
        "dailyBreakdown": [
          {
            "day": 1,
            "score": number (0-100),
            "feedback": "Short feedback for Day 1",
            "strengths": ["Strength 1"],
            "improvements": ["Improvement 1"]
          }
        ]
      }

      Return ONLY valid raw JSON. Do not write markdown backticks or extra text.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    // 💾 3. Generated review ko database me save kar do taaki agli baar API call na ho
    submissionDoc.aiReview = parsedData;
    await submissionDoc.save();

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error("Error generating full AI review:", error);
    return res.status(500).json({ error: "Failed to generate comprehensive review." });
  }
};