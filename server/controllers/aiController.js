const axios = require("axios");
const InterviewSession = require("../models/InterviewSession");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Robust JSON parser for LLM responses:
 * Handles markdown code fences (```json ... ```), surrounding text, and malformed structures.
 */
function parseAIJsonResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty or invalid AI response");
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Extract first matching JSON object if surrounded by commentary
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to JSON.parse cleaned AI text:", cleaned);
    throw new Error("Invalid JSON structure returned by AI");
  }

  const rawScore = Number(parsed.score);
  const score = (!isNaN(rawScore) && rawScore >= 1 && rawScore <= 10)
    ? Math.round(rawScore)
    : 7;

  const rawTech = Number(parsed.technicalAccuracy || parsed.score);
  const technicalAccuracy = (!isNaN(rawTech) && rawTech >= 1 && rawTech <= 10)
    ? Math.round(rawTech)
    : score;

  const rawComm = Number(parsed.communication || parsed.score);
  const communication = (!isNaN(rawComm) && rawComm >= 1 && rawComm <= 10)
    ? Math.round(rawComm)
    : score;

  const strengths = Array.isArray(parsed.strengths)
    ? parsed.strengths.filter((s) => typeof s === "string" && s.trim().length > 0)
    : [];

  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements.filter((i) => typeof i === "string" && i.trim().length > 0)
    : [];

  const nextQuestion = (typeof parsed.nextQuestion === "string" && parsed.nextQuestion.trim().length > 0)
    ? parsed.nextQuestion.trim()
    : "Can you elaborate on how you would handle performance bottlenecks or scalability in this scenario?";

  return {
    score,
    technicalAccuracy,
    communication,
    strengths: strengths.length > 0 ? strengths : ["Demonstrated solid grasp of key principles."],
    improvements: improvements.length > 0 ? improvements : ["Incorporate specific quantitative metrics and trade-offs."],
    nextQuestion,
  };
}

/**
 * Helper to generate an initial interview question tailored to role, type, company, and JD
 */
async function fetchFirstQuestion({ role, experienceLevel, skills, interviewType = "Technical", targetCompany = "General Tech", jobDescription = "" }) {
  let modeGuidance = "Focus on technical architecture, coding concepts, and problem-solving.";
  if (interviewType.includes("Behavioral")) {
    modeGuidance = "Focus on behavioral competencies, teamwork, handling conflicts, or ownership using the STAR method.";
  } else if (interviewType.includes("System Design")) {
    modeGuidance = "Focus on high-level distributed systems design, data modeling, APIs, caching, and scalability trade-offs.";
  } else if (interviewType.includes("HR")) {
    modeGuidance = "Focus on culture fit, career motivations, leadership philosophy, and workplace values.";
  }

  const prompt = `
You are an expert hiring manager and technical interviewer conducting an interview for ${targetCompany || "a top tech company"}.

Candidate Profile:
- Role: ${role || "Software Engineer"}
- Experience Level: ${experienceLevel || "Mid-level"}
- Key Skills: ${skills || "Relevant industry skills"}
- Interview Format: ${interviewType}
${jobDescription ? `- Target Job Description context: ${jobDescription.substring(0, 300)}` : ""}

Instructions:
${modeGuidance}
Generate ONE high-quality, realistic, and thought-provoking opening question appropriate for this interview.

Return ONLY the interview question text without quotes, prefixes, or markdown.
`;

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const question = response.data.choices?.[0]?.message?.content?.trim();
    if (question && question.length > 10) {
      return question.replace(/^["']|["']$/g, "");
    }
  } catch (error) {
    console.error("OpenRouter generate question error:", error.response?.data || error.message);
  }

  // Adaptive fallback questions based on mode
  if (interviewType.includes("Behavioral")) {
    return `Can you tell me about a time you had a significant technical disagreement with a teammate or stakeholder, and how you resolved it?`;
  }
  if (interviewType.includes("System Design")) {
    return `How would you design a scalable notification service capable of delivering millions of real-time alerts daily?`;
  }
  return `Can you walk me through the architecture of a complex project you developed using ${skills || role}, including key technical decisions you made?`;
}

// Generate first question endpoint (standalone)
exports.generateQuestion = async (req, res) => {
  try {
    const { role, experienceLevel, skills, interviewType, targetCompany, jobDescription } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const question = await fetchFirstQuestion({
      role,
      experienceLevel,
      skills,
      interviewType,
      targetCompany,
      jobDescription,
    });
    res.json({ question });
  } catch (error) {
    console.error("AI question generation failed:", error.message);
    res.status(500).json({ message: "AI generation failed" });
  }
};

exports.fetchFirstQuestion = fetchFirstQuestion;

// Evaluate answer + Save to DB with proper session ownership validation
exports.evaluateAnswer = async (req, res) => {
  try {
    const { role, question, answer, sessionId, timeTakenSeconds = 0 } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({ message: "Session ID, question, and answer are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify session belongs to the authenticated user (prevents IDOR)
    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user,
    });

    if (!session) {
      return res.status(404).json({ message: "Interview session not found or access denied" });
    }

    if (session.isCompleted) {
      return res.status(400).json({ message: "Interview session is already completed" });
    }

    const prompt = `
You are a senior interviewer evaluating a candidate for ${session.targetCompany || "a top company"}.

Role: ${session.role} (${session.experienceLevel})
Interview Type: ${session.interviewType || "Technical"}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate the response rigorously. Return a score out of 10, technical accuracy score (1-10), communication score (1-10), key positive strengths, areas for improvement, and a logical follow-up question.

Return response in this EXACT JSON format ONLY:
{
  "score": 8,
  "technicalAccuracy": 8,
  "communication": 8,
  "strengths": ["Clear explanation of core logic", "Good discussion of trade-offs"],
  "improvements": ["Could elaborate on fault-tolerance", "Add concrete latency considerations"],
  "nextQuestion": "How would you handle cache invalidation in this architecture?"
}
`;

    let parsed;
    try {
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rawContent = response.data.choices?.[0]?.message?.content;
      parsed = parseAIJsonResponse(rawContent);
    } catch (aiErr) {
      console.error("OpenRouter evaluation error, using fallback:", aiErr.response?.data || aiErr.message);
      parsed = {
        score: 7,
        technicalAccuracy: 7,
        communication: 7,
        strengths: ["Answered the prompt directly and addressed key concepts."],
        improvements: ["Provide deeper specifics and metrics on performance or system constraints."],
        nextQuestion: `How would you test and validate this in a production environment for ${session.role}?`,
      };
    }

    // Save Q&A with time tracking and updated currentQuestion
    session.questions.push({
      question,
      answer,
      timeTakenSeconds: Number(timeTakenSeconds) || 0,
      feedback: {
        score: parsed.score,
        technicalAccuracy: parsed.technicalAccuracy,
        communication: parsed.communication,
        strengths: parsed.strengths,
        improvements: parsed.improvements,
        nextQuestion: parsed.nextQuestion,
      },
    });

    session.currentQuestion = parsed.nextQuestion;
    await session.save();

    res.json(parsed);
  } catch (error) {
    console.error("AI evaluation failed:", error.message);
    res.status(500).json({ message: "AI evaluation failed" });
  }
};