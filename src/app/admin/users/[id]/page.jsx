"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById } from "@/app/api/adminApi";

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
export default function UserDetails() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserById(userId);
      setUser(response.data || null);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen when loading
  if (loading) {
    return <LoadingScreen />;
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800 border border-green-200",
        label: "Active",
      },
      inactive: {
        color: "bg-red-100 text-red-800 border border-red-200",
        label: "Inactive",
      },
      suspended: {
        color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        label: "Suspended",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getVerificationBadge = (isVerified) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isVerified
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
        }`}
      >
        {isVerified ? "Verified" : "Not Verified"}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      seller: {
        color: "bg-purple-100 text-purple-800 border border-purple-200",
        label: "Seller",
      },
      buyer: {
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        label: "Buyer",
      },
      admin: {
        color: "bg-red-100 text-red-800 border border-red-200",
        label: "Admin",
      },
    };

    const config = roleConfig[role] || roleConfig.buyer;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
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
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The user you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/admin/users")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Users
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
            onClick={() => router.push("/admin/users")}
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
            Back to Users
          </button>
          <div className="flex items-center gap-4">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.fullname}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {user.fullname?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.fullname}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {getStatusBadge(user.status)}
            {getRoleBadge(user.role)}
            {getVerificationBadge(user.is_verified)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{user.fullname}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <p className="text-gray-900 leading-relaxed">
                  {user.bio || "No bio provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <p className="text-gray-900 font-medium">{user.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <p className="text-gray-900 font-medium">{user.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <p className="text-gray-900 font-medium">{user.country}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <p className="text-gray-900 font-medium">{user.pincode}</p>
              </div>
            </div>
          </div>

          {/* Seller Profile (if seller) */}
          {user.role === "seller" && user.sellerprofile && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.sellerprofile.business_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {user.sellerprofile.business_type?.replace("_", " ") ||
                      "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <p className="text-gray-900 leading-relaxed">
                    {user.sellerprofile.business_description ||
                      "No description available"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years in Business
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.sellerprofile.years_in_business || "0"} years
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Categories
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.sellerprofile.product_categories || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.sellerprofile.certifications || "None"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.sellerprofile.verification_status === "verified"
                        ? "bg-green-100 text-green-800"
                        : user.sellerprofile.verification_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.sellerprofile.verification_status || "pending"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Plan
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {user.sellerprofile.subscription_plan || "free"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buyer Profile (if buyer) */}
          {user.role === "buyer" && user.buyerprofile && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Buyer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.buyerprofile.full_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.buyerprofile.company_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.buyerprofile.location || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">User ID</span>
                <span className="font-semibold text-gray-900">
                  {user.user_id}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Role</span>
                {getRoleBadge(user.role)}
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Status</span>
                {getStatusBadge(user.status)}
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Verified</span>
                {getVerificationBadge(user.is_verified)}
              </div>
            </div>
          </div>

          {/* Activity Dates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Activity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(user.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(user.updated_at)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Login
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {formatDate(user.last_login)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/admin/users/edit/${user.user_id}`)}
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
                Edit User
              </button>
              <button
                onClick={() => router.push("/admin/users")}
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
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
