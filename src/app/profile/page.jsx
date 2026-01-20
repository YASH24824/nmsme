"use client";

import React, { useState, useEffect } from "react";
import UserBasicInfo from "../components/Profile/UserBasicInfo";
import BuyerProfile from "../components/Profile/BuyerProfile";
import SellerProfile from "../components/Profile/SellerProfile";
import {
  createBuyerProfile,
  createSellerProfile,
  updateBuyerProfile,
  updateSellerProfile,
  getBuyerProfile,
  getSellerProfile,
  getUserProfile,
  updateUserProfile,
} from "../api/profileAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setRoleData,
  setUserData,
} from "../lib/redux/slices/profileSlice";

/**
 * ProfilePage — Soft Panel (Notion-style)
 * - Uses CSS variables (provided by your global CSS) for theme colors
 * - Clean, two-section layout: Header (title + progress) + Tabs + Content panel
 * - Minimal visual chrome, rounded panels, subtle spacing
 */

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userData, roleData, loading } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [roleProfileExists, setRoleProfileExists] = useState(false);

  useEffect(() => {
    // initialize on mount
    const initializeProfile = async () => {
      // If no user data or no roleData in store, load fresh
      if (!userData || (userData && !roleData)) {
        await loadProfileData();
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfileData = async () => {
    try {
      dispatch(setLoading(true));
      const userResponse = await getUserProfile();
      const userProfile = userResponse.data.data;
      dispatch(setUserData(userProfile));
      setRoleProfileExists(Boolean(userProfile.role_profile_exists));

      // Load role-specific data
      if (userProfile.role === "buyer") {
        try {
          const buyerResponse = await getBuyerProfile();
          dispatch(setRoleData(buyerResponse.data));
          setRoleProfileExists(true);
        } catch (error) {
          if (error.response?.status === 404) {
            dispatch(setRoleData(null));
            setRoleProfileExists(false);
          } else {
            console.error("Error loading buyer profile:", error);
          }
        }
      } else if (userProfile.role === "seller") {
        try {
          const sellerResponse = await getSellerProfile();
          dispatch(setRoleData(sellerResponse.data));
          setRoleProfileExists(true);
        } catch (error) {
          if (error.response?.status === 404) {
            dispatch(setRoleData(null));
            setRoleProfileExists(false);
          } else {
            console.error("Error loading seller profile:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUserInfoSave = async (formData) => {
    try {
      setSaving(true);

      // Build FormData for file (avatar) + other fields
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        if (key !== "avatar" && val !== undefined && val !== null) {
          // Convert arrays/objects to JSON if needed
          if (typeof val === "object" && !(val instanceof File)) {
            submitData.append(key, JSON.stringify(val));
          } else {
            submitData.append(key, val);
          }
        }
      });

      if (formData.avatar instanceof File) {
        submitData.append("avatar", formData.avatar);
      }

      const response = await updateUserProfile(submitData);
      dispatch(setUserData(response.data.data));
      return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      };
    } finally {
      setSaving(false);
    }
  };

  const handleRoleInfoSave = async (roleFormData) => {
    try {
      setSaving(true);
      let response;

      // Ensure current userData exists and has role
      const role = userData?.role;
      if (!role) {
        return { success: false, error: "User role is not defined." };
      }

      if (role === "buyer") {
        if (roleProfileExists) {
          response = await updateBuyerProfile(roleFormData);
        } else {
          response = await createBuyerProfile(roleFormData);
          setRoleProfileExists(true);
        }
      } else if (role === "seller") {
        if (roleProfileExists) {
          response = await updateSellerProfile(roleFormData);
        } else {
          response = await createSellerProfile(roleFormData);
          setRoleProfileExists(true);
        }
      } else {
        return { success: false, error: "Unknown role." };
      }

      dispatch(setRoleData(response.data));
      return {
        success: true,
        message: "Business information saved successfully!",
      };
    } catch (error) {
      console.error("Error updating role profile:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to save business information",
      };
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[32rem] flex items-center justify-center">
        <div className="text-lg font-medium">Loading profile...</div>
      </div>
    );
  }

  // progress completion
  const completion = userData?.profile_completion || { total: 0 };
  const progressPct = Math.max(0, Math.min(100, completion.total || 0));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold"
              style={{ color: "var(--color-accent-900)" }}
            >
              Complete Your Profile
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-accent-700)" }}
            >
              A few quick steps to get your profile ready.
            </p>
          </div>

          {/* Progress + Percent */}
          <div className="flex items-center gap-4">
            <div className="w-56 h-3 bg-[color:var(--color-accent-50)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-350"
                style={{
                  width: `${progressPct}%`,
                  background:
                    "linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600))",
                }}
              />
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--color-accent-700)" }}
            >
              {progressPct}% Complete
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="mb-6">
        <div className="inline-flex rounded-lg bg-[color:var(--color-accent-50)] p-1 gap-1">
          <TabButton
            active={activeTab === "basic"}
            label="Basic Information"
            onClick={() => setActiveTab("basic")}
          />
          <TabButton
            active={activeTab === "role"}
            label={
              userData?.role === "buyer"
                ? "Business Information"
                : "Business Information"
            }
            onClick={() => setActiveTab("role")}
          />
        </div>
      </nav>

      {/* Content Panel */}
      <main className="bg-[color:var(--color-primary)] rounded-2xl border border-[color:var(--color-accent-50)] p-6">
        {activeTab === "basic" && (
          <UserBasicInfo
            userData={userData}
            onSave={handleUserInfoSave}
            saving={saving}
          />
        )}

        {activeTab === "role" && userData?.role === "buyer" && (
          <BuyerProfile
            buyerData={roleData}
            onSave={handleRoleInfoSave}
            saving={saving}
            isEditing={!roleProfileExists}
          />
        )}

        {activeTab === "role" && userData?.role === "seller" && (
          <SellerProfile
            sellerData={roleData}
            onSave={handleRoleInfoSave}
            saving={saving}
            isEditing={!roleProfileExists}
          />
        )}

        {/* Fallback if role is unknown */}
        {activeTab === "role" && !userData?.role && (
          <div
            className="py-6 text-sm"
            style={{ color: "var(--color-accent-700)" }}
          >
            Your account role is not set. Please contact support if this is
            unexpected.
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;

/* ---------- Helper TabButton component ---------- */
/* Small internal component to keep styles consistent */
function TabButton({ active, label, onClick }) {
  const baseClass =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none";
  if (active) {
    return (
      <button
        onClick={onClick}
        className={baseClass}
        style={{
          background:
            "linear-gradient(180deg, var(--color-accent-100), var(--color-accent-200))",
          color: "var(--color-accent-900)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02)",
        }}
        aria-current="true"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClass}
      style={{
        background: "transparent",
        color: "var(--color-accent-700)",
      }}
    >
      {label}
    </button>
  );
}
