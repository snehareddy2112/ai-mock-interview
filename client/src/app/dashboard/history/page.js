"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Trash2,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/interviews");
      setSessions(res.data);
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this interview session?")) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/interviews/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete interview session.");
    } finally {
      setDeletingId(null);
    }
  };

  const calculateAverage = (session) => {
    if (session.finalScore) return session.finalScore;
    if (!session.questions || !session.questions.length) return 0;

    const total = session.questions.reduce(
      (sum, q) => sum + (q.feedback?.score || 0),
      0
    );

    return Math.round((total / session.questions.length) * 10) / 10;
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.targetCompany && s.targetCompany.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedFilter === "All") return matchesSearch;
    if (selectedFilter === "Completed") return matchesSearch && s.isCompleted;
    if (selectedFilter === "In Progress") return matchesSearch && !s.isCompleted;
    return matchesSearch && s.interviewType === selectedFilter;
  });

  const filterTabs = ["All", "Completed", "In Progress", "Technical", "Behavioral (STAR)", "System Design"];

  return (
    <div className="text-white space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Interview History & Scorecards
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Review past mock interview evaluations, question transcripts, and progress charts.
          </p>
        </div>

        <Link
          href="/dashboard/new"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition text-white text-xs shadow-lg shadow-purple-500/25"
        >
          + New Interview
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role or company (e.g. Google, Backend)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === tab
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Session Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 animate-pulse text-sm">
          Loading past interview sessions...
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-base font-semibold text-white mb-1">No matching interview sessions found.</p>
          <p className="text-xs text-gray-400 mb-6">
            {searchTerm ? "Try searching for a different role or resetting your filters." : "Start your first mock interview to view scores and analytics."}
          </p>
          <Link
            href="/dashboard/new"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition inline-block"
          >
            Start New Session →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const avgScore = calculateAverage(session);
            const isDeleting = deletingId === session._id;

            return (
              <div
                key={session._id}
                className="bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition rounded-2xl p-6 flex flex-col justify-between relative shadow-lg group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {session.interviewType || "Technical"}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {session.targetCompany || "General Tech"}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                        {session.role}
                      </h2>
                    </div>

                    <button
                      onClick={(e) => handleDelete(session._id, e)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete interview session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-400 text-xs mb-4 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {session.experienceLevel ? ` • ${session.experienceLevel}` : ""}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[11px] text-gray-400">Questions Answered</span>
                      <p className="text-base font-extrabold text-white mt-0.5">
                        {session.questions?.length || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400">Score Rating</span>
                      <p className="text-base font-extrabold text-purple-400 mt-0.5">
                        {avgScore > 0 ? `${avgScore} / 10` : "In Progress"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    session.isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {session.isCompleted ? "✓ Completed" : "⚡ In Progress"}
                  </span>

                  <Link
                    href={`/dashboard/interview/${session._id}`}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      session.isCompleted
                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    }`}
                  >
                    <span>{session.isCompleted ? "View Full Report" : "Continue Loop"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}