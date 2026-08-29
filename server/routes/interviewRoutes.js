const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const InterviewSession = require("../models/InterviewSession");
const { fetchFirstQuestion } = require("../controllers/aiController");

// Create new interview session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      role,
      experienceLevel,
      skills,
      interviewType = "Technical",
      targetCompany = "General Tech",
      targetQuestionsCount = 5,
      jobDescription = "",
    } = req.body;

    if (!role || !experienceLevel) {
      return res.status(400).json({ message: "Role and experience level are required" });
    }

    // Generate first question cleanly based on role, type, company, and JD
    const firstQuestion = await fetchFirstQuestion({
      role: role.trim(),
      experienceLevel: experienceLevel.trim(),
      skills: skills ? skills.trim() : "",
      interviewType,
      targetCompany,
      jobDescription,
    });

    const session = await InterviewSession.create({
      role: role.trim(),
      experienceLevel: experienceLevel.trim(),
      skills: skills ? skills.trim() : "",
      interviewType,
      targetCompany,
      targetQuestionsCount: Number(targetQuestionsCount) || 5,
      jobDescription: jobDescription ? jobDescription.trim() : "",
      user: req.user,
      currentQuestion: firstQuestion,
      questions: [],
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ message: "Failed to create interview session" });
  }
});

// Get all sessions for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single session for the authenticated user
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Guarantee that an active session always has a question to display
    if (
      !session.isCompleted &&
      (!session.currentQuestion || session.currentQuestion.trim() === "") &&
      (!session.questions || session.questions.length === 0)
    ) {
      const generatedQ = await fetchFirstQuestion({
        role: session.role,
        experienceLevel: session.experienceLevel,
        skills: session.skills,
        interviewType: session.interviewType,
        targetCompany: session.targetCompany,
        jobDescription: session.jobDescription,
      });

      session.currentQuestion = generatedQ;
      await session.save();
    }

    res.json(session);
  } catch (error) {
    console.error("Get session by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an interview session
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await InterviewSession.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found or unauthorized" });
    }

    res.json({ message: "Interview session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete interview
router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.questions.length === 0) {
      return res.status(400).json({ message: "No questions attempted yet" });
    }

    const totalScore = session.questions.reduce(
      (sum, q) => sum + (q.feedback?.score || 0),
      0
    );

    const average = Math.round(totalScore / session.questions.length);

    session.finalScore = average;
    session.isCompleted = true;

    await session.save();

    res.json({
      message: "Interview completed",
      finalScore: average,
    });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;