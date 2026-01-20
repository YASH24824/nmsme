"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllListings, updateListingStatus } from "../../api/adminApi";
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

export default function Products() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getAllListings({});
      console.log("API Response:", response);

      // Handle different possible response structures
      let listingsData = [];

      if (Array.isArray(response.data)) {
        listingsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        listingsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.listings)) {
        listingsData = response.data.listings;
      } else if (Array.isArray(response)) {
        listingsData = response;
      }

      console.log("Processed listings data:", listingsData);
      setListings(listingsData);
      calculateStats(listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update local state immediately (optimistic update)
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.listing_id === id
            ? { ...listing, status: newStatus }
            : listing
        )
      );

      // Also update stats immediately
      setStats((prevStats) => {
        const newStats = { ...prevStats };

        // Decrement old status count
        const oldListing = listings.find((l) => l.listing_id === id);
        if (oldListing) {
          if (oldListing.status === "active") newStats.active--;
          if (oldListing.status === "inactive") newStats.inactive--;
          if (oldListing.status === "pending") newStats.pending--;
        }

        // Increment new status count
        if (newStatus === "active") newStats.active++;
        if (newStatus === "inactive") newStats.inactive++;
        if (newStatus === "pending") newStats.pending++;

        return newStats;
      });

      const res = await updateListingStatus(id, { status: newStatus });

      // Since API returns 200, just show success
      toast.success("Status updated");

      // NO fetchListings() here - we already updated locally
    } catch (error) {
      console.error(error);
      // Optional: Revert local state on error
      // You can re-fetch here if you want to be safe
      fetchListings();
    }
  };

  const calculateStats = (data) => {
    const listingsArray = Array.isArray(data) ? data : [];

    const total = listingsArray.length;
    const active = listingsArray.filter(
      (item) => item.status === "active"
    ).length;
    const inactive = listingsArray.filter(
      (item) => item.status === "inactive"
    ).length;
    const pending = listingsArray.filter(
      (item) => item.status === "pending"
    ).length;

    setStats({ total, active, inactive, pending });
  };

  const filteredListings = listings.filter((listing) => {
    if (!listing) return false;

    const matchesSearch =
      (listing.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (listing.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (listing.seller?.business_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      listing.category?.category_name === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const viewDetails = (listingId) => {
    router.push(`/admin/products/${listingId}`);
  };

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
      pending: {
        color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        label: "Pending",
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Safely get categories
  const categories = Array.from(
    new Set(
      listings.map((listing) => listing.category?.category_name).filter(Boolean)
    )
  );

  // Show loading screen when loading
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all buyer and seller listings
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                All listings on platform
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">
                Currently active listings
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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.inactive}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Currently inactive listings
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
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
                placeholder="Search by title, description, or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Products List ({filteredListings.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.map((listing) => (
                <tr
                  key={listing.listing_id}
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {listing.title || "No Title"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {listing.seller?.business_name || "Unknown Seller"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.seller?.verification_status || "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {listing.category?.category_name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={listing.status}
                      onChange={(e) =>
                        handleStatusChange(listing.listing_id, e.target.value)
                      }
                      className={`px-5 py-1 rounded-md text-sm focus:outline-none
                        ${
                          listing.status === "active"
                            ? "bg-green-50 text-green-800"
                            : listing.status === "inactive"
                            ? "bg-gray-50 text-gray-800"
                            : listing.status === "draft"
                            ? "bg-red-50 text-red-800"
                            : "bg-yellow-50 text-yellow-800"
                        }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {listing.created_at
                      ? formatDate(listing.created_at)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => viewDetails(listing.listing_id)}
                      className="text-purple-600 hover:text-purple-900 font-medium transition-colors duration-200"
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
        {filteredListings.length === 0 && !loading && (
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {listings.length === 0
                ? "No listings available"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
