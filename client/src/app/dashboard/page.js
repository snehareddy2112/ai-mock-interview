"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/interviews");
        setSessions(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSessions();
  }, []);

  const totalInterviews = sessions.length;

  const totalQuestions = sessions.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  const overallAverage = (() => {
    let totalScore = 0;
    let count = 0;

    sessions.forEach((s) => {
      s.questions.forEach((q) => {
        if (q.feedback?.score) {
          totalScore += q.feedback.score;
          count++;
        }
      });
    });

    return count ? Math.round(totalScore / count) : 0;
  })();

  return (
    <div className="text-white">

      <h1 className="text-3xl font-bold mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Total Interviews</h3>
          <p className="text-3xl font-bold mt-2">
            {totalInterviews}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Questions Attempted</h3>
          <p className="text-3xl font-bold mt-2">
            {totalQuestions}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Overall Avg Score</h3>
          <p className="text-3xl font-bold mt-2">
            {overallAverage} / 10
          </p>
        </div>

      </div>

      <div className="flex gap-4">
        <Link
          href="/dashboard/new"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
        >
          Start New Interview
        </Link>

        <Link
          href="/dashboard/history"
          className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
        >
          View History
        </Link>
      </div>

    </div>
  );
}