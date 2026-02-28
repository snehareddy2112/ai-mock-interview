const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  generateQuestion,
  evaluateAnswer,
} = require("../controllers/aiController");

router.post("/generate-question", authMiddleware, generateQuestion);
router.post("/evaluate", authMiddleware, evaluateAnswer);

module.exports = router;