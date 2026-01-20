"use client";

import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const BuyerProfile = ({ buyerData, onSave, saving, isEditing }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [editMode, setEditMode] = useState(Boolean(isEditing));

  // location
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const all = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
    setCountries(all);
  }, []);

  useEffect(() => {
    if (buyerData) {
      const newFormData = {
        full_name: buyerData.full_name || "",
        company_name: buyerData.company_name || "",
        country: buyerData.country || "",
        state: buyerData.state || "",
        city: buyerData.city || "",
        address: buyerData.address || "",
      };
      setFormData(newFormData);

      if (newFormData.country) {
        const countryObj = Country.getAllCountries().find(
          (c) => c.name === newFormData.country
        );
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          loadStates(countryObj.isoCode);
        }
      }
      if (newFormData.state) setSelectedState(newFormData.state);
      if (newFormData.city) setSelectedCity(newFormData.city);
    }
    setEditMode(Boolean(isEditing));
  }, [buyerData, isEditing]);

  const loadStates = (countryCode) => {
    const countryStates = State.getStatesOfCountry(countryCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
    setStates(countryStates);
    setCities([]);
    setSelectedState("");
    setSelectedCity("");
  };

  const loadCities = (countryCode, stateCode) => {
    const stateCities = City.getCitiesOfState(countryCode, stateCode).map(
      (c) => ({ value: c.name, label: c.name })
    );
    setCities(stateCities);
    setSelectedCity("");
  };

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const name = countries.find((c) => c.value === code)?.label || "";
    setSelectedCountry(code);
    setFormData((p) => ({ ...p, country: name, state: "", city: "" }));
    if (code) loadStates(code);
    else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (e) => {
    const code = e.target.value;
    const name = states.find((s) => s.value === code)?.label || "";
    setSelectedState(code);
    setFormData((p) => ({ ...p, state: name, city: "" }));
    if (code && selectedCountry) loadCities(selectedCountry, code);
    else setCities([]);
  };

  const handleCityChange = (e) => {
    const name = e.target.value;
    setSelectedCity(name);
    setFormData((p) => ({ ...p, city: name }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await onSave(formData);
    if (res.success) {
      setShowSuccess(true);
      setEditMode(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert(res.error || "Failed to save");
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (buyerData) {
      const newFormData = {
        full_name: buyerData.full_name || "",
        company_name: buyerData.company_name || "",
        country: buyerData.country || "",
        state: buyerData.state || "",
        city: buyerData.city || "",
        address: buyerData.address || "",
      };
      setFormData(newFormData);
      if (newFormData.country) {
        const countryObj = Country.getAllCountries().find(
          (c) => c.name === newFormData.country
        );
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          loadStates(countryObj.isoCode);
        }
      }
      if (newFormData.state) setSelectedState(newFormData.state);
      if (newFormData.city) setSelectedCity(newFormData.city);
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
            Business information saved successfully!
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <h3
          className="text-lg font-medium"
          style={{ color: "var(--color-accent-900)" }}
        >
          Business Information
        </h3>
        {!editMode && buyerData && (
          <button
            onClick={handleEdit}
            className="px-3 py-1 rounded-md text-sm"
            style={{
              border: "1px solid var(--color-accent-100)",
              color: "var(--color-accent-700)",
            }}
          >
            Edit Information
          </button>
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
                Full Name
              </span>
              <input
                name="full_name"
                value={formData.full_name}
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
                Company Name
              </span>
              <input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>
          </div>

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
              Address
            </span>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="px-3 py-2 rounded-md border"
              style={{ borderColor: "var(--color-accent-100)" }}
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
              {saving ? "Saving..." : "Save Business Information"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500">Full Name</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.full_name || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Company Name</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.company_name || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Location</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {(formData.city ? `${formData.city}, ` : "") +
                (formData.state ? `${formData.state}, ` : "") +
                (formData.country || "") || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
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
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;
