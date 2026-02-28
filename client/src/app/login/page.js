"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token } = res.data;

      // Store token
      localStorage.setItem("token", token);

      // Redirect
      router.push("/dashboard");

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <form
        onSubmit={handleLogin}
        className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}