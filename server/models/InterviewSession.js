const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    experienceLevel: {
      type: String,
      required: true,
    },

    skills: {
      type: String,
    },

    questions: [
      {
        question: {
          type: String,
        },

        answer: {
          type: String,
        },

        feedback: {
          score: {
            type: Number,
          },

          strengths: [
            {
              type: String,
            },
          ],

          improvements: [
            {
              type: String,
            },
          ],

          nextQuestion: {
            type: String,
          },
        },
      },
    ],

    finalScore: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSchema);