"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Sparkles,
  PlayCircle,
  Mic,
  Volume2,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Zap,
  Building2,
  Cpu,
  Layers,
  MessageSquareCode,
  FileText,
  Star,
  Users,
  Shield,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      setDemoError("");
      const res = await api.post("/auth/login", {
        email: "demo@aimock.com",
        password: "Demo@123",
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Demo login error:", err);
      setDemoError("Unable to access demo account. Please register or login directly.");
    } finally {
      setDemoLoading(false);
    }
  };

  const faqs = [
    {
      q: "How does the AI generate realistic interview questions?",
      a: "Our engine adapts questions dynamically based on your target role, seniority level (Junior to Principal), company style (e.g., Amazon Leadership Principles, Google system design), and previous answers to mimic a real multi-turn technical conversation.",
    },
    {
      q: "Can I use voice to speak my answers instead of typing?",
      a: "Yes! The platform includes built-in Speech-to-Text (STT) for voice responses and Text-to-Speech (TTS) audio narration so you can simulate real conversational phone screens and video interviews.",
    },
    {
      q: "What types of interviews are supported?",
      a: "You can practice Technical Coding & Architecture, Behavioral (using the STAR method), System Design, and Cultural/HR Fit interviews with tailored evaluation metrics for each.",
    },
    {
      q: "How are answers scored and evaluated?",
      a: "Each response is graded on a 1–10 scale along with dedicated scores for Technical Depth and Communication Clarity, accompanied by concrete positive strengths and actionable improvement tips.",
    },
    {
      q: "Can I download or share my interview report?",
      a: "Yes! At the end of every interview session, you get an executive breakdown with score graphs, topic gap analyses, and a 1-click printable/downloadable summary card.",
    },
  ];

  const features = [
    {
      icon: MessageSquareCode,
      title: "Adaptive AI Interviewer",
      desc: "Questions adapt dynamically to your answers. Follow-up inquiries challenge edge cases and probe deeper into your solutions.",
      tag: "GPT-4o Powered",
    },
    {
      icon: Mic,
      title: "Real-Time Voice & Speech",
      desc: "Speak your answers naturally using voice recognition and listen to questions narrated aloud with voice synthesis.",
      tag: "Audio Interactive",
    },
    {
      icon: Building2,
      title: "Company-Specific Tracks",
      desc: "Target interview formats tailored for top tech employers like Google, Amazon, Meta, Microsoft, and high-growth startups.",
      tag: "Top Tech Ready",
    },
    {
      icon: Layers,
      title: "Multi-Format Modes",
      desc: "Practice Technical Coding, Large-Scale System Design, Behavioral STAR scenarios, and Leadership interviews.",
      tag: "4 Modes",
    },
    {
      icon: TrendingUp,
      title: "Granular Analytics & Charts",
      desc: "Track question-by-question progress, average response pacing, and identify weak topics with actionable study guidance.",
      tag: "Interactive Data",
    },
    {
      icon: FileText,
      title: "Executive Final Reports",
      desc: "Generate printable candidate scorecards with strengths, improvement recommendations, and readiness verdicts.",
      tag: "PDF Export",
    },
  ];

  const companies = ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix", "Uber", "Stripe"];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Interview<span className="text-purple-400">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a>
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
            <a href="#demo" className="hover:text-purple-400 transition">Live Demo</a>
            <a href="#faq" className="hover:text-purple-400 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl transition"
            >
              Sign In
            </Link>

            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              {demoLoading ? "Accessing..." : "Try 1-Click Demo"}
            </button>

            <Link
              href="/register"
              className="text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 transition"
            >
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 blur-[140px] pointer-events-none rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Mock Interview Platform v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
            Master Technical Interviews with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
              Adaptive AI Feedback
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Simulate realistic technical, system design, and behavioral interviews tailored to your exact role and target company. Get real-time grading, speech analysis, and actionable coaching.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl shadow-purple-500/30 hover:scale-105 transition duration-150 flex items-center gap-2"
            >
              <span>Start Free Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="px-7 py-4 rounded-xl font-semibold text-base bg-[#0E1526] hover:bg-[#141C33] border border-white/15 text-white shadow-lg hover:border-purple-500/40 transition flex items-center gap-2.5"
            >
              <PlayCircle className="w-5 h-5 text-purple-400" />
              <span>{demoLoading ? "Logging in..." : "Explore Demo (No Signup)"}</span>
            </button>
          </div>

          {demoError && (
            <p className="text-xs text-red-400 mb-6">{demoError}</p>
          )}

          {/* Social Proof Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div>
              <p className="text-2xl font-extrabold text-white">10,000+</p>
              <p className="text-xs text-gray-400 mt-0.5">Questions Evaluated</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-purple-400">94.8%</p>
              <p className="text-xs text-gray-400 mt-0.5">Readiness Score Boost</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-blue-400">4 Modes</p>
              <p className="text-xs text-gray-400 mt-0.5">Tech, System, STAR, HR</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-400">4.9 / 5</p>
              <p className="text-xs text-gray-400 mt-0.5">Candidate Rating</p>
            </div>
          </div>
        </div>

        {/* Interactive Terminal / Mock Interface Preview */}
        <div id="demo" className="max-w-4xl mx-auto mt-16 rounded-2xl bg-[#0C1220] border border-purple-500/25 p-6 md:p-8 shadow-2xl shadow-purple-500/10 relative">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="ml-3 text-xs font-mono text-gray-400">Live AI Interview Session • Google Senior Full Stack</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                AI Active
              </span>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> AI Interviewer Question
              </p>
              <p className="text-sm md:text-base text-gray-100 font-medium">
                "How would you design a distributed cache invalidation strategy across multiple regional microservices while ensuring high consistency for critical user profiles?"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Candidate Voice Response (Transcribed)
              </p>
              <p className="text-sm text-gray-300">
                "I would implement a write-through cache pattern backed by Redis clusters, utilizing Kafka change-data-capture (CDC) events from PostgreSQL to publish invalidation events across regions with a short TTL safety net..."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  AI Evaluation Feedback • Score: 9/10
                </p>
                <p className="text-xs text-gray-300">
                  ✓ Excellent use of CDC and distributed message queues. Mentioned concrete latency trade-offs.
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                Level: Senior+
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Companies Banner */}
      <section className="py-12 border-y border-white/5 bg-[#060910]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Practice questions modeled after hiring bars at top companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {companies.map((company) => (
              <span key={company} className="text-lg md:text-xl font-bold tracking-tight text-gray-300 hover:text-white transition">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Streamlined Workflow</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
              From Setup to Feedback in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative hover:border-purple-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 font-extrabold text-xl flex items-center justify-center mb-6 border border-purple-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Configure Your Interview</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Choose your target role, experience seniority, format (Technical, STAR Behavioral, System Design), and specific company track.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative hover:border-indigo-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 font-extrabold text-xl flex items-center justify-center mb-6 border border-indigo-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Speak or Type Answers</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Listen to the AI interviewer's questions, pace yourself with the built-in timer, and provide realistic spoken or written solutions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative hover:border-blue-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 font-extrabold text-xl flex items-center justify-center mb-6 border border-blue-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Get Actionable Scoring</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Receive instant granular feedback on technical correctness and communication clarity, plus an executive summary report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-24 px-6 bg-[#060A13]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Engineered for Success</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2">
              Everything You Need to Ace Your Loop
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-3 max-w-2xl mx-auto">
              Built by experienced engineers to simulate real-world hiring bars and deliver high-yield interview practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.04] transition group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full p-6 text-left font-semibold text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>

                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Impact CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Land Your Dream Tech Offer?
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-10">
              Join thousands of engineers practicing with AI. Start your customized mock interview in less than 30 seconds.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl font-bold text-base bg-white text-gray-950 hover:bg-gray-100 shadow-xl transition hover:scale-105"
              >
                Get Started Free →
              </Link>

              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="px-8 py-4 rounded-xl font-semibold text-base bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
              >
                {demoLoading ? "Launching..." : "Try Instant Demo"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Footer */}
      <footer className="border-t border-white/10 bg-[#04070D] py-12 px-6 text-sm text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">InterviewAI</span>
            <span className="text-xs text-gray-400">© {new Date().getFullYear()} AI Mock Interview Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/register" className="text-purple-400 hover:text-purple-300 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}