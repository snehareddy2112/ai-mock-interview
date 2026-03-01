"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/interviews");
        setSessions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const calculateAverage = (questions) => {
    if (!questions.length) return 0;

    const total = questions.reduce(
      (sum, q) => sum + (q.feedback?.score || 0),
      0
    );

    return Math.round(total / questions.length);
  };

  if (loading) {
    return <p>Loading sessions...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Interview History
      </h1>

      {sessions.length === 0 ? (
        <p className="text-gray-400">
          No interview sessions yet.
        </p>
      ) : (
        <div className="grid gap-6">

          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-2">
                {session.role}
              </h2>

              <p className="text-gray-400 text-sm mb-2">
                {new Date(session.createdAt).toLocaleString()}
              </p>

              <p className="mb-2">
                Questions Attempted: {session.questions.length}
              </p>

              <p className="mb-4">
                Average Score: {calculateAverage(session.questions)} / 10
              </p>

              <Link
                href={`/dashboard/interview/${session._id}`}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
              >
                Continue
              </Link>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}