// components/admin/SubscriptionManagement.jsx
"use client";

import { useState, useEffect } from "react";
import {
  getAllSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../../api/adminApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

// Create Subscription Form Component
const CreateSubscriptionForm = ({
  showModal,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "USD",
    billing_cycle: "monthly",
    plan_type: "buyer",
    features: {
      lead_creation: "",
      basic_search: "",
      seller_contact: "",
      project_management: "",
      saved_searches: "",
    },
    limits: {
      lead_creation: 0,
      saved_searches: 0,
      premium_search: 0,
      seller_contact: 0,
    },
    is_active: true,
    sort_order: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Plan name is required";
    }
    if (formData.price < 0) {
      errors.price = "Price must be non-negative";
    }
    if (formData.sort_order < 0) {
      errors.sort_order = "Sort order must be non-negative";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clean up empty feature strings
    const cleanedFeatures = Object.fromEntries(
      Object.entries(formData.features).filter(([_, value]) => value !== "")
    );

    const cleanedLimits = Object.fromEntries(
      Object.entries(formData.limits).filter(([_, value]) => value !== 0)
    );

    onSubmit({
      ...formData,
      features: cleanedFeatures,
      limits: cleanedLimits,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      currency: "USD",
      billing_cycle: "monthly",
      plan_type: "buyer",
      features: {
        lead_creation: "",
        basic_search: "",
        seller_contact: "",
        project_management: "",
        saved_searches: "",
      },
      limits: {
        lead_creation: 0,
        saved_searches: 0,
        premium_search: 0,
        seller_contact: 0,
      },
      is_active: true,
      sort_order: 0,
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full border border-white/20 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Subscription Plan
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-500"
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
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    formErrors.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter plan name"
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                  placeholder="Enter plan description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Type
                </label>
                <select
                  value={formData.plan_type}
                  onChange={(e) =>
                    handleFormChange("plan_type", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
                >
                  <option value="buyer">Buyer Plan</option>
                  <option value="seller">Seller Plan</option>
                </select>
              </div>
            </div>

            {/* Pricing & Settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleFormChange("price", parseFloat(e.target.value) || 0)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      formErrors.price
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billing_cycle}
                    onChange={(e) =>
                      handleFormChange("billing_cycle", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      handleFormChange(
                        "sort_order",
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      formErrors.sort_order
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {formErrors.sort_order && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.sort_order}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      handleFormChange("is_active", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">
                    Active Plan
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Features (One per line)
            </label>
            <div className="space-y-2">
              {Object.entries(formData.features).map(([key, value]) => (
                <input
                  key={key}
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleNestedChange("features", key, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${key.replace("_", " ")} feature`}
                />
              ))}
            </div>
          </div>

          {/* Limits */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Limits
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.limits).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-600 mb-1 capitalize">
                    {key.replace("_", " ")}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleNestedChange(
                        "limits",
                        key,
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {submitting ? "Creating..." : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Subscription Form Component
const EditSubscriptionForm = ({
  showModal,
  onClose,
  onSubmit,
  plan,
  submitting,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    currency: "USD",
    billing_cycle: "monthly",
    plan_type: "buyer",
    features: {},
    limits: {},
    is_active: true,
    sort_order: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || 0,
        currency: plan.currency || "USD",
        billing_cycle: plan.billing_cycle || "monthly",
        plan_type: plan.plan_type || "buyer",
        features: plan.features || {},
        limits: plan.limits || {},
        is_active: plan.is_active ?? true,
        sort_order: plan.sort_order || 0,
      });
    }
  }, [plan]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Plan name is required";
    }
    if (formData.price < 0) {
      errors.price = "Price must be non-negative";
    }
    if (formData.sort_order < 0) {
      errors.sort_order = "Sort order must be non-negative";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  if (!showModal || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full border border-white/20 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Subscription Plan
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-500"
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
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    formErrors.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Type
                </label>
                <select
                  value={formData.plan_type}
                  onChange={(e) =>
                    handleFormChange("plan_type", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
                >
                  <option value="buyer">Buyer Plan</option>
                  <option value="seller">Seller Plan</option>
                </select>
              </div>
            </div>

            {/* Pricing & Settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleFormChange("price", parseFloat(e.target.value) || 0)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      formErrors.price
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    value={formData.billing_cycle}
                    onChange={(e) =>
                      handleFormChange("billing_cycle", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      handleFormChange(
                        "sort_order",
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      formErrors.sort_order
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {formErrors.sort_order && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.sort_order}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      handleFormChange("is_active", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">
                    Active Plan
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Features
            </label>
            <div className="space-y-2">
              {Object.entries(formData.features).map(([key, value]) => (
                <input
                  key={key}
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleNestedChange("features", key, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>
          </div>

          {/* Limits */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Limits
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.limits).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-600 mb-1 capitalize">
                    {key.replace("_", " ")}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleNestedChange(
                        "limits",
                        key,
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {submitting ? "Updating..." : "Update Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Subscription Management Component
const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planTypeFilter, setPlanTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleView = (planid) => {
    console.log(planid);
    router.push(`subscriptions/${planid}`);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllSubscriptionPlans();
      setPlans(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (formData) => {
    try {
      setSubmitting(true);
      await createSubscriptionPlan(formData);
      setShowCreateModal(false);
      fetchPlans();
      toast.success("Subscription plan created successfully!");
    } catch (error) {
      console.error("Error creating subscription plan:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePlan = async (formData) => {
    try {
      setSubmitting(true);
      await updateSubscriptionPlan(selectedPlan.plan_id, formData);
      setShowEditModal(false);
      setSelectedPlan(null);
      fetchPlans();
      toast.success("Subscription plan updated!");
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      toast.error("Failed to update subscription plan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
      await deleteSubscriptionPlan(selectedPlan.plan_id);
      setShowDeleteModal(false);
      setSelectedPlan(null);
      fetchPlans();
      toast.success("Subscription plan deleted!");
    } catch (error) {
      console.error("Error deleting subscription plan:", error);
      toast.error("Failed to delete subscription plan");
    }
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const getPlanTypeBadge = (planType) => {
    return planType === "buyer" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Buyer
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Seller
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  const formatPrice = (price, currency) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesType =
      planTypeFilter === "all" || plan.plan_type === planTypeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && plan.is_active) ||
      (statusFilter === "inactive" && !plan.is_active);

    return matchesType && matchesStatus;
  });

  const buyerPlans = plans.filter((plan) => plan.plan_type === "buyer");
  const sellerPlans = plans.filter((plan) => plan.plan_type === "seller");
  const activePlans = plans.filter((plan) => plan.is_active);

  // Show loading screen when loading
  if (loading && plans.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage subscription plans for buyers and sellers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Plan
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Buyer Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {buyerPlans.length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seller Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {sellerPlans.length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {activePlans.length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={planTypeFilter}
              onChange={(e) => setPlanTypeFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
            >
              <option value="all">All Types</option>
              <option value="buyer">Buyer Plans</option>
              <option value="seller">Seller Plans</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr
                  key={plan.plan_id}
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {plan.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {plan.description}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.values(plan.features || {})
                          .slice(0, 2)
                          .map((feature, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        {Object.values(plan.features || {}).length > 2 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{Object.values(plan.features || {}).length - 2}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getPlanTypeBadge(plan.plan_type)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatPrice(plan.price, plan.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                    {plan.billing_cycle}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(plan.is_active)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(plan)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(plan.plan_id)}
                      className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPlans.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No plans found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new subscription plan.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Plan
            </button>
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      <CreateSubscriptionForm
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePlan}
        submitting={submitting}
      />

      {/* Edit Plan Modal */}
      <EditSubscriptionForm
        showModal={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPlan(null);
        }}
        onSubmit={handleUpdatePlan}
        plan={selectedPlan}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Subscription Plan
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedPlan.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
