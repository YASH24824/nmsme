// components/admin/users/UserManagement.jsx
"use client";

import { useState, useEffect } from "react";
import {
  getAllUsers,
  getAllBuyers,
  getAllSellers,
  updateUserStatus,
  deleteUser,
  getAllUserStates,
  createUser,
  updateUser,
} from "../../api/adminApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

// User Form Component
const UserForm = ({ showModal, onClose, onSubmit, user, submitting }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    role: "buyer",
    status: "active",
    password: "",
    confirmPassword: "",
    bio: "",
    country: "",
    state: "",
    address: "",
    pincode: "",
    is_verified: false,
    // Profile data based on role
    buyerprofile: {
      full_name: "",
      company_name: "",
      location: "",
    },
    sellerprofile: {
      business_name: "",
      business_description: "",
      product_categories: "",
      certifications: "",
      verification_status: "pending",
      subscription_plan: "free",
    },
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "buyer",
        status: user.status || "active",
        password: "",
        confirmPassword: "",
        bio: user.bio || "",
        country: user.country || "",
        state: user.state || "",
        address: user.address || "",
        pincode: user.pincode || "",
        is_verified: user.is_verified || false,
        buyerprofile: user.buyerprofile
          ? {
              full_name: user.buyerprofile.full_name || "",
              company_name: user.buyerprofile.company_name || "",
              location: user.buyerprofile.location || "",
            }
          : {
              full_name: "",
              company_name: "",
              location: "",
            },
        sellerprofile: user.sellerprofile
          ? {
              business_name: user.sellerprofile.business_name || "",
              business_description:
                user.sellerprofile.business_description || "",
              product_categories: user.sellerprofile.product_categories || "",
              certifications: user.sellerprofile.certifications || "",
              verification_status:
                user.sellerprofile.verification_status || "pending",
              subscription_plan: user.sellerprofile.subscription_plan || "free",
            }
          : {
              business_name: "",
              business_description: "",
              product_categories: "",
              certifications: "",
              verification_status: "pending",
              subscription_plan: "free",
            },
      });
    } else {
      // Reset form for new user
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        role: "buyer",
        status: "active",
        password: "",
        confirmPassword: "",
        bio: "",
        country: "",
        state: "",
        address: "",
        pincode: "",
        is_verified: false,
        buyerprofile: {
          full_name: "",
          company_name: "",
          location: "",
        },
        sellerprofile: {
          business_name: "",
          business_description: "",
          product_categories: "",
          certifications: "",
          verification_status: "pending",
          subscription_plan: "free",
        },
      });
    }
  }, [user]);

  const handleFormChange = (field, value) => {
    if (field === "buyerprofile" || field === "sellerprofile") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedFormChange = (parentField, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!user && !formData.password) {
      errors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!user && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Prepare data for submission
    const submitData = {
      fullname: formData.fullname,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      bio: formData.bio,
      country: formData.country,
      state: formData.state,
      address: formData.address,
      pincode: formData.pincode,
      is_verified: formData.is_verified,
    };

    // Only include password if it's provided (for new users or when updating password)
    if (formData.password) {
      submitData.password = formData.password;
    }

    // Include profile data based on role
    if (formData.role === "buyer") {
      submitData.buyerprofile = {
        full_name: formData.buyerprofile.full_name || formData.fullname,
        company_name: formData.buyerprofile.company_name,
        location: formData.buyerprofile.location || "Unknown",
      };
    } else if (formData.role === "seller") {
      submitData.sellerprofile = {
        business_name:
          formData.sellerprofile.business_name ||
          `${formData.fullname}'s Business`,
        business_description: formData.sellerprofile.business_description,
        product_categories: formData.sellerprofile.product_categories,
        certifications: formData.sellerprofile.certifications,
        verification_status: formData.sellerprofile.verification_status,
        subscription_plan: formData.sellerprofile.subscription_plan,
      };
    }

    onSubmit(submitData);
  };

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      phone: "",
      role: "buyer",
      status: "active",
      password: "",
      confirmPassword: "",
      bio: "",
      country: "",
      state: "",
      address: "",
      pincode: "",
      is_verified: false,
      buyerprofile: {
        full_name: "",
        company_name: "",
        location: "",
      },
      sellerprofile: {
        business_name: "",
        business_description: "",
        product_categories: "",
        certifications: "",
        verification_status: "pending",
        subscription_plan: "free",
      },
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
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {user ? "Edit User" : "Create New User"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => handleFormChange("fullname", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  formErrors.fullname
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {formErrors.fullname && (
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
                  {formErrors.fullname}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  formErrors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter email address"
                disabled={!!user}
              />
              {formErrors.email && (
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
                  {formErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  formErrors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Enter phone number"
              />
              {formErrors.phone && (
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
                  {formErrors.phone}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleFormChange("role", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Verification Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Status
              </label>
              <select
                value={formData.is_verified}
                onChange={(e) =>
                  handleFormChange("is_verified", e.target.value === "true")
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
              >
                <option value={false}>Not Verified</option>
                <option value={true}>Verified</option>
              </select>
            </div>
          </div>

          {/* Password (only for new users) */}
          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    formErrors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter password"
                />
                {formErrors.password && (
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
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleFormChange("confirmPassword", e.target.value)
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    formErrors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Confirm password"
                />
                {formErrors.confirmPassword && (
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
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Basic Profile Fields */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Profile Information
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleFormChange("bio", e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                  placeholder="Enter user bio (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      handleFormChange("country", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                  placeholder="Enter address (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleFormChange("pincode", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* Buyer Profile Fields */}
          {formData.role === "buyer" && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Buyer Profile
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name (Buyer Profile)
                  </label>
                  <input
                    type="text"
                    value={formData?.buyerprofile?.full_name}
                    onChange={(e) =>
                      handleNestedFormChange(
                        "buyerprofile",
                        "full_name",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="Buyer full name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.buyerprofile.company_name}
                      onChange={(e) =>
                        handleNestedFormChange(
                          "buyerprofile",
                          "company_name",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Company name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.buyerprofile.location}
                      onChange={(e) =>
                        handleNestedFormChange(
                          "buyerprofile",
                          "location",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Location"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seller Profile Fields */}
          {formData.role === "seller" && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Seller Profile
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.sellerprofile.business_name}
                    onChange={(e) =>
                      handleNestedFormChange(
                        "sellerprofile",
                        "business_name",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="Business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={formData.sellerprofile.business_description}
                    onChange={(e) =>
                      handleNestedFormChange(
                        "sellerprofile",
                        "business_description",
                        e.target.value
                      )
                    }
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
                    placeholder="Business description (optional)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Categories
                    </label>
                    <input
                      type="text"
                      value={formData.sellerprofile.product_categories}
                      onChange={(e) =>
                        handleNestedFormChange(
                          "sellerprofile",
                          "product_categories",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Product categories"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Certifications
                    </label>
                    <input
                      type="text"
                      value={formData.sellerprofile.certifications}
                      onChange={(e) =>
                        handleNestedFormChange(
                          "sellerprofile",
                          "certifications",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                      placeholder="Certifications (optional)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Status
                    </label>
                    <select
                      value={formData.sellerprofile.verification_status}
                      onChange={(e) =>
                        handleNestedFormChange(
                          "sellerprofile",
                          "verification_status",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subscription Plan
                    </label>
                    <select
                      value={formData.sellerprofile.subscription_plan}
                      onChange={(e) =>
                        handleNestedFormChange(
                          "sellerprofile",
                          "subscription_plan",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {user ? "Updating..." : "Creating..."}
                </span>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const navigate = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    buyers: 0,
    sellers: 0,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, roleFilter]);

  const fetchStats = async () => {
    try {
      const res = await getAllUserStates();
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let response;

      if (roleFilter === "buyer") {
        response = await getAllBuyers({
          page: currentPage,
          limit: itemsPerPage,
        });
      } else if (roleFilter === "seller") {
        response = await getAllSellers({
          page: currentPage,
          limit: itemsPerPage,
        });
      } else {
        response = await getAllUsers({
          page: currentPage,
          limit: itemsPerPage,
        });
      }

      const usersData = response.data?.data || [];
      const total = response.data?.total || 0;
      const pages = Math.ceil(total / itemsPerPage);
      setUsers(usersData);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, { status: newStatus });

      setUsers(
        users.map((user) =>
          user.user_id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.user_id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
      toast.success("User deleted");
      fetchStats(); // Refresh stats after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setSubmitting(true);
      await createUser(userData);
      setShowUserForm(false);
      toast.success("User created");
      fetchUsers(); // Refresh the users list
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      setSubmitting(true);
      await updateUser(editingUser.user_id, userData);
      setShowUserForm(false);
      setEditingUser(null);
      toast.success("User updated");
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      if (bulkAction === "delete") {
        // Show confirmation for bulk delete
        if (
          confirm(
            `Are you sure you want to delete ${selectedUsers.length} users?`
          )
        ) {
          await Promise.all(selectedUsers.map((userId) => deleteUser(userId)));
          setSelectedUsers([]);
          fetchUsers();
          fetchStats(); // Refresh stats after bulk deletion
          toast.success("Users deleted");
        }
      } else {
        // Handle bulk status updates
        await Promise.all(
          selectedUsers.map((userId) =>
            updateUserStatus(userId, { status: bulkAction })
          )
        );
        setSelectedUsers([]);
        fetchUsers();
        toast.success("Users updated");
      }
      setBulkAction("");
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.user_id)
    );
  };

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      suspended: { color: "bg-red-100 text-red-800", label: "Suspended" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleview = (id) => {
    navigate.push(`users/${id}`);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      buyer: { color: "bg-blue-100 text-blue-800", label: "Buyer" },
      seller: { color: "bg-purple-100 text-purple-800", label: "Seller" },
    };

    const config = roleConfig[role] || {
      color: "bg-gray-100 text-gray-800",
      label: role,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading screen when loading and no users
  if (loading && users.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all users, buyers, and sellers
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
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
          Add User
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeUsers}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Buyers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.buyers}</p>
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.sellers}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyers Only</option>
              <option value="seller">Sellers Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-700">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex flex-wrap gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Bulk Actions</option>
                <option value="active">Mark Active</option>
                <option value="inactive">Mark Inactive</option>
                <option value="suspended">Suspend</option>
                <option value="delete">Delete</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-4 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.user_id)}
                      onChange={() => toggleUserSelection(user.user_id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user?.avatar_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.avatar_url}`}
                            alt={user?.fullname || "User Avatar"}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user?.fullname?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.fullname || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.email || "No Email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusUpdate(user.user_id, e.target.value)
                      }
                      className={`text-sm border-0 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        user.status === "active"
                          ? "bg-green-50 text-green-800"
                          : user.status === "inactive"
                          ? "bg-gray-50 text-gray-800"
                          : user.status === "suspended"
                          ? "bg-red-50 text-red-800"
                          : "bg-yellow-50 text-yellow-800"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.last_login ? formatDate(user.last_login) : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_verified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Verified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleview(user.user_id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        View details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserForm
        showModal={showUserForm}
        onClose={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        user={editingUser}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {userToDelete.fullname}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete.user_id)}
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

export default UserManagement;
