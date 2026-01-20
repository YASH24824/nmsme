"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-accent-100)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-[var(--color-accent-700)] to-[var(--color-accent-900)] bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-accent-900)] mb-4">
            Page Not Found
          </h2>
          <p className="text-[var(--color-accent-600)] text-lg leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-[var(--color-accent-500)] text-sm sm:text-base">
            It might have been moved, deleted, or perhaps it never existed in
            the first place.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={() => router.push("/")}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-700)] hover:from-[var(--color-accent-600)] hover:to-[var(--color-accent-800)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

            <span className="relative flex items-center">
              <svg
                className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Homepage
            </span>
          </button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <p className="text-[var(--color-accent-400)] text-sm">
            Need help?{" "}
            <button
              onClick={() => router.push("/contact")}
              className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-medium transition-colors"
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-1/4 left-1/4 w-4 h-4 bg-[var(--color-accent-200)] rounded-full opacity-50 animate-pulse"></div>
      <div className="fixed bottom-1/3 right-1/4 w-6 h-6 bg-[var(--color-accent-300)] rounded-full opacity-30 animate-bounce"></div>
      <div className="fixed top-1/3 right-1/3 w-3 h-3 bg-[var(--color-accent-400)] rounded-full opacity-40 animate-ping"></div>
    </div>
  );
}
