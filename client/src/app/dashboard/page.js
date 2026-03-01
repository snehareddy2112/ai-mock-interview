"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Home() {
  const router = useRouter();

  const handleDemoLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: "demo@aimock.com",
        password: "Demo@123",
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");

    } catch (err) {
      alert("Demo account not found. Please create demo user first.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-6">

      {/* Hero Content */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6">
          AI Mock Interview Assistant 🎤
        </h1>

        <p className="text-gray-300 text-lg mb-10">
          Practice interviews with AI. Get real-time feedback, performance
          analytics, and improve your technical confidence.
        </p>

        <div className="flex gap-6 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-8 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Demo Floating Card */}
      <div className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-80 shadow-2xl">
        <h2 className="text-lg font-semibold mb-3">
          🚀 Instant Demo Access
        </h2>

        <p className="text-sm text-gray-300 mb-2">
          Skip signup. Explore full functionality instantly.
        </p>

        <div className="text-sm text-gray-400 mb-4">
          <p>Email: demo@aimock.com</p>
          <p>Password: Demo@123</p>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
        >
          Try Demo Now
        </button>
      </div>

    </div>
  );
}