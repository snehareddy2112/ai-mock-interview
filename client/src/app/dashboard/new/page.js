"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewInterview() {
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1️⃣ Create session
      const sessionRes = await api.post("/interviews", {
        role,
        experienceLevel,
        skills,
      });

      const session = sessionRes.data;

      // 2️⃣ Generate first question
      const questionRes = await api.post("/ai/generate-question", {
        role,
        experienceLevel,
        skills,
      });

      const firstQuestion = questionRes.data.question;

      // 3️⃣ Save first question directly into DB
      await api.post("/ai/evaluate", {
        role,
        question: firstQuestion,
        answer: "Initial question (no answer yet)",
        sessionId: session._id,
      });

      // 4️⃣ Redirect WITHOUT query param
      router.push(`/dashboard/interview/${session._id}`);

    } catch (error) {
      console.error(error);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">
        Start New Interview
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="Role"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Experience Level"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Skills"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600"
        >
          {loading ? "Starting..." : "Start Interview"}
        </button>

      </form>
    </div>
  );
}