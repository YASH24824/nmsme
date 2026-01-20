// app/auth/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/app/api/authAPI";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Welcome Back!");

      setTimeout(() => {
        router.replace(user?.role === "admin" ? "/admin/dashboard" : "/");
      }, 800);
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password. Try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE — BRANDING */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-[var(--color-accent-700)] to-[var(--color-accent-900)] text-white flex flex-col justify-center p-12 relative overflow-hidden">
        {/* glow blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-6 drop-shadow-xl">
            Welcome to MSME Guru
          </h1>

          <p className="text-lg text-white/90 leading-relaxed max-w-md">
            MSME Guru is your trusted partner for business growth. Access tools,
            connect with mentors, explore resources, and unlock the full
            potential of your MSME journey.
          </p>

          <ul className="mt-8 space-y-4 text-white/90">
            <li className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Professional Business Support</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Connect with Verified Experts</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Access Funding & Growth Resources</span>
            </li>
          </ul>

          <p className="mt-12 text-sm opacity-80">
            Empowering all MSMEs • Together we grow 🌱
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — LOGIN CARD */}
      <div className="lg:w-1/2 w-full bg-[var(--color-accent-50)] flex items-center justify-center p-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-accent-700)] to-[var(--color-accent-900)] bg-clip-text text-transparent text-center mb-8">
            Sign in to Your Account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] transition-all bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] transition-all bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-gray-600">Remember me</span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-800)] hover:from-[var(--color-accent-700)] hover:to-[var(--color-accent-900)] text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-medium"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
