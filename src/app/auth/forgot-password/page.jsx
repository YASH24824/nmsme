"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestOtp, verifyOtp, resetPassword } from "@/app/api/authAPI";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await requestOtp({ email });
      setSuccess(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifyOtp({ email, otp_code: otp });
      if (!res.data.reset_token) throw new Error("Invalid OTP");

      setResetToken(res.data.reset_token);
      setSuccess("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        reset_token: resetToken,
        new_password: newPassword,
      });

      setSuccess(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        router.push("/auth/login?message=password_reset");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "OTP" },
    { number: 3, label: "New Password" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-accent-100)] via-white to-[var(--color-accent-50)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl shadow-2xl border border-white/40 rounded-3xl p-10 space-y-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[var(--color-accent-700)] to-[var(--color-accent-900)] bg-clip-text text-transparent">
            Recover Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            Follow the steps to reset your password securely
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between relative">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 
                  ${
                    step === s.number
                      ? "bg-[var(--color-accent-700)] text-white shadow-lg scale-110"
                      : step > s.number
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {step > s.number ? (
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                  </svg>
                ) : (
                  s.number
                )}
              </div>

              <span
                className={`text-xs mt-2 font-medium ${
                  step >= s.number ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mt-4 ${
                    step > s.number ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
            </svg>
            {success}
          </div>
        )}

        {/* ====================== */}
        {/* STEP 1 – ENTER EMAIL   */}
        {/* ====================== */}
        {step === 1 && (
          <form className="space-y-6" onSubmit={handleRequestOtp}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full mt-2 px-4 py-3 border-2 rounded-xl bg-white shadow-sm border-gray-200 focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-800)] text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ====================== */}
        {/* STEP 2 – VERIFY OTP   */}
        {/* ====================== */}
        {step === 2 && (
          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                className="w-full mt-2 px-4 py-3 border-2 rounded-xl text-center tracking-widest text-lg font-semibold bg-white shadow-sm border-gray-200 focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* ====================== */}
        {/* STEP 3 – RESET PASS   */}
        {/* ====================== */}
        {step === 3 && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full mt-2 px-4 py-3 border-2 rounded-xl bg-white shadow-sm border-gray-200 focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full mt-2 px-4 py-3 border-2 rounded-xl bg-white shadow-sm border-gray-200 focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
