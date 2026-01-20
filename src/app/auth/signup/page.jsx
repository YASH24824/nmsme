"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { registerUser } from "@/app/api/authAPI";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        role: formData.role,
      });

      toast.success("User Account Created");
      router.push("/auth/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to create account. Try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE — BRANDING */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-[var(--color-accent-700)] to-[var(--color-accent-900)] text-white flex flex-col justify-center p-12 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-6 drop-shadow-xl">
            Create Your MSME Guru Account
          </h1>

          <p className="text-lg text-white/90 leading-relaxed max-w-md">
            Join thousands of entrepreneurs using MSME Guru to grow, scale, and
            build successful businesses. Get powerful tools, expert guidance,
            and your own professional marketplace profile.
          </p>

          <ul className="mt-8 space-y-4 text-white/90">
            <li className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Buyers & Sellers marketplace</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Verified MSME connections</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Tools to grow your business</span>
            </li>
          </ul>

          <p className="mt-12 text-sm opacity-80">
            MSME Guru • Empowering Indian Businesses 🇮🇳
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — SIGNUP FORM */}
      <div className="lg:w-1/2 w-full bg-[var(--color-accent-50)] flex items-center justify-center p-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[var(--color-accent-700)] to-[var(--color-accent-900)] bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Join MSME Guru and start your business journey
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                required
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] bg-white transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] bg-white transition-all"
              />
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-accent-600)] focus:ring-[var(--color-accent-600)] bg-white transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Choose Your Role
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.role === "buyer"
                      ? "border-[var(--color-accent-600)] bg-[var(--color-accent-50)] shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === "buyer"}
                    onChange={handleChange}
                    className="absolute opacity-0"
                  />
                  <span className="font-medium text-gray-700">Buyer</span>
                </label>

                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.role === "seller"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={handleChange}
                    className="absolute opacity-0"
                  />
                  <span className="font-medium text-gray-700">Seller</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[var(--color-accent-600)] to-[var(--color-accent-800)] hover:from-[var(--color-accent-700)] hover:to-[var(--color-accent-900)] text-white py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>

          {/* Terms */}
          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <span className="text-[var(--color-accent-700)] cursor-pointer">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-[var(--color-accent-700)] cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
