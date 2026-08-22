import { Submission } from "../models/submission.js"; // Aapka submission model
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFullAIReview = async (req, res) => {
  try {
    const { userId, domain } = req.body;

    // 1. Database se saare 7 days ke submissions fetch karein
    const submissions = await Submission.find({ userId, domain }).sort({ day: 1 });

    // Guard Clause: Agar 7 days poore nahi hain
    if (!submissions || submissions.length < 7) {
      return res.status(400).json({
        error: `Please complete all 7 days before requesting a review. Current completed: ${submissions.length}/7`
      });
    }

    // 2. AI Prompt ke liye submissions data structure ready karna
    const formattedSubmissions = submissions.map((sub) => `
      Day ${sub.day}:
      Task: ${sub.taskTitle || "N/A"}
      User Response: ${sub.userResponse}
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
          // repeat for all 7 days
        ]
      }

      Return ONLY valid raw JSON. Do not write markdown backticks or extra text.
    `;

    // 3. AI Call
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    // Clean JSON response
    const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error("Error generating full AI review:", error);
    return res.status(500).json({ error: "Failed to generate comprehensive review." });
  }
};

// export const getFullAIReview = async (req, res) => {
//   try {
//     const { userId, domain } = req.body;

//     // Fast testing response (Dummy Data)
//     const mockResponse = {
//       overallScore: 88,
//       overallSummary: `Candidate has demonstrated strong practical expertise in ${domain || "Software Engineering"}. Throughout the 7-day assessment, they showed consistent problem-solving skills, structured approach to tasks, and high code quality. Minor improvements are needed in performance optimization and edge-case handling.`,
//       keyQualities: [
//         "Strong Architectural & Design Thinking",
//         "Clean & Scalable Code Writing",
//         "Consistent Task Completion Rate",
//         "Good Understanding of Core Domain Concepts"
//       ],
//       topRecommendations: [
//         "Focus more on edge-case testing and performance bottlenecks.",
//         "Implement better error handling for network-level failures.",
//         "Deepen knowledge in advanced deployment and monitoring strategies."
//       ],
//       dailyBreakdown: Array.from({ length: 7 }, (_, index) => ({
//         day: index + 1,
//         score: Math.floor(Math.random() * (95 - 75 + 1)) + 75,
//         feedback: `Day ${index + 1} task was completed successfully. The solution was structured well and fulfilled all primary acceptance criteria.`,
//         strengths: [
//           `Clear logic implementation for Day ${index + 1}`,
//           "Adherence to task guidelines"
//         ],
//         improvements: [
//           "Code structure could be made slightly more modular"
//         ]
//       }))
//     };

//     // Delay simulation (1 second) to feel like real AI processing
//     setTimeout(() => {
//       return res.status(200).json(mockResponse);
//     }, 1000);

//   } catch (error) {
//     return res.status(500).json({ error: "Failed to load mock evaluation data." });
//   }
// };