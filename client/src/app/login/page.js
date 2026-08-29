"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Sparkles, Lock, Mail, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@aimock.com");
    setPassword("Demo@123");
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 blur-[140px] pointer-events-none rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Interview<span className="text-purple-400">AI</span>
            </span>
          </Link>
          <p className="text-gray-400 text-xs">
            Sign in to access your mock interview dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex justify-between items-center">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="font-bold ml-2">✕</button>
            </div>
          )}

          {/* 1-Click Demo Fill Banner */}
          <div className="mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-purple-300">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Testing the platform?</span>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs font-bold text-white hover:text-purple-300 bg-purple-600/60 hover:bg-purple-600 px-2.5 py-1 rounded-lg transition"
            >
              Fill Demo Credentials
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="candidate@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition text-white shadow-xl shadow-purple-500/25 disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-purple-400 hover:underline font-semibold">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}