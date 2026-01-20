import axiosInstance from "../lib/axiosInstance";

// Subscription APIs
export const getSubscriptionPlans = () =>
  axiosInstance.get("/subscriptions/plans");

export const getUserSubscription = () =>
  axiosInstance.get("/subscriptions/my-subscription");

export const createSubscription = (data) =>
  axiosInstance.post("/subscriptions/subscribe", data);

export const cancelSubscription = () =>
  axiosInstance.post("/subscriptions/cancel");

export const getFreePlanInfo = () =>
  axiosInstance.get("/subscriptions/free-plan");

export const getUsageAlerts = () =>
  axiosInstance.get("/subscriptions/usage-alerts");

// router.post(
//   "/check-multiple-features",
//   authenticate,
//   checkMultipleFeaturesEndpoint
// );
