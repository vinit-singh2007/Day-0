import dotenv from "dotenv";
dotenv.config();

import { Submission } from "../models/submission.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFullAIReview = async (req, res) => {
  try {
    // 1. Extract userId & domain (req.user support for verifyToken middleware)
    const userId = req.body?.userId || req.user?.id || req.user?._id;
    const domain = req.body?.domain;

    // Parameter validation to avoid 400 Bad Request
    if (!userId || !domain) {
      return res.status(400).json({
        error: "Both userId and domain are required parameters."
      });
    }

    // 2. Case-insensitive & Hyphen/Underscore flexible Regex for Domain Matching
    const sanitizedDomain = domain.trim();
    const domainRegex = new RegExp(`^${sanitizedDomain.replace(/[-_]/g, '[-_ ]?')}$`, 'i');

    const submissionDoc = await Submission.findOne({
      userId: userId,
      domain: { $regex: domainRegex }
    });

    const currentCount = submissionDoc?.responses?.length || 0;

    // 3. Completion Check (Must have completed 7 days)
    if (!submissionDoc || currentCount < 7) {
      return res.status(400).json({
        error: `Please complete all 7 days before requesting a review. Current completed: ${currentCount}/7`
      });
    }

    // 🚀 4. Check if AI review is already cached in Database
    if (submissionDoc.aiReview && Object.keys(submissionDoc.aiReview).length > 0) {
      console.log("Serving AI Review from Database Cache (No API Call) ⚡");
      return res.status(200).json(submissionDoc.aiReview);
    }

    // 5. Generate fresh AI Review using Gemini API
    console.log("Generating fresh AI Review from Gemini API...");
    const sortedResponses = submissionDoc.responses.sort((a, b) => a.day - b.day);

    const formattedSubmissions = sortedResponses.map((sub) => `
      Day ${sub.day}:
      Task: ${sub.taskTitle || "N/A"}
      User Response: ${sub.response}
    `).join("\n\n---\n\n");

    const prompt = `
      You are an expert AI Technical Recruiter evaluating a candidate's 7-day practical assessment for the domain: "${sanitizedDomain}".

      Candidate's Submissions:
      ${formattedSubmissions}

      Analyze all 7 days of performance and generate a JSON response strictly matching this structure:
      {
        "overallScore": number (0-100),
        "overallSummary": "A comprehensive paragraph evaluating candidate's overall readiness, consistency, and depth of technical knowledge.",
        "salaryPrediction": {
          "minSalary": number (e.g. 500000),
          "maxSalary": number (e.g. 900000),
          "currency": "INR"
        },
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

    // Official Gemini 1.5 Flash Model configuration with JSON mime-type enforcement
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    // Clean JSON formatting
    const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    // 💾 6. Save generated review to database
    submissionDoc.aiReview = parsedData;
    await submissionDoc.save();

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error("Error generating full AI review:", error);
    return res.status(500).json({ error: "Failed to generate comprehensive review." });
  }
};