const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    skills: { type: String },

    questions: [
      {
        question: String,
        answer: String,
        feedback: {
          score: Number,
          strengths: [String],
          improvements: [String],
        },
      },
    ],

    finalScore: Number,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSchema);