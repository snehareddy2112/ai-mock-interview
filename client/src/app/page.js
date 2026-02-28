import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">

      <h1 className="text-5xl font-bold mb-6">
        AI Mock Interview Assistant 🎤
      </h1>

      <p className="text-gray-300 max-w-xl mb-8 text-lg">
        Practice interviews with AI. Get real-time feedback, improve your
        answers, and track your performance.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
        >
          Create Account
        </Link>
      </div>

    </div>
  );
}