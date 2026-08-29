"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import confetti from "canvas-confetti";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  RotateCcw,
  Building2,
  Layers,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InterviewSession() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completionNotice, setCompletionNotice] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(-1);

  // Per-question timer (seconds)
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const recognitionRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && !session?.isCompleted) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, session?.isCompleted]);

  // Fetch session details
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchSession = async () => {
      try {
        setErrorMsg("");
        const res = await api.get(`/interviews/${id}`);
        const data = res.data;
        if (!isMounted) return;

        setSession(data);

        if (data.isCompleted) {
          setTimerRunning(false);
          return;
        }

        // Determine active question
        let activeQ = (data.currentQuestion && data.currentQuestion.trim()) || "";
        if (!activeQ && data.questions && data.questions.length > 0) {
          const last = data.questions[data.questions.length - 1];
          activeQ = last.feedback?.nextQuestion || last.question || "";
        }

        // Safe fallback so candidate is never stuck on a blank screen
        if (!activeQ) {
          activeQ = `Can you introduce yourself and walk me through your background with ${data.skills || data.role || "software engineering"}?`;
        }

        setQuestion(activeQ);
      } catch (err) {
        console.error("Failed to load session:", err);
        if (isMounted) {
          setErrorMsg(err.response?.data?.message || "Failed to load interview session.");
        }
      }
    };

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Speech Recognition setup (Voice-to-Text)
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

        recognition.onerror = (event) => {
          console.warn("Speech recognition error:", event.error);
          setListening(false);
        };

        recognition.onend = () => setListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.warn("Speech recognition start failed:", err);
      }
    } else {
      setErrorMsg("Speech recognition is not supported in this browser. Please type your answer.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Speech recognition stop failed:", err);
      }
      setListening(false);
    }
  };

  // Text-to-Speech for question reading
  const speakQuestion = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && question) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 1.0;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  // Submit Answer -> Calls AI Evaluation with actual candidate answer
  const handleSubmit = async () => {
    if (!answer.trim()) {
      setErrorMsg("Please provide an answer before submitting.");
      return;
    }

    if (listening) {
      stopListening();
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/ai/evaluate", {
        role: session.role,
        question: question || session.currentQuestion || "Interview Question",
        answer: answer.trim(),
        sessionId: id,
        timeTakenSeconds: seconds,
      });

      const nextQ = res.data.nextQuestion || "Can you elaborate on how you would test and validate this in production?";
      setQuestion(nextQ);
      setAnswer("");
      setSeconds(0); // reset question timer

      const updated = await api.get(`/interviews/${id}`);
      setSession(updated.data);

      // Auto-complete if target count reached
      if (
        session.targetQuestionsCount &&
        updated.data.questions.length >= session.targetQuestionsCount
      ) {
        handleComplete();
      }
    } catch (err) {
      console.error("Evaluation failed:", err);
      setErrorMsg(err.response?.data?.message || "Failed to evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // End Interview -> Calculates final score and marks completed
  const handleComplete = async () => {
    try {
      setCompleting(true);
      setErrorMsg("");
      const res = await api.post(`/interviews/${id}/complete`);
      setCompletionNotice(`Interview finalized! Final Score: ${res.data.finalScore}/10`);

      const updated = await api.get(`/interviews/${id}`);
      setSession(updated.data);
      setTimerRunning(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore confetti errors
      }
    } catch (err) {
      console.error("End interview failed:", err);
      setErrorMsg(err.response?.data?.message || "Failed to finalize interview.");
    } finally {
      setCompleting(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!session) {
    return (
      <div className="max-w-5xl mx-auto text-white p-12 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Preparing customized AI interview environment...</p>
      </div>
    );
  }

  const averageStrengths = (session.questions || []).flatMap(
    (q) => q.feedback?.strengths || []
  );

  const averageImprovements = (session.questions || []).flatMap(
    (q) => q.feedback?.improvements || []
  );

  const score = session.finalScore || 0;

  const avgTechnical = session.questions?.length
    ? Math.round(
        session.questions.reduce((sum, q) => sum + (q.feedback?.technicalAccuracy || q.feedback?.score || 7), 0) /
          session.questions.length
      )
    : 7;

  const avgCommunication = session.questions?.length
    ? Math.round(
        session.questions.reduce((sum, q) => sum + (q.feedback?.communication || q.feedback?.score || 7), 0) /
          session.questions.length
      )
    : 7;

  const getPerformanceMeta = () => {
    if (score >= 8)
      return {
        bg: "bg-emerald-950/30",
        border: "border-emerald-500/40",
        text: "text-emerald-400",
        title: "Offer-Ready Candidate 🎉",
        badge: "Senior / High Match",
        suggestion: "Demonstrated strong technical depth, structured logic, and clear trade-off communication.",
      };

    if (score >= 6)
      return {
        bg: "bg-blue-950/30",
        border: "border-blue-500/40",
        text: "text-blue-400",
        title: "Solid Competency 👍",
        badge: "Mid-to-Senior Match",
        suggestion: "Solid baseline understanding. Deepen concrete edge-case handling, metrics, and quantitative reasoning.",
      };

    if (score >= 4)
      return {
        bg: "bg-amber-950/30",
        border: "border-amber-500/40",
        text: "text-amber-400",
        title: "Needs Targeted Practice ⚠️",
        badge: "Junior / Needs Review",
        suggestion: "Review core architecture and practice structuring answers using STAR or system design frameworks.",
      };

    return {
      bg: "bg-rose-950/30",
      border: "border-rose-500/40",
      text: "text-rose-400",
      title: "Foundational Practice Required 💪",
      badge: "Needs Foundations",
      suggestion: "Revisit foundational concepts and practice explaining your technical reasoning out loud.",
    };
  };

  const performance = getPerformanceMeta();
  const currentQuestionNumber = (session.questions?.length || 0) + 1;
  const totalTarget = session.targetQuestionsCount || 5;

  return (
    <div className="max-w-5xl mx-auto text-white pb-16">
      {/* Session Top Navigation & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 no-print">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {session.interviewType || "Technical"}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {session.targetCompany || "General Tech"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {session.role}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!session.isCompleted && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-gray-300">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Question Time: {formatTimer(seconds)}</span>
            </div>
          )}

          <Link
            href="/dashboard/history"
            className="text-xs px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition"
          >
            History
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex justify-between items-center no-print">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="font-bold ml-4">✕</button>
        </div>
      )}

      {completionNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex justify-between items-center no-print">
          <span className="font-semibold">{completionNotice}</span>
          <button onClick={() => setCompletionNotice("")} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* COMPLETED: Executive Final Report Card */}
      {session.isCompleted && (
        <div className="space-y-8 mb-12">
          <div className={`${performance.bg} border ${performance.border} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Executive Performance Evaluation
                </span>
                <h2 className={`text-3xl font-extrabold ${performance.text} mt-1`}>
                  {performance.title}
                </h2>
                <p className="text-sm text-gray-200 mt-2 max-w-xl">
                  {performance.suggestion}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 text-center">
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Final Score</span>
                  <p className="text-4xl font-extrabold text-white mt-0.5">
                    {score} <span className="text-sm font-normal text-gray-400">/ 10</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="text-left">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">Verdict</span>
                  <p className={`text-sm font-bold ${performance.text} mt-0.5`}>
                    {performance.badge}
                  </p>
                </div>
              </div>
            </div>

            {/* Categorized Skill Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs text-gray-400">Technical Depth</span>
                <p className="text-2xl font-bold text-purple-400 mt-1">{avgTechnical} / 10</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${avgTechnical * 10}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs text-gray-400">Communication Clarity</span>
                <p className="text-2xl font-bold text-blue-400 mt-1">{avgCommunication} / 10</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${avgCommunication * 10}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs text-gray-400">Questions Completed</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{session.questions?.length || 0}</p>
                <span className="text-[10px] text-gray-400">Full loop completed</span>
              </div>
            </div>

            {/* Strengths & Weakness Summary */}
            <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
              {averageStrengths.length > 0 && (
                <div>
                  <h3 className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Key Strengths Demonstrated
                  </h3>
                  <ul className="list-disc ml-5 text-xs text-gray-300 space-y-2">
                    {averageStrengths.slice(0, 5).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {averageImprovements.length > 0 && (
                <div>
                  <h3 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Recommended Areas for Growth
                  </h3>
                  <ul className="list-disc ml-5 text-xs text-gray-300 space-y-2">
                    {averageImprovements.slice(0, 5).map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Bar (Print & New Interview) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10 no-print">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-2 border border-white/15 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Scorecard</span>
              </button>

              <Link
                href="/dashboard/new"
                className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Another Interview</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE INTERVIEW: Current Question Card */}
      {!session.isCompleted && (
        <div className="bg-[#0D1322] border border-purple-500/30 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl shadow-purple-500/10">
          {/* Progress Bar & Badges */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                Question {currentQuestionNumber} of {totalTarget}
              </span>
              <span className="text-xs text-gray-400">AI Interviewer</span>
            </div>

            {question && (
              <button
                onClick={speaking ? stopSpeaking : speakQuestion}
                className={`text-xs px-3.5 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                  speaking
                    ? "bg-purple-600 border-purple-500 text-white animate-pulse"
                    : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"
                }`}
              >
                {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{speaking ? "Stop Audio" : "Listen to Question"}</span>
              </button>
            )}
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 mb-6 min-h-[90px] flex items-center">
            {question ? (
              <p className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                {question}
              </p>
            ) : (
              <div className="flex items-center gap-3 text-purple-300 animate-pulse text-sm">
                <div className="w-5 h-5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
                <span>Generating your technical interview question...</span>
              </div>
            )}
          </div>

          {/* Answer Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Your Answer:
              </label>
              <span className="text-[11px] text-gray-400">
                {answer.length} characters
              </span>
            </div>

            <textarea
              rows="6"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak your answer using the microphone or type a clear, structured technical explanation..."
              className="w-full p-4 rounded-2xl bg-[#090D18] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm leading-relaxed"
            />

            {/* Answer Control Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-md ${
                    listening
                      ? "bg-red-600 hover:bg-red-700 text-white animate-pulse border border-red-500"
                      : "bg-gray-800 hover:bg-gray-700 text-blue-400 border border-gray-700"
                  }`}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{listening ? "Stop Recording" : "Voice Input (Speech)"}</span>
                </button>
                {listening && (
                  <span className="text-xs text-red-400 animate-pulse font-medium">Recording speech...</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !answer.trim()}
                  className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition text-white shadow-xl shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Evaluating Answer..." : "Submit Answer →"}</span>
                </button>

                {session.questions && session.questions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={completing}
                    className="px-4 py-2.5 rounded-xl font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs transition"
                  >
                    {completing ? "Finalizing..." : "Finish Interview"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Answered Questions Progression History */}
      {session.questions && session.questions.length > 0 && (
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-200">
              Evaluated Questions ({session.questions.length})
            </h2>
            <span className="text-xs text-gray-400">Click any card to expand feedback</span>
          </div>

          {session.questions.map((q, index) => {
            const isExpanded = expandedIndex === index || expandedIndex === -1;
            return (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/10 hover:border-white/20 transition rounded-2xl p-6"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === index ? -2 : index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 text-xs font-bold flex items-center justify-center border border-purple-500/30">
                      Q{index + 1}
                    </span>
                    <p className="font-semibold text-white text-sm max-w-xl truncate">
                      {q.question}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Score: {q.feedback?.score || 0}/10
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                    {/* Full Question Text */}
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">Question</span>
                      <p className="text-sm text-gray-200 mt-1">{q.question}</p>
                    </div>

                    {/* Candidate Answer */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Your Answer</span>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{q.answer}</p>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      {q.feedback?.strengths?.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                          <p className="text-emerald-400 font-bold mb-1.5">✓ Strengths</p>
                          <ul className="list-disc ml-4 text-gray-300 space-y-1">
                            {q.feedback.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.feedback?.improvements?.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                          <p className="text-amber-400 font-bold mb-1.5">! Areas for Improvement</p>
                          <ul className="list-disc ml-4 text-gray-300 space-y-1">
                            {q.feedback.improvements.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Score Progression Graph */}
      {session.questions && session.questions.length > 0 && (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Score Progression Across Questions</span>
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={session.questions.map((q, index) => ({
                question: `Q${index + 1}`,
                score: q.feedback?.score || 0,
              }))}
            >
              <XAxis dataKey="question" stroke="#6b7280" />
              <YAxis domain={[0, 10]} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1322",
                  borderColor: "#374151",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: "#a855f7", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
