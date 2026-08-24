import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  domain: { 
    type: String, 
    required: true 
  },
  completedDays: [{ 
    type: Number 
  }], // Array of numbers e.g. [1, 2, 3]
  responses: [{
    day: Number,
    response: String,
    evaluation: Object,
    submittedAt: { type: Date, default: Date.now }
  }],
  // 💾 Naya field: AI review ko cache / store karne ke liye
  aiReview: {
    type: Object,
    default: null
  }
}, { timestamps: true });

// Ek User ka Ek Domain me sirf 1 Unique Submission record rahega
submissionSchema.index({ userId: 1, domain: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);