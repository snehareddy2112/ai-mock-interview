export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg hover:scale-105 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}