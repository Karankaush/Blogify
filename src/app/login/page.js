'use client'
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    const email = form.email;
    const password = form.password;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🔑 Login to Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-md transition"
          >
            🚀 Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register here
          </a>

          {error && (
            <p>{error}</p>
          )}


        </p>
      </div>
    </div>
  );
}
