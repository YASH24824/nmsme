import axiosInstance from "../lib/axiosInstance";

/* ================================
   👤 USER MANAGEMENT
================================ */
export const getAllUsers = (params) =>
  axiosInstance.get("/admin/users", { params });

export const getAllUserStates = () => axiosInstance.get("/admin/stats");

export const createUser = (userData) =>
  axiosInstance.post(`/admin/users`, userData);

export const updateUser = (id, userData) =>
  axiosInstance.put(`/admin/users/${id}`, userData);

export const getUserById = (id) => axiosInstance.get(`/admin/users/${id}`);

export const updateUserStatus = (id, data) =>
  axiosInstance.patch(`/admin/users/${id}/status`, data);

export const deleteUser = (id) => axiosInstance.delete(`/admin/users/${id}`);

export const getAllBuyers = (params) =>
  axiosInstance.get("/admin/buyers", { params });

export const getAllSellers = (params) =>
  axiosInstance.get("/admin/sellers", { params });

/* ================================
   🏠 LISTING MANAGEMENT
================================ */
export const getAllListings = (params) =>
  axiosInstance.get("/admin/listings", { params });

export const getListingById = (id) =>
  axiosInstance.get(`/admin/listings/${id}`);

export const updateListingStatus = (id, data) =>
  axiosInstance.patch(`/admin/listings/${id}/status`, data);

export const deleteListing = (id) =>
  axiosInstance.delete(`/admin/listings/${id}`);

/* ================================
   🏷️ CATEGORY MANAGEMENT
================================ */
export const getAllCategories = (params) =>
  axiosInstance.get("/admin/categories", { params });

export const createCategory = (data) =>
  axiosInstance.post("/admin/categories", data,
     {
    headers: { "Content-Type": "multipart/form-data" },
  }
  );

export const updateCategory = (id, data) =>
  axiosInstance.put(`/admin/categories/${id}`, data,
     {
    headers: { "Content-Type": "multipart/form-data" },
  }
  );

export const deleteCategory = (id) =>
  axiosInstance.delete(`/admin/categories/${id}`);

/* ================================
   📞 LEAD MANAGEMENT
================================ */
export const getAllLeads = (params) =>
  axiosInstance.get("/admin/leads", { params });

export const getLeadById = (id) => axiosInstance.get(`/admin/leads/${id}`);

/* ================================
   ⭐ REVIEW MANAGEMENT
================================ */
export const getAllReviews = (params) =>
  axiosInstance.get("/admin/reviews", { params });

export const updateReviewStatus = (id, data) =>
  axiosInstance.patch(`/admin/reviews/${id}/status`, data);

export const deleteReview = (id) =>
  axiosInstance.delete(`/admin/reviews/${id}`);

/* ================================
   📄 DOCUMENT / VERIFICATION MANAGEMENT
================================ */
export const getAllDocuments = (params) =>
  axiosInstance.get("/admin/documents", { params });

export const updateDocumentStatus = (id, data) =>
  axiosInstance.patch(`/admin/documents/${id}/status`, data);

/* ================================
   💳 SUBSCRIPTION MANAGEMENT
================================ */
export const getAllSubscriptions = (params) =>
  axiosInstance.get("/admin/subscriptions", { params });

export const getAllSubscriptionPlans = (params) =>
  axiosInstance.get("/admin/subscriptions/plans", { params });

export const getAllSubscriptionById = (id) =>
  axiosInstance.get(`/admin/subscriptions/${id}`);

export const createSubscriptionPlan = (data) =>
  axiosInstance.post("/admin/subscription-plans", data);

export const updateSubscriptionPlan = (id, data) =>
  axiosInstance.put(`/admin/subscription-plans/${id}`, data);

export const deleteSubscriptionPlan = (id) =>
  axiosInstance.delete(`/admin/subscription-plans/${id}`);

// ----------------------
// Admin Usage / Assignment Controls
// ----------------------
export const getUserUsage = (userId) =>
  axiosInstance.get(`/admin/subscriptions/usage/${userId}`);

export const resetUserUsage = (userId) =>
  axiosInstance.post(`/admin/subscriptions/usage/${userId}/reset`);

export const adjustUsage = (usageId, data) =>
  axiosInstance.patch(`/admin/subscriptions/usage/${usageId}`, data);

export const assignSubscriptionToUser = (id, data) =>
  axiosInstance.patch(`/admin/subscriptions/${id}/assign`, data);

export const updateSubscriptionStatus = (id, data) =>
  axiosInstance.patch(`/admin/subscriptions/${id}/status`, data);
/* ================================
   🚀 PAGINATION + HELPERS
================================ */
export const fetchPaginatedUsers = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  const params = { page, limit, ...filters };
  const response = await getAllUsers(params);
  return response.data;
};

export const fetchPaginatedListings = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  const params = { page, limit, ...filters };
  const response = await getAllListings(params);
  return response.data;
};
