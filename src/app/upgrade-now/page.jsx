"use client";

import React, { useState, useEffect } from "react";
import { useProfileCheck } from "../hooks/useProfileCheck";
import {
  getSubscriptionPlans,
  createSubscription,
  cancelSubscription,
  getUserSubscription,
  getFreePlanInfo,
  getUsageAlerts,
} from "../api/subscriptionApi";
import toast from "react-hot-toast";

// Professional Icons
const Icons = {
  Pricing: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ),
  Analytics: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Store: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
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
  ),
  Warning: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  ),
  Success: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Cancel: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  Lock: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-5 h-5"
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
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Zap: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Rocket: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
};

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [freePlanInfo, setFreePlanInfo] = useState(null);
  const [usageAlerts, setUsageAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("token");
  const { userData, checkProfileCompletion } = useProfileCheck();

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (userData?.role) {
      setActiveTab(userData.role);
    }
  }, [userData]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [plansResponse, freePlanResponse] = await Promise.all([
        getSubscriptionPlans(),
        getFreePlanInfo(),
      ]);

      if (plansResponse.data.success) {
        setPlans(plansResponse.data.data);
      }

      if (freePlanResponse.data.success) {
        setFreePlanInfo(freePlanResponse.data.data);
      }

      if (isAuthenticated) {
        const [subscriptionResponse, alertsResponse] = await Promise.all([
          getUserSubscription(),
          getUsageAlerts(),
        ]);

        if (subscriptionResponse.data.success) {
          setUserSubscription(subscriptionResponse.data.data);
        }

        if (alertsResponse.data.success) {
          setUsageAlerts(alertsResponse.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading Plans...</p>
      </div>
    </div>
  );

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      return;
    }

    const userRole = userData?.role;
    if (!checkProfileCompletion(userRole)) {
      return;
    }

    // Don't allow subscribing to free plan
    const selectedPlan = plans.find((plan) => plan.plan_id === planId);
    if (selectedPlan?.price === 0) {
      return;
    }

    try {
      setSubscribing(true);
      const response = await createSubscription({ plan_id: planId });

      if (response.data.success) {
        toast.success("Subscription activated!");
        await fetchData();

        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
        }
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create subscription";

      if (
        errorMessage.includes("already has a subscription") ||
        errorMessage.includes("already has an active subscription")
      ) {
        // If user already has a subscription (even canceled), we need to handle upgrade
        toast.error(
          "You already have a subscription. Please cancel your current plan first or contact support."
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userSubscription?.subscription) {
      toast.error("No active subscription found");
      return;
    }

    // Prevent canceling free plan
    if (userSubscription.subscription.plan.price === 0) {
      toast.error(
        "Free plan cannot be canceled as it's the default plan for all users"
      );
      return;
    }

    // 👉 Show custom confirmation toast instead of window.confirm
    const userConfirmed = await confirmToast(
      "Are you sure you want to cancel your subscription?\n\n⚠️ Important: Subscription cancellations are non-refundable. You'll lose access to premium features at the end of your billing period."
    );

    if (!userConfirmed) return;

    try {
      setCanceling(true);
      const response = await cancelSubscription();

      if (response.data.success) {
        toast.success("Subscription cancelled");
        await fetchData();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to cancel subscription";

      if (errorMessage.includes("No active subscription found")) {
        await fetchData();
        toast.error("No active subscription found. Please refresh the page.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setCanceling(false);
    }
  };

  const getFilteredPlans = () => {
    if (!isAuthenticated) {
      return plans;
    }

    if (!userData) {
      return plans;
    }

    if (activeTab === "buyer" || activeTab === "seller") {
      return plans.filter(
        (plan) => plan.plan_type === activeTab || plan.plan_type === "both"
      );
    }

    return plans.filter(
      (plan) => plan.plan_type === userData.role || plan.plan_type === "both"
    );
  };

  const filteredPlans = getFilteredPlans();

  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "all", name: "All Plans", icon: <Icons.Analytics /> },
      { id: "buyer", name: "For Buyers", icon: <Icons.Search /> },
      { id: "seller", name: "For Sellers", icon: <Icons.Store /> },
    ];

    if (!isAuthenticated) {
      return baseTabs;
    }

    if (userData?.role) {
      return [
        { id: "all", name: "All Plans", icon: <Icons.Analytics /> },
        {
          id: userData.role,
          name: userData.role === "buyer" ? "For Buyers" : "For Sellers",
          icon: userData.role === "buyer" ? <Icons.Search /> : <Icons.Store />,
        },
      ];
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  // Calculate current plan status
  const isFreePlanUser =
    !userSubscription?.subscription || userSubscription.isFreePlan;
  const isPaidSubscriptionActive =
    userSubscription?.subscription?.status === "active" &&
    userSubscription.subscription.plan.price > 0;
  const isPaidSubscriptionCanceled =
    userSubscription?.subscription?.status === "canceled" &&
    userSubscription.subscription.plan.price > 0;

  // Calculate usage statistics for top display
  const getUsageStats = () => {
    if (!userSubscription?.usage) return null;

    const usageEntries = Object.entries(userSubscription.usage);
    if (usageEntries.length === 0) return null;

    // Get top 3 most used features
    const topUsedFeatures = usageEntries
      .filter(([_, data]) => data.limit > 0 && data.used > 0)
      .sort((a, b) => b[1].used / b[1].limit - a[1].used / a[1].limit)
      .slice(0, 3);

    return topUsedFeatures;
  };

  const usageStats = getUsageStats();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Current Plan Status & Usage - Top Right Style */}
          {isAuthenticated && userSubscription && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  {/* Current Plan Info - Left Side */}
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isPaidSubscriptionActive
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {isPaidSubscriptionActive ? (
                        <Icons.Success className="w-6 h-6 text-green-600" />
                      ) : (
                        <Icons.User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isPaidSubscriptionActive
                          ? userSubscription.subscription.plan.name
                          : "Free Plan"}
                      </h3>
                      <p
                        className={`text-sm ${
                          isPaidSubscriptionActive
                            ? "text-green-600"
                            : isPaidSubscriptionCanceled
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      >
                        {isPaidSubscriptionActive ? (
                          <>
                            Active • Renews{" "}
                            {new Date(
                              userSubscription.subscription.current_period_end
                            ).toLocaleDateString()}
                            {userSubscription.subscription
                              .cancel_at_period_end && (
                              <span className="ml-2 text-amber-600">
                                (Cancels at period end)
                              </span>
                            )}
                          </>
                        ) : isPaidSubscriptionCanceled ? (
                          "Subscription cancelled - Using Free Plan"
                        ) : (
                          "Free Plan - Upgrade for more features"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Usage Stats - Right Side */}
                  {usageStats && usageStats.length > 0 && (
                    <div className="flex flex-wrap gap-6">
                      {usageStats.map(([feature, data]) => {
                        const percentage = (data.used / data.limit) * 100;
                        return (
                          <div key={feature} className="text-center">
                            <div className="text-sm font-medium text-gray-700 capitalize mb-1">
                              {feature.replace("_", " ")}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    percentage >= 90
                                      ? "bg-red-500"
                                      : percentage >= 70
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-600 min-w-12">
                                {data.used}/{data.limit}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Cancel Button for Active Paid Subscriptions */}
                  {isPaidSubscriptionActive && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={canceling}
                      className="px-6 py-2.5 bg-white border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 disabled:opacity-50 font-medium hover:shadow-sm flex items-center space-x-2"
                    >
                      {canceling ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <Icons.Cancel className="w-4 h-4" />
                          <span>Cancel Plan</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Non-refundable Notice for Paid Plans */}
                {isPaidSubscriptionActive && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icons.Warning className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-700 text-sm">
                        <strong>Important:</strong> Subscription cancellations
                        are non-refundable. You'll maintain access to premium
                        features until the end of your billing period.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-sans text-gray-900 mb-6 bg-gradient-to-r from-gray-400 to-[var(--color-accent-900)] bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[var(--color-accent-900)] max-w-2xl mx-auto leading-relaxed">
            {isAuthenticated && userData
              ? `Scale your ${
                  userData.role === "buyer" ? "procurement" : "business"
                } with the right plan`
              : "Start free, upgrade as you grow. No hidden fees."}
          </p>
        </div>

        {/* Usage Alerts */}
        {usageAlerts.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icons.Warning className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Usage Limits Approaching
                  </h4>
                  <div className="space-y-2">
                    {usageAlerts.slice(0, 3).map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-orange-700 text-sm capitalize">
                          {alert.feature.replace("_", " ")}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-orange-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                alert.severity === "error"
                                  ? "bg-red-500"
                                  : alert.severity === "warning"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                              }`}
                              style={{
                                width: `${Math.min(alert.percentage, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              alert.severity === "error"
                                ? "text-red-600"
                                : alert.severity === "warning"
                                ? "text-orange-600"
                                : "text-blue-600"
                            }`}
                          >
                            {alert.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {usageAlerts.length > 3 && (
                    <p className="text-orange-600 text-sm mt-3">
                      +{usageAlerts.length - 3} more limits approaching
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        {availableTabs.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-[var(--color-accent-900)] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Role-based messaging */}
        {isAuthenticated && userData && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[var(--color-accent-200)] shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-[var(--color-accent-900)] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                <Icons.User className="w-4 h-4" />
              </div>
              <span className="text-[var(--color-accent-900)] font-medium">
                Hello {userData.fullname || userData.username}!{" "}
                {userData.role === "buyer"
                  ? "Find the perfect suppliers with our buyer plans"
                  : "Grow your business with our seller plans"}
              </span>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan, index) => (
                <PlanCard
                  key={plan.plan_id}
                  plan={plan}
                  userSubscription={userSubscription}
                  onSubscribe={handleSubscribe}
                  subscribing={subscribing}
                  isAuthenticated={isAuthenticated}
                  canSubscribe={
                    isAuthenticated &&
                    (plan.plan_type === userData?.role ||
                      plan.plan_type === "both") &&
                    checkProfileCompletion(userData?.role) &&
                    plan.price > 0 // Don't allow subscribing to free plan
                  }
                  featured={index === 1 && filteredPlans.length >= 3}
                  isCurrentPlan={
                    (isFreePlanUser && plan.price === 0) ||
                    userSubscription?.subscription?.plan_id === plan.plan_id
                  }
                  isFreePlan={plan.price === 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icons.Warning className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No plans available
                </h3>
                <p className="text-gray-600">
                  {isAuthenticated && userData
                    ? `No ${userData.role} plans are currently available.`
                    : "No subscription plans are currently available."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Authentication CTA */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-[var(--color-accent-200)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icons.Lock className="w-8 h-8 text-[var(--color-accent-900)]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Get Started?
              </h3>
              <p className="text-[var(--color-accent-900)] mb-8 text-lg">
                Create an account to subscribe to a plan and unlock powerful
                features for your business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => (window.location.href = "/auth/register")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-[var(--color-accent-900)] text-white rounded-2xl font-semibold hover:from-blue-600 hover:[var(--color-accent-900)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => (window.location.href = "/auth/login")}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:border-[var(--color-accent-900)] hover:text-[var(--color-accent-900)] transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Completion Warning */}
        {isAuthenticated && !checkProfileCompletion(userData?.role) && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-[var(--color-accent-50)] border border-[var(--color-accent-400)] rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--color-accent-200)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icons.Edit className="w-6 h-6 text-[var(--color-accent-800)]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--color-accent-800)] text-lg mb-1">
                    Complete Your Profile
                  </h4>
                  <p className="text-[var(--color-accent-700)]">
                    Please complete your profile setup before subscribing to any
                    plans to ensure the best experience.
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/profile")}
                  className="px-6 py-2 bg-[var(--color-accent-700)] text-white rounded-xl font-medium hover:bg-[var(--color-accent-900)] transition-colors duration-200 whitespace-nowrap"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Plan Card Component
const PlanCard = ({
  plan,
  userSubscription,
  onSubscribe,
  subscribing,
  isAuthenticated,
  canSubscribe,
  featured = false,
  isCurrentPlan,
  isFreePlan,
}) => {
  const handlePlanAction = () => {
    if (isFreePlan) {
      // Free plan - show message instead of subscribing
      return;
    }
    onSubscribe(plan.plan_id);
  };

  return (
    <div
      className={`relative flex flex-col h-full bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        featured
          ? "border-blue-500 shadow-2xl transform scale-105"
          : "border-gray-200"
      } ${isCurrentPlan ? "ring-1 ring-[var(--color-accent-500)]" : ""}`}
    >
      {/* Popular Badge */}
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-[var(--color-accent-700)] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
            <Icons.Star className="w-4 h-4" />
            <span>Most Popular</span>
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-[var(--color-accent-700)] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
            <Icons.Success className="w-4 h-4" />
            <span>{isFreePlan ? "Current Plan" : "Active Plan"}</span>
          </span>
        </div>
      )}

      <div className="p-8 flex-1 flex flex-col">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              featured
                ? "bg-gradient-to-r from-blue-100 to-purple-100"
                : isFreePlan
                ? "bg-gray-100"
                : "bg-gradient-to-r from-[var(--color-accent-100)] to-blue-100"
            }`}
          >
            {isFreePlan ? (
              <Icons.User className="w-6 h-6 text-gray-600" />
            ) : featured ? (
              <Icons.Zap className="w-6 h-6 text-blue-600" />
            ) : (
              <Icons.Rocket className="w-6 h-6 text-[var(--color-accent-400)]" />
            )}
          </div>
          <h3
            className={`text-2xl font-bold mb-3 ${
              featured ? "text-gray-900" : "text-gray-800"
            }`}
          >
            {plan.name}
          </h3>
          <p className="text-gray-600 leading-relaxed">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-500 ml-2 text-lg">
              /{plan.billing_cycle}
            </span>
          </div>
          {isFreePlan ? (
            <div className="text-green-600 font-semibold text-sm flex items-center justify-center">
              <Icons.Success className="w-4 h-4 mr-1" />
              Default
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Cancel anytime</div>
          )}
        </div>

        {/* Features List */}
        <div className="flex-1 mb-8">
          <ul className="space-y-3">
            {Object.entries(plan.features)
              .slice(0, 6)
              .map(([key, value]) => (
                <li key={key} className="flex items-start space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icons.Check className="w-3 h-3 text-green-600" />
                  </span>
                  <span className="text-gray-700 text-sm leading-tight">
                    {value}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePlanAction}
          disabled={
            subscribing || isCurrentPlan || !isAuthenticated || !canSubscribe
          }
          className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-200 ${
            isCurrentPlan
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : featured
              ? "bg-gradient-to-r from-blue-500 to-[var(--color-accent-800)] text-white hover:from-blue-600 hover:to-[var(--color-accent-700)] shadow-lg hover:shadow-xl"
              : isFreePlan
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-[var(--color-accent-800)] to-blue-600 text-white hover:from-[var(--color-accent-800)] hover:to-blue-700 shadow-lg hover:shadow-xl"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg`}
        >
          {!isAuthenticated && "Sign Up to Subscribe"}
          {isAuthenticated && !canSubscribe && "Complete Profile to Subscribe"}
          {isAuthenticated && canSubscribe && isCurrentPlan && (
            <span className="flex items-center justify-center space-x-2">
              <Icons.Success className="w-5 h-5" />
              <span>{isFreePlan ? "Current Plan" : "Active Plan"}</span>
            </span>
          )}
          {isAuthenticated && canSubscribe && !isCurrentPlan && subscribing && (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </span>
          )}
          {isAuthenticated &&
            canSubscribe &&
            !isCurrentPlan &&
            !subscribing &&
            (isFreePlan ? "Current Plan" : `Subscribe Now`)}
        </button>
      </div>
    </div>
  );
};

const confirmToast = (message) => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-xl shadow-lg border w-80 text-gray-900">
        <p className="whitespace-pre-line">{message}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
          >
            No
          </button>

          <button
            className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ));
  });
};

export default SubscriptionPlans;
