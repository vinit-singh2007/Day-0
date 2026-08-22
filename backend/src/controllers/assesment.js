import { GoogleGenAI, Type } from "@google/genai";
import AIReview from "../models/aiReview.js";

export const handleAssesment = async (req, res) => {
  try {
    // 1. Extract userId (supports auth middleware or request body)
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ error: "User identity missing. Please log in again." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server API key configuration error." });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 2. Destructure properties
    const { domain, day, userResponse, taskTitle, dataset, scenario, task, submission } = req.body;

    if (!userResponse || userResponse.trim().length < 10) {
      return res.status(400).json({ error: "Please provide a detailed response before submitting." });
    }

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
      Provide realistic entry-to-mid level salary predictions in INR based on their solution quality.
    `;

    // 3. Retry mechanism
    let response;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash", // Correct model identifier
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
                salaryPrediction: {
                  type: Type.OBJECT,
                  properties: {
                    minSalary: { type: Type.INTEGER },
                    maxSalary: { type: Type.INTEGER },
                    currency: { type: Type.STRING },
                  },
                  required: ["minSalary", "maxSalary", "currency"],
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
              required: ["skillScore", "salaryPrediction", "aiSuggestions", "strengths", "weaknesses"],
            },
          },
        });
        break; // Success
      } catch (err) {
        attempts++;
        console.warn(`Attempt ${attempts} failed. Retrying...`);
        if (attempts >= maxAttempts) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const parsedData = JSON.parse(response.text);

    // 4. Save review directly in MongoDB
    const newReview = await AIReview.create({
      userId,
      domainName: domain,
      skillScore: parsedData.skillScore,
      salaryPrediction: parsedData.salaryPrediction,
      aiSuggestions: parsedData.aiSuggestions,
      strengths: parsedData.strengths,
      weaknesses: parsedData.weaknesses,
    });

    return res.status(200).json({
      score: parsedData.skillScore.overallScore,
      feedback: parsedData.aiSuggestions.join(" "),
      strengths: parsedData.strengths,
      improvements: parsedData.weaknesses,
      reviewId: newReview._id,
    });

  } catch (error) {
    console.error("Database or AI Error:", error);
    return res.status(500).json({ error: "Failed to evaluate assessment due to connection error." });
  }
};

// export const handleAssesment = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.body.userId;
//     const { domain, day, userResponse } = req.body;

//     if (!userResponse || userResponse.trim().length < 10) {
//       return res.status(400).json({ error: "Please provide a detailed response before submitting." });
//     }

//     // ==========================================
//     // 🧪 TESTING MODE (MOCK RESPONSE)
//     // Real Gemini API call skip karne ke liye:
//     // ==========================================
    
//     // Fake delay taaki loading spinner check kar sako (1.5 seconds)
//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     // Mock AI JSON Data
//     const parsedData = {
//       skillScore: {
//         technicalScore: 85,
//         problemSolvingScore: 80,
//         communicationScore: 90,
//         overallScore: 85,
//       },
//       salaryPrediction: {
//         minSalary: 600000,
//         maxSalary: 900000,
//         currency: "INR",
//       },
//       aiSuggestions: [
//         "Great structure and clean code logic.",
//         "Consider optimizing time complexity for edge cases."
//       ],
//       strengths: ["Clear approach", "Good handling of state"],
//       weaknesses: ["Needs better error handling"],
//     };

//     // Save mock review directly in MongoDB
//     const newReview = await AIReview.create({
//       userId,
//       domainName: domain,
//       skillScore: parsedData.skillScore,
//       salaryPrediction: parsedData.salaryPrediction,
//       aiSuggestions: parsedData.aiSuggestions,
//       strengths: parsedData.strengths,
//       weaknesses: parsedData.weaknesses,
//     });

//     // Frontend ko direct dummy response bhej do
//     return res.status(200).json({
//       score: parsedData.skillScore.overallScore,
//       feedback: parsedData.aiSuggestions.join(" "),
//       strengths: parsedData.strengths,
//       improvements: parsedData.weaknesses,
//       reviewId: newReview._id,
//     });

//     // ==========================================
//     // REAL GEMINI API CALL (Testing ke baad uncomment kar lena)
//     // ==========================================
//     /*
//     const ai = new GoogleGenAI({ apiKey });
//     ... (tumhara original Gemini wala code) ...
//     */

//   } catch (error) {
//     console.error("Database or AI Error:", error);
//     return res.status(500).json({ error: "Failed to evaluate assessment due to connection error." });
//   }
// };