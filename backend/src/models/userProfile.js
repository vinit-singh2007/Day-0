import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "i am a student",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    // User ne jitne bhi domains me simulation kiye hain
    domainsAttempted: [
      {
        domainName: {
          type: String,
          required: true, // e.g., "Software Engineer", "Data Analyst"
        },
        status: {
          type: String,
          enum: ["IN_PROGRESS", "COMPLETED", "FAILED"],
          default: "IN_PROGRESS",
        },
        scoreObtained: {
          type: Number,
          default: 0,
        },
        timeSpentInMinutes: {
          type: Number,
          default: 0,
        },
        completedAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;