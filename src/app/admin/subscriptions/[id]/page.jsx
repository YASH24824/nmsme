"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllSubscriptionById } from "@/app/api/adminApi";

// Loading Screen Component
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

export default function SubscriptionDetails() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id;

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSubscriptionById(subscriptionId);
      const subscriptionData = response.data?.data || response.data;

      if (subscriptionData) {
        setSubscription(subscriptionData);
      } else {
        setError("Subscription not found");
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setError("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800 border border-green-200",
        label: "Active",
      },
      canceled: {
        color: "bg-red-100 text-red-800 border border-red-200",
        label: "Canceled",
      },
      past_due: {
        color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        label: "Past Due",
      },
      incomplete: {
        color: "bg-orange-100 text-orange-800 border border-orange-200",
        label: "Incomplete",
      },
      trialing: {
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        label: "Trialing",
      },
    };

    const config = statusConfig[status] || statusConfig.canceled;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getCancelStatusBadge = (cancelAtPeriodEnd) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          cancelAtPeriodEnd
            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}
      >
        {cancelAtPeriodEnd ? "Will Cancel at Period End" : "Active"}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading screen when loading
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709V14a4 4 0 014-4h2a4 4 0 014 4v4.291z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Subscription Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/admin/subscriptions")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Subscription Data
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load subscription details.
          </p>
          <button
            onClick={() => router.push("/admin/subscriptions")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/subscriptions")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Back to Subscriptions
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Details
          </h1>
          <div className="flex items-center gap-4 mt-4">
            {getStatusBadge(subscription.status)}
            {getCancelStatusBadge(subscription.cancel_at_period_end)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Details */}
          {subscription.plan && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Plan Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {subscription.plan.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-900">
                    {subscription.plan.description ||
                      "No description available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <p className="text-gray-900 font-medium">
                    {subscription.plan.currency || "USD"}{" "}
                    {subscription.plan.price || "0"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {subscription.plan.billing_cycle || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {subscription.plan.plan_type || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.plan.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscription.plan.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User Information */}
          {subscription.user && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {subscription.user.fullname}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium">
                    {subscription.user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {subscription.user.role}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscription.user.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Features */}
          {subscription.plan?.features &&
            Object.keys(subscription.plan.features).length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Plan Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(subscription.plan.features).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Billing Period */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Billing Period
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Period Start
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(subscription.current_period_start)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Period End
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dates</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created At
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(subscription.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Updated At
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(subscription.updated_at)}
                </p>
              </div>
              {subscription.canceled_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canceled At
                  </label>
                  <p className="text-gray-900 text-sm font-medium">
                    {formatDate(subscription.canceled_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Information */}
          {subscription.usage && subscription.usage.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Usage
              </h2>
              <div className="space-y-3">
                {subscription.usage.map((usageItem, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-700 text-sm capitalize">
                      {usageItem.feature?.replace(/_/g, " ")}
                    </span>
                    <span className="font-medium text-gray-900 text-sm">
                      {usageItem.used || 0} / {usageItem.limit || "Unlimited"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() =>
                  router.push(
                    `/admin/subscriptions/edit/${subscription.subscription_id}`
                  )
                }
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Subscription
              </button>
              <button
                onClick={() => router.push("/admin/subscriptions")}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Back to Subscriptions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
