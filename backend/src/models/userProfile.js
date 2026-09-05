import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ⚠️ DHYAN DEIN: Ye naam bilkul same hona chahiye jo User model me mongoose.model("User", ...) me diya hai
      required: true,
      unique: true,
      index: true,
    },

    bio: {
      type: String,
      default: "I am a student",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

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

const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;