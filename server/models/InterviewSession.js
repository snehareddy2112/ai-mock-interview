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
      default: "",
    },

    interviewType: {
      type: String,
      default: "Technical",
      enum: ["Technical", "Behavioral (STAR)", "System Design", "HR & Cultural"],
    },

    targetCompany: {
      type: String,
      default: "General Tech",
    },

    targetQuestionsCount: {
      type: Number,
      default: 5,
    },

    jobDescription: {
      type: String,
      default: "",
    },

    currentQuestion: {
      type: String,
      default: "",
    },

    questions: [
      {
        question: {
          type: String,
        },

        answer: {
          type: String,
        },

        timeTakenSeconds: {
          type: Number,
          default: 0,
        },

        feedback: {
          score: {
            type: Number,
          },

          technicalAccuracy: {
            type: Number,
            default: 7,
          },

          communication: {
            type: Number,
            default: 7,
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