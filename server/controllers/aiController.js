const axios = require("axios");
const InterviewSession = require("../models/InterviewSession");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Generate first question
exports.generateQuestion = async (req, res) => {
  try {
    const { role, experienceLevel, skills } = req.body;

    const prompt = `
You are a professional technical interviewer.

Generate ONE interview question for a ${experienceLevel} ${role}.
Focus on skills: ${skills}.

Return only the question.
`;

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

    const question =
      response.data.choices[0].message.content.trim();

    res.json({ question });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "AI generation failed" });
  }
};

// Evaluate answer + Save to DB
exports.evaluateAnswer = async (req, res) => {
  try {
    const { role, question, answer, sessionId } = req.body;

    const prompt = `
You are a senior technical interviewer.

Evaluate this candidate answer.

Role: ${role}
Question: ${question}
Answer: ${answer}

Return response in this exact JSON format:

{
  "score": number (1-10),
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2"],
  "nextQuestion": "next interview question"
}
`;

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

    const parsed = JSON.parse(
      response.data.choices[0].message.content
    );

    // Save Q&A to DB
    await InterviewSession.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          questions: {
            question,
            answer,
            feedback: {
              score: parsed.score,
              strengths: parsed.strengths,
              improvements: parsed.improvements,
            },
          },
        },
      }
    );

    res.json(parsed);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "AI evaluation failed" });
  }
};