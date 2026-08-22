import mongoose from "mongoose";

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
    // Simulation questions and user's raw answers
    responses: [
      {
        questionId: String,
        questionText: String,
        userAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["SUBMITTED", "PROCESSING_AI", "COMPLETED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

const UserResponse = mongoose.model("UserResponse", userResponseSchema);
export default UserResponse;