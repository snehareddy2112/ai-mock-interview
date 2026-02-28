"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function InterviewSession() {
  const searchParams = useSearchParams();
  const params = useParams();

  const sessionId = params.id;
  const initialQuestion = searchParams.get("q");

  const [question, setQuestion] = useState(initialQuestion || "");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/ai/evaluate", {
        role: "Frontend Developer",
        question,
        answer,
        sessionId,
      });

      setFeedback(res.data);
      setQuestion(res.data.nextQuestion);
      setAnswer("");

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Mock Interview Session
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-purple-400 font-semibold mb-3">
          Interviewer Question
        </h2>
        <p className="text-gray-300">{question}</p>
      </div>

      <textarea
        rows="5"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition disabled:opacity-50"
      >
        {loading ? "Evaluating..." : "Submit Answer"}
      </button>

      {feedback && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-green-400 font-semibold mb-4">
            Score: {feedback.score}/10
          </h2>
        </div>
      )}
    </div>
  );
}