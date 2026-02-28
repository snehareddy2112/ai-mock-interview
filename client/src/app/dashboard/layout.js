"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-10 text-purple-400">
          AI Interview
        </h2>

        <nav className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/new"
            className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Start Interview
          </Link>

          <button
            onClick={handleLogout}
            className="mt-10 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}