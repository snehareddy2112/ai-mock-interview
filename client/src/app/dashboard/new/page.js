"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Sparkles,
  Code2,
  Users2,
  Network,
  Briefcase,
  Building2,
  Sliders,
  FileText,
  Clock,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function NewInterview() {
  const [role, setRole] = useState("Full Stack Developer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (2-5 years)");
  const [skills, setSkills] = useState("React, Node.js, REST APIs, System Architecture");
  const [interviewType, setInterviewType] = useState("Technical");
  const [targetCompany, setTargetCompany] = useState("General Tech");
  const [targetQuestionsCount, setTargetQuestionsCount] = useState(5);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const modes = [
    {
      id: "Technical",
      label: "Technical",
      icon: Code2,
      desc: "Algorithms, system fundamentals, coding logic, and architecture.",
    },
    {
      id: "Behavioral (STAR)",
      label: "Behavioral (STAR)",
      icon: Users2,
      desc: "Past experiences, teamwork, ownership, and conflict resolution.",
    },
    {
      id: "System Design",
      label: "System Design",
      icon: Network,
      desc: "Scalability, microservices, databases, caching, and trade-offs.",
    },
    {
      id: "HR & Cultural",
      label: "HR & Culture",
      icon: Briefcase,
      desc: "Values, career goals, team fit, and compensation expectations.",
    },
  ];

  const companies = [
    "General Tech",
    "Google",
    "Amazon",
    "Meta",
    "Microsoft",
    "Apple",
    "Netflix",
    "FinTech / Stripe",
    "High-Growth Startup",
  ];

  const questionCounts = [3, 5, 8, 10];

  const rolePresets = [
    "Full Stack Developer",
    "Backend Engineer",
    "Frontend Engineer",
    "System Architect",
    "DevOps / SRE",
    "Data Scientist / ML Engineer",
    "Product Manager",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!role.trim()) {
      setErrorMsg("Please specify the target job role.");
      return;
    }

    try {
      setLoading(true);

      // Create session and generate the initial question without dummy answers
      const sessionRes = await api.post("/interviews", {
        role: role.trim(),
        experienceLevel: experienceLevel.trim(),
        skills: skills.trim(),
        interviewType,
        targetCompany,
        targetQuestionsCount: Number(targetQuestionsCount) || 5,
        jobDescription: jobDescription.trim(),
      });

      const session = sessionRes.data;
      router.push(`/dashboard/interview/${session._id}`);
    } catch (error) {
      console.error("Failed to start interview:", error);
      setErrorMsg(error.response?.data?.message || "Failed to start interview. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Session Setup</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Create New Mock Interview
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Customize your interview format, difficulty, and company style to simulate real hiring bars.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex justify-between items-center">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="font-bold ml-2">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Interview Format Mode Selection */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-bold text-gray-200 mb-3">
            1. Select Interview Format
          </label>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = interviewType === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setInterviewType(mode.id)}
                  className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-purple-600/20 border-purple-500 shadow-md shadow-purple-500/20"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                      )}
                    </div>
                    <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-200"}`}>
                      {mode.label}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">
                    {mode.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Target Role & Experience Level */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
          <label className="block text-sm font-bold text-gray-200">
            2. Target Role & Seniority
          </label>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Target Role Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer"
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />

              {/* Quick Role Suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {rolePresets.slice(0, 4).map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setRole(preset)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Experience Level *
              </label>
              <select
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                required
              >
                <option value="Intern / Junior (0-2 years)">Intern / Junior (0-2 years)</option>
                <option value="Mid-level (2-5 years)">Mid-level (2-5 years)</option>
                <option value="Senior (5-8 years)">Senior (5-8 years)</option>
                <option value="Staff / Principal (8+ years)">Staff / Principal (8+ years)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Key Skills, Technologies, or Domain (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Node.js, Go, PostgreSQL, Kafka, Kubernetes, Microservices"
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        {/* 3. Company Track & Question Count */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
          <label className="block text-sm font-bold text-gray-200">
            3. Company Style & Pacing
          </label>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Target Company Style</span>
              </label>
              <select
                className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
              >
                {companies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Questions in Session</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {questionCounts.map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setTargetQuestionsCount(count)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      targetQuestionsCount === count
                        ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20"
                        : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Job Description Accordion */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowJdInput(!showJdInput)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showJdInput ? "Hide Job Description Context" : "+ Paste Job Description or Resume for Custom Questions"}</span>
            </button>

            {showJdInput && (
              <div className="mt-3">
                <textarea
                  rows="4"
                  placeholder="Paste the target job description or your key resume highlights here..."
                  className="w-full p-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  The AI will extract specific requirements from this text to formulate hyper-tailored questions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Duration Banner & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/30 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Estimated Duration: ~{targetQuestionsCount * 3}–{targetQuestionsCount * 5} minutes
              </p>
              <p className="text-[11px] text-gray-400">
                Format: {interviewType} • {targetCompany} • {targetQuestionsCount} Questions
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition disabled:opacity-50 text-white shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Generating Customized Session..." : "Start Interview Loop"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
