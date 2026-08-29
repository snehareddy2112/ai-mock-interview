"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  Sparkles,
  PlayCircle,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Building2,
  Code2,
  Network,
  Users2,
  ArrowRight,
  Flame,
  Target,
  BarChart3,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/interviews");
        setSessions(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const totalInterviews = sessions.length;

  const totalQuestions = sessions.reduce(
    (sum, s) => sum + (s.questions?.length || 0),
    0
  );

  const completedSessions = sessions.filter((s) => s.isCompleted);

  const overallAverage = (() => {
    let totalScore = 0;
    let count = 0;

    sessions.forEach((s) => {
      if (s.questions && s.questions.length > 0) {
        s.questions.forEach((q) => {
          if (q.feedback?.score) {
            totalScore += q.feedback.score;
            count++;
          }
        });
      }
    });

    return count ? Math.round((totalScore / count) * 10) / 10 : 0;
  })();

  const bestScore = sessions.reduce((max, s) => Math.max(max, s.finalScore || 0), 0);

  const quickStartPresets = [
    {
      title: "Full Stack Engineer",
      company: "Google Track",
      type: "Technical",
      icon: Code2,
      color: "from-purple-600/20 to-indigo-600/20 border-purple-500/30",
    },
    {
      title: "System Design Loop",
      company: "Meta Track",
      type: "System Design",
      icon: Network,
      color: "from-blue-600/20 to-cyan-600/20 border-blue-500/30",
    },
    {
      title: "Leadership & STAR",
      company: "Amazon Track",
      type: "Behavioral (STAR)",
      icon: Users2,
      color: "from-amber-600/20 to-orange-600/20 border-amber-500/30",
    },
  ];

  return (
    <div className="text-white space-y-8 pb-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Practice Command Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your mock interview metrics, practice frequency, and readiness scores.
          </p>
        </div>

        <Link
          href="/dashboard/new"
          className="self-start md:self-auto px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition shadow-xl shadow-purple-500/25 text-white text-sm flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start New Interview</span>
        </Link>
      </div>

      {/* Daily Goal & Streak Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-blue-950/20 border border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Daily Interview Goal: 1 / 2 Completed</p>
            <p className="text-xs text-gray-400">Complete 1 more mock interview today to maintain your 3-day streak</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
            Weekly Progress: 4 sessions
          </span>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
            <span>Total Sessions</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold mt-3 text-white">
            {loading ? "..." : totalInterviews}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">{completedSessions.length} completed</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
            <span>Questions Answered</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold mt-3 text-indigo-300">
            {loading ? "..." : totalQuestions}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Real-time graded</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold mt-3 text-emerald-400">
            {loading ? "..." : overallAverage ? `${overallAverage} / 10` : "N/A"}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Across all questions</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
            <span>Peak Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold mt-3 text-amber-400">
            {loading ? "..." : bestScore ? `${bestScore} / 10` : "N/A"}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Best interview loop</p>
        </div>
      </div>

      {/* Quick Start Presets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-200">Recommended Practice Tracks</h2>
          <Link href="/dashboard/new" className="text-xs text-purple-400 hover:underline">
            Custom Track →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {quickStartPresets.map((preset, i) => {
            const Icon = preset.icon;
            return (
              <Link
                key={i}
                href="/dashboard/new"
                className={`p-5 rounded-2xl bg-gradient-to-br ${preset.color} border hover:scale-[1.02] transition block`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-black/40 text-white border border-white/10">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-gray-300 border border-white/10">
                    {preset.company}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">{preset.title}</h3>
                <p className="text-xs text-gray-300 mt-1">Type: {preset.type}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-300">
                  <span>Start Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Interview Sessions</h2>
          <Link href="/dashboard/history" className="text-xs text-purple-400 hover:underline font-medium">
            View Complete History →
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">No practice sessions started yet.</p>
            <Link
              href="/dashboard/new"
              className="mt-3 inline-block px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition"
            >
              Start First Interview
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase">
                  <th className="pb-3 font-semibold">Role & Track</th>
                  <th className="pb-3 font-semibold">Format</th>
                  <th className="pb-3 font-semibold">Questions</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.slice(0, 5).map((s) => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 font-semibold text-white">
                      <div>
                        <p>{s.role}</p>
                        <p className="text-[11px] text-gray-400 font-normal">
                          {s.targetCompany || "General Tech"} • {new Date(s.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-gray-300">
                      {s.interviewType || "Technical"}
                    </td>
                    <td className="py-4 text-xs text-gray-300 font-medium">
                      {s.questions?.length || 0} attempted
                    </td>
                    <td className="py-4 font-bold text-xs">
                      {s.finalScore ? (
                        <span className="text-purple-400">{s.finalScore} / 10</span>
                      ) : (
                        <span className="text-gray-400">In Progress</span>
                      )}
                    </td>
                    <td className="py-4">
                      {s.isCompleted ? (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/dashboard/interview/${s._id}`}
                        className="text-xs px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10 transition"
                      >
                        {s.isCompleted ? "Review" : "Continue →"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}