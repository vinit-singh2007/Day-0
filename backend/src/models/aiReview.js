import mongoose from "mongoose";

const aiReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    domainName: {
      type: String,
      required: true,
    },

    // Skill breakdown scores (0 - 100)
    skillScore: {
      technicalScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      problemSolvingScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      communicationScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
    },

    // AI Predicted Salary
    salaryPrediction: {
      minSalary: {
        type: Number,
        required: true,
      },
      maxSalary: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // Recommendations & Feedback lists
    aiSuggestions: [
      {
        type: String,
      },
    ],

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AIReview = mongoose.model("AIReview", aiReviewSchema);

export default AIReview;