"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InterviewSession() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      const res = await api.get(`/interviews/${id}`);
      const data = res.data;
      setSession(data);

      if (data.isCompleted) return;

      if (data.questions.length > 0) {
        const last =
          data.questions[data.questions.length - 1];
        setQuestion(
          last.feedback?.nextQuestion || ""
        );
      }
    };

    fetchSession();
  }, [id]);

  // Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setAnswer(transcript);
        };

        recognition.onend = () => setListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/ai/evaluate", {
        role: session.role,
        question,
        answer,
        sessionId: id,
      });

      setQuestion(res.data.nextQuestion);
      setAnswer("");

      const updated = await api.get(`/interviews/${id}`);
      setSession(updated.data);

    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    const res = await api.post(`/interviews/${id}/complete`);
    alert(`Final Score: ${res.data.finalScore}/10`);

    const updated = await api.get(`/interviews/${id}`);
    setSession(updated.data);
  };

  if (!session) return <p className="text-white">Loading...</p>;

  const averageStrengths = session.questions.flatMap(
    (q) => q.feedback?.strengths || []
  );

  const averageImprovements = session.questions.flatMap(
    (q) => q.feedback?.improvements || []
  );

  const score = session.finalScore;

  const getPerformanceMeta = () => {
    if (score >= 8)
      return {
        bg: "bg-green-900/30",
        border: "border-green-500",
        text: "text-green-400",
        title: "Excellent Performance!",
        emoji: "🎉",
        suggestion:
          "You're interview ready. Focus on refining advanced scenarios.",
      };

    if (score >= 5)
      return {
        bg: "bg-blue-900/30",
        border: "border-blue-500",
        text: "text-blue-400",
        title: "Good Job!",
        emoji: "👍",
        suggestion:
          "Strengthen deeper explanations and real-world examples.",
      };

    if (score >= 3)
      return {
        bg: "bg-yellow-900/30",
        border: "border-yellow-500",
        text: "text-yellow-400",
        title: "Needs Improvement",
        emoji: "⚠",
        suggestion:
          "Review core concepts and improve structured answers.",
      };

    return {
      bg: "bg-red-900/30",
      border: "border-red-500",
      text: "text-red-400",
      title: "Poor Performance",
      emoji: "❌",
      suggestion:
        "Revisit fundamentals and practice explaining concepts clearly.",
    };
  };

  const performance = getPerformanceMeta();

  return (
    <div className="max-w-5xl mx-auto text-white">

      <h1 className="text-3xl font-bold mb-8">
        {session.role} Interview
      </h1>

      {/* Completion Section */}
      {session.isCompleted && (
        <div className={`${performance.bg} border ${performance.border} rounded-xl p-6 mb-8`}>
          <h2 className={`${performance.text} text-xl font-bold`}>
            {performance.title} {performance.emoji}
          </h2>
          <p className="mt-2 text-lg">
            Final Score: {score} / 10
          </p>
          <p className="mt-3 text-gray-300">
            {performance.suggestion}
          </p>

          {/* Strengths */}
          {averageStrengths.length > 0 && (
            <div className="mt-6">
              <h3 className="text-green-400 font-semibold mb-2">
                Strengths Identified
              </h3>
              <ul className="list-disc ml-6 text-gray-300 space-y-1">
                {averageStrengths.slice(0, 5).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {averageImprovements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-red-400 font-semibold mb-2">
                Areas to Improve
              </h3>
              <ul className="list-disc ml-6 text-gray-300 space-y-1">
                {averageImprovements.slice(0, 5).map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Question History */}
      {session.questions.map((q, index) => (
        <div
          key={index}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <p className="text-purple-400 font-semibold mb-2">
            Question {index + 1}
          </p>
          <p className="mb-3">{q.question}</p>

          <p className="text-blue-400 font-semibold mb-1">
            Your Answer
          </p>
          <p className="mb-3 text-gray-300">{q.answer}</p>

          <p className="text-green-400 font-semibold">
            Score: {q.feedback?.score}/10
          </p>
        </div>
      ))}

      {/* Score Chart */}
      {session.questions.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-6">
            Score Progress
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={session.questions.map((q, index) => ({
                question: `Q${index + 1}`,
                score: q.feedback?.score || 0,
              }))}
            >
              <XAxis dataKey="question" stroke="#aaa" />
              <YAxis domain={[0, 10]} stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Active Section */}
      {!session.isCompleted && question && (
        <>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <h2 className="text-purple-400 font-semibold mb-3">
              Current Question
            </h2>
            <p>{question}</p>
          </div>

          <textarea
            rows="5"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or speak your answer..."
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 mb-4"
          />

          <div className="flex gap-4 mb-6">
            <button
              onClick={startListening}
              disabled={listening}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              🎤 Start Voice
            </button>

            <button
              onClick={stopListening}
              disabled={!listening}
              className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700"
            >
              ⏹ Stop
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {loading ? "Evaluating..." : "Submit Answer"}
            </button>

            <button
              onClick={handleComplete}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700"
            >
              End Interview
            </button>
          </div>
        </>
      )}

    </div>
  );
}