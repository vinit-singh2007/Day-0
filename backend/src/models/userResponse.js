import mongoose from "mongoose";

// Per-day LLM evaluation schema (No salary prediction here)
const dailyEvaluationSchema = new mongoose.Schema(
  {
    skillScore: {
      technicalScore: { type: Number, default: 0 },
      problemSolvingScore: { type: Number, default: 0 },
      communicationScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
    },
    aiSuggestions: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
  },
  { _id: false }
);

const singleResponseSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    questionId: {
      type: String,
    },
    questionText: {
      type: String,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    evaluation: {
      type: dailyEvaluationSchema,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const userResponseSchema = new mongoose.Schema(
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

    // Track completed days (e.g., [1, 2, 3])
    completedDays: [
      {
        type: Number,
      },
    ],

    // Daily responses & evaluations
    responses: [singleResponseSchema],

    // Link to Full AI Review (Contains final Salary Prediction)
    aiReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIReview",
      default: null,
    },

    status: {
      type: String,
      enum: ["SUBMITTED", "PROCESSING_AI", "COMPLETED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

// One unique domain response collection per user
userResponseSchema.index({ userId: 1, domainName: 1 }, { unique: true });

const UserResponse = mongoose.model("UserResponse", userResponseSchema);
export default UserResponse;