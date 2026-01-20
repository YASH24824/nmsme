"use client";
import React, { useState } from "react";
import WhatsAppStyleChat from "../../components/Leads/WhatsAppStyleChat";

export default function ChatPage() {
  const [loading, setLoading] = useState(true);

  // Modern Loading Screen
  function LoadingScreen() {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent-50), var(--color-primary))",
        }}
      >
        <div className="text-center">
          <div className="relative">
            <div
              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
              style={{
                borderColor: "var(--color-accent-200)",
                borderTopColor: "var(--color-accent-700)",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full animate-pulse"
                style={{
                  backgroundColor: "var(--color-accent-700)",
                }}
              ></div>
            </div>
          </div>
          <p
            className="mt-4 font-medium"
            style={{
              color: "var(--color-accent-700)",
            }}
          >
            Loading MSME Guru...
          </p>
        </div>
      </div>
    );
  }
  // Simulate loading completion
  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen">
      <WhatsAppStyleChat />
    </div>
  );
}
