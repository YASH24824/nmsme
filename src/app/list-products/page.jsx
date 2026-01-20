"use client";
// components/SellerDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  deleteListing,
  getUserListings,
  updateListingStatus,
} from "../api/productsAPI";
import ListingForm from "../components/Products/ListingForm";
import toast from "react-hot-toast";
import { useProfileCheck } from "../hooks/useProfileCheck";

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const {
    userData,
    loading: profileLoading,
    checkProfileCompletion,
  } = useProfileCheck();

  useEffect(() => {
    // Wait until profile loading is done
    if (profileLoading) return;

    // Don't repeatedly call loadListings
    if (!userData) return;

    // Only load once when userData is ready and seller
    if (userData.role === "seller") {
      const isAllowed = checkProfileCompletion("seller");
      if (isAllowed) {
        loadListings();
      } else {
        setLoading(false); // stop loading if profile incomplete
      }
    } else {
      setLoading(false);
    }
  }, [userData, profileLoading]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await getUserListings();
      setListings(response.data);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (listingId, newStatus) => {
    if (!checkProfileCompletion("seller")) return;

    try {
      await updateListingStatus(listingId, { status: newStatus });
      await loadListings();
      toast.success(
        `Service ${newStatus === "active" ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (listingId) => {
    if (!checkProfileCompletion("seller")) return;

    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(listingId);
        await loadListings();
        toast.success("Service deleted");
      } catch (error) {
        console.error("Error deleting listing:", error);
        toast.error("Failed to delete Service");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingListing(null);
    loadListings();
    toast.success(editingListing ? "Service updated" : "Service created");
  };

  const handleEdit = (listing) => {
    if (!checkProfileCompletion("seller")) return;
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    if (!checkProfileCompletion("seller")) return;
    setEditingListing(null);
    setShowForm(true);
  };

  if (profileLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div
          className="rounded-full h-12 w-12 border-b-2 animate-spin"
          style={{ borderColor: "var(--color-accent-500)" }}
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-yellow-700 mb-4">
              Please login to access your seller dashboard
            </p>
            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <ListingForm
        listing={editingListing}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingListing(null);
        }}
      />
    );
  }

  if (
    userData?.role === "seller" &&
    !userData.has_complete_profile &&
    userData.profile_completion?.total < 92
  ) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-4">
          Please complete your seller profile before accessing the dashboard.
        </p>
        <button
          className="bg-[var(--color-accent-700)] text-white px-6 py-2 rounded-lg hover:bg-[var(--color-accent-800)] transition"
          onClick={() => (window.location.href = "/profile")}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top header */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{
          background:
            "linear-gradient(90deg, rgba(58,54,160,0.95) 0%, rgba(122,133,193,0.95) 100%)",
          color: "#fff",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-[var(--color-accent-50)] mt-1 max-w-xl">
              Manage your service listings, update availability, and track
              performance — all in one place.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/8 px-4 py-2 rounded-lg text-sm text-white">
              Profile Completion
              <div className="text-2xl font-bold mt-1">
                {userData.profile_completion?.total}%
              </div>
            </div>

            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 bg-white text-[var(--color-accent-700)] px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              + Create New Listing
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Listings"
          value={listings.length}
          iconBg="bg-[var(--color-accent-50)]"
        />
        <StatCard
          title="Active Listings"
          value={listings.filter((l) => l.status === "active").length}
          iconBg="bg-[var(--color-accent-50)]"
        />
        <StatCard
          title="Drafts"
          value={listings.filter((l) => l.status === "draft").length}
          iconBg="bg-[var(--color-accent-50)]"
        />
        <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-[var(--color-accent-700)]">
              Quick Actions
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCreateNew}
                className="px-3 py-2 rounded-lg bg-[var(--color-accent-700)] text-white text-sm font-medium hover:bg-[var(--color-accent-800)] transition"
              >
                New Listing
              </button>
              <button
                onClick={loadListings}
                className="px-3 py-2 rounded-lg bg-white text-[var(--color-accent-700)] border border-[var(--color-accent-100)] text-sm font-medium hover:shadow-sm transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listings grid */}
      {listings.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-[var(--color-accent-50)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-accent-100)]">
              <svg
                className="w-12 h-12 text-[var(--color-accent-400)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-accent-900)] mb-2">
              No listings yet
            </h3>
            <p className="text-[var(--color-accent-700)] mb-6">
              Start by creating your first service listing to attract customers
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-[var(--color-accent-700)] text-white px-8 py-3 rounded-xl hover:bg-[var(--color-accent-800)] transition font-semibold"
            >
              Create Your First Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <div
              key={listing.listing_id}
              className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white border border-[var(--color-accent-100)]">
                      {listing.listing_media?.[0] ? (
                        <img
                          src={
                            (process.env.NEXT_PUBLIC_BACKEND_URL || "") +
                            listing.listing_media[0].file_path
                          }
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.target.src = "/placeholder-image.jpg")
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-accent-400)]">
                          <svg
                            className="w-8 h-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 3h8l1 4H7l1-4z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-[var(--color-accent-900)] truncate">
                        {listing.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[var(--color-accent-700)] mt-2 line-clamp-2">
                        {listing.description}
                      </p>

                      {/* Info Badges */}
                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        {/* Service Type */}
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "var(--color-accent-100)",
                            color: "var(--color-accent-700)",
                            border: "1px solid var(--color-accent-200)",
                          }}
                        >
                          {listing.service_type?.replace("_", " ")}
                        </span>

                        {/* Pricing Model */}
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "var(--color-accent-50)",
                            color: "var(--color-accent-700)",
                            border: "1px solid var(--color-accent-100)",
                          }}
                        >
                          {listing.pricing_model?.replace("_", " ")}
                        </span>

                        {/* Price Range */}
                        <span className="px-3 py-1 rounded-full text-xs font-medium text-[var(--color-accent-700)] bg-[var(--color-accent-50)] border border-[var(--color-accent-100)]">
                          ₹{Number(listing.min_price).toLocaleString()} - ₹
                          {Number(listing.max_price).toLocaleString()}
                        </span>
                      </div>

                      {/* Tags (separate row) */}
                      {listing.tags && listing.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {listing.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: "var(--color-accent-100)",
                                color: "var(--color-accent-800)",
                                border: "1px solid var(--color-accent-200)",
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column: details & actions */}
                <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
                  <div className="bg-white rounded-lg p-3 border border-[var(--color-accent-100)]">
                    <div className="text-xs text-[var(--color-accent-600)]">
                      Timeline
                    </div>
                    <div className="text-sm font-semibold text-[var(--color-accent-900)] mt-1">
                      {listing.estimated_timeline || "-"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white text-[var(--color-accent-700)] border border-[var(--color-accent-100)] font-medium hover:shadow-sm transition"
                    >
                      Edit
                    </button>

                    {listing.status === "active" ? (
                      <button
                        onClick={() =>
                          handleStatusUpdate(listing.listing_id, "inactive")
                        }
                        className="px-3 py-2 rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border border-[var(--color-accent-200)] font-medium hover:bg-[var(--color-accent-100)] transition"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatusUpdate(listing.listing_id, "active")
                        }
                        className="px-3 py-2 rounded-lg bg-[var(--color-accent-700)] text-white font-medium hover:bg-[var(--color-accent-800)] transition"
                      >
                        Activate
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(listing.listing_id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 font-medium hover:bg-red-100 transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = `/listings/${listing.listing_id}`)
                      }
                      className="px-3 py-2 rounded-lg bg-white text-[var(--color-accent-700)] border border-[var(--color-accent-100)] font-medium hover:shadow-sm transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

/* ------------------ Small helper components ------------------ */

function StatCard({ title, value, iconBg }) {
  return (
    <div className="bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-lg p-4 flex items-center gap-4">
      <div
        className={`p-3 rounded-lg ${iconBg}`}
        style={{ border: "1px solid var(--color-accent-100)" }}
      >
        <svg
          className="w-6 h-6 text-[var(--color-accent-500)]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 12h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className="text-sm text-[var(--color-accent-600)]">{title}</div>
        <div className="text-xl font-bold text-[var(--color-accent-900)]">
          {value}
        </div>
      </div>
    </div>
  );
}
