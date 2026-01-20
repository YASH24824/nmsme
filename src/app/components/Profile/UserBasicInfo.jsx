"use client";

import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const UserBasicInfo = ({ userData, onSave, saving }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    bio: "",
    country: "",
    state: "",
    address: "",
    pincode: "",
    city: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalPhone, setOriginalPhone] = useState("");

  // Location dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullname: userData.fullname || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        country: userData.country || "",
        state: userData.state || "",
        address: userData.address || "",
        pincode: userData.pincode || "",
        city: userData.city || "",
        avatar: null,
      });

      setOriginalPhone(userData.phone || "");

      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const avatarPath = userData.avatar_url
        ? `${backendURL}${userData.avatar_url}`
        : "/default-avatar.png";
      setAvatarPreview(avatarPath);

      if (userData.country) {
        const countryObj = Country.getAllCountries().find(
          (c) => c.name === userData.country
        );
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          loadStates(countryObj.isoCode);
        }
      }
      if (userData.state) setSelectedState(userData.state);
      if (userData.city) setSelectedCity(userData.city);
    } else {
      setAvatarPreview("/default-avatar.png");
    }
  }, [userData]);

  const loadStates = (countryCode) => {
    const countryStates = State.getStatesOfCountry(countryCode).map(
      (state) => ({
        value: state.isoCode,
        label: state.name,
      })
    );
    setStates(countryStates);
    setCities([]);
    setSelectedState("");
    setSelectedCity("");
  };

  const loadCities = (countryCode, stateCode) => {
    const stateCities = City.getCitiesOfState(countryCode, stateCode).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );
    setCities(stateCities);
    setSelectedCity("");
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const countryName =
      countries.find((c) => c.value === countryCode)?.label || "";

    setSelectedCountry(countryCode);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      state: "",
      city: "",
    }));

    if (countryCode) loadStates(countryCode);
    else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const stateName = states.find((s) => s.value === stateCode)?.label || "";

    setSelectedState(stateCode);
    setFormData((prev) => ({ ...prev, state: stateName, city: "" }));

    if (stateCode && selectedCountry) loadCities(selectedCountry, stateCode);
    else setCities([]);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setFormData((prev) => ({ ...prev, city: cityName }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && originalPhone) return; // can't edit phone once set
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, avatar: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (originalPhone && formData.phone !== originalPhone) {
      alert("Phone number cannot be updated once set.");
      return;
    }
    const res = await onSave(formData);
    if (res.success) {
      setShowSuccess(true);
      setEditMode(false);
      if (formData.phone && !originalPhone) setOriginalPhone(formData.phone);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert(res.error || "Failed to save");
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (userData) {
      setFormData({
        fullname: userData.fullname || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        country: userData.country || "",
        state: userData.state || "",
        address: userData.address || "",
        pincode: userData.pincode || "",
        city: userData.city || "",
        avatar: null,
      });
      if (userData.country) {
        const countryObj = Country.getAllCountries().find(
          (c) => c.name === userData.country
        );
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          loadStates(countryObj.isoCode);
        }
      }
      setSelectedState(userData.state || "");
      setSelectedCity(userData.city || "");
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div
          className="rounded-md p-3"
          style={{
            background: "var(--color-accent-50)",
            border: "1px solid var(--color-accent-100)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--color-accent-700)" }}>
            Profile updated successfully!
          </div>
        </div>
      )}

      {!userData?.fullname && !editMode && (
        <div
          className="rounded-md p-3"
          style={{
            background: "var(--color-accent-50)",
            border: "1px solid var(--color-accent-100)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--color-accent-700)" }}>
            Welcome! Please complete your personal information to get started.
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <h3
          className="text-lg font-medium"
          style={{ color: "var(--color-accent-900)" }}
        >
          Personal Information
        </h3>
        {!editMode && (
          <button
            onClick={handleEdit}
            className="px-3 py-1 rounded-md text-sm font-medium"
            style={{
              background: "transparent",
              border: "1px solid var(--color-accent-200)",
              color: "var(--color-accent-700)",
            }}
          >
            {userData?.fullname ? "Edit Information" : "Complete Profile"}
          </button>
        )}
      </div>

      {/* Avatar & preview */}
      <div className="flex items-center gap-6">
        <div>
          <img
            src={avatarPreview || "/default-avatar.png"}
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>

        {editMode ? (
          <div className="flex flex-col">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm"
            />
            <div
              className="text-xs mt-1"
              style={{ color: "var(--color-accent-700)" }}
            >
              PNG, JPG, JPEG up to 5MB
            </div>
          </div>
        ) : (
          <div className="text-sm" style={{ color: "var(--color-accent-700)" }}>
            {userData?.fullname || "No name provided"}
          </div>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Full name
              </span>
              <input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>

            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Phone{" "}
                {originalPhone ? (
                  <small
                    className="text-xs"
                    style={{ color: "var(--color-accent-700)" }}
                  >
                    (cannot be changed)
                  </small>
                ) : null}
              </span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                required
                className="px-3 py-2 rounded-md border"
                style={{
                  borderColor: "var(--color-accent-100)",
                  background: originalPhone ? "#f6f7fb" : undefined,
                }}
              />
            </label>

            <label className="flex flex-col md:col-span-1">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Pincode
              </span>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>

            <label className="flex flex-col md:col-span-1">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Address
              </span>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>
          </div>

          {/* Location selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Country
              </span>
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                State
              </span>
              <select
                value={selectedState}
                onChange={handleStateChange}
                disabled={!selectedCountry}
                className="px-3 py-2 rounded-md border"
                style={{
                  borderColor: "var(--color-accent-100)",
                  background: !selectedCountry ? "#fbfbfd" : undefined,
                }}
              >
                <option value="">Select state</option>
                {states.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                City
              </span>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedState}
                className="px-3 py-2 rounded-md border"
                style={{
                  borderColor: "var(--color-accent-100)",
                  background: !selectedState ? "#fbfbfd" : undefined,
                }}
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col">
            <span
              className="text-sm mb-1"
              style={{ color: "var(--color-accent-900)" }}
            >
              Bio
            </span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="px-3 py-2 rounded-md border"
              style={{ borderColor: "var(--color-accent-100)" }}
              placeholder="Tell us a little about yourself..."
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-md text-sm"
              style={{
                border: "1px solid var(--color-accent-100)",
                color: "var(--color-accent-700)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-md text-sm font-medium"
              style={{
                background: "var(--color-accent-800)",
                color: "white",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Full name</div>
              <div
                className="mt-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                {formData.fullname || (
                  <i style={{ color: "var(--color-accent-700)" }}>
                    Not provided
                  </i>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Phone</div>
              <div
                className="mt-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                {formData.phone || (
                  <i style={{ color: "var(--color-accent-700)" }}>
                    Not provided
                  </i>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div
                className="mt-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                {(formData.city ? `${formData.city}, ` : "") +
                  (formData.state ? `${formData.state}, ` : "") +
                  (formData.country || "") || (
                  <i style={{ color: "var(--color-accent-700)" }}>Not set</i>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Pincode</div>
              <div
                className="mt-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                {formData.pincode || (
                  <i style={{ color: "var(--color-accent-700)" }}>
                    Not provided
                  </i>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Address</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.address || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Bio</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.bio || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBasicInfo;
