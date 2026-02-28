export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome to Your Dashboard 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Total Interviews</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Average Score</h3>
          <p className="text-3xl font-bold mt-2">0%</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Last Session</h3>
          <p className="text-lg mt-2 text-gray-300">
            No sessions yet
          </p>
        </div>

      </div>
    </div>
  );
}