import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    domain: { type: String, required: true },
    day: { type: Number, required: true },
    userResponse: { type: String, required: true },
    taskTitle: { type: String },
    score: { type: Number },
    feedback: { type: String }
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);