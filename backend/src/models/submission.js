import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  day: Number,
  taskTitle: String,
  response: String,
  evaluation: Object,
  submittedAt: Date,
});

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    completedDays: [Number],
    responses: [responseSchema],

    // ❌ PEHLE (Galt): aiReview: mongoose.Schema.Types.ObjectId
    // ✅ AB (Sahi): Type ko Object ya Schema.Types.Mixed karein
    aiReview: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);