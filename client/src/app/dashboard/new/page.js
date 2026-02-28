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

      // Create interview session
      const sessionRes = await api.post("/interviews", {
        role,
        experienceLevel,
        skills,
      });

      const sessionId = sessionRes.data._id;

      // Generate first question
      const questionRes = await api.post("/ai/generate-question", {
        role,
        experienceLevel,
        skills,
      });

      const question = questionRes.data.question;

      // Redirect with question
      router.push(
        `/dashboard/interview/${sessionId}?q=${encodeURIComponent(question)}`
      );

    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      alert("Unauthorized or request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Start Mock Interview</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <input
          type="text"
          placeholder="Job Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-4 rounded-lg bg-gray-800 border border-gray-700"
          required
        />

        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="p-4 rounded-lg bg-gray-800 border border-gray-700"
          required
        >
          <option value="">Select Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1-3 Years">1-3 Years</option>
          <option value="3+ Years">3+ Years</option>
        </select>

        <textarea
          rows="4"
          placeholder="Key Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="p-4 rounded-lg bg-gray-800 border border-gray-700"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate First Question"}
        </button>

      </form>
    </div>
  );
}