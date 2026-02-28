const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const InterviewSession = require("../models/InterviewSession");

// Create new interview session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { role, experienceLevel, skills } = req.body;

    const session = await InterviewSession.create({
      role,
      experienceLevel,
      skills,
      user: req.user,
      questions: [],
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sessions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single session
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!session) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;