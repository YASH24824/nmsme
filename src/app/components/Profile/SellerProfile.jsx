"use client";

import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const SellerProfile = ({
  sellerData,
  onSave,
  saving,
  isEditing,
  isCreating = false,
}) => {
  const [formData, setFormData] = useState({
    business_name: "",
    business_description: "",
    product_categories: "",
    certifications: "",
    years_in_business: "",
    business_country: "",
    business_state: "",
    business_city: "",
    business_address: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [editMode, setEditMode] = useState(Boolean(isEditing));
  const [addressFieldsLocked, setAddressFieldsLocked] = useState(false);

  // location
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const allCountries = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (sellerData) {
      const data = sellerData.data || sellerData;
      const businessAddress = data.business_addresses?.[0] || {};

      const newFormData = {
        business_name: data.business_name || "",
        business_description: data.business_description || "",
        product_categories: data.product_categories || "",
        certifications: data.certifications || "",
        years_in_business: data.years_in_business || 0,
        business_country: businessAddress.business_country || "",
        business_state: businessAddress.business_state || "",
        business_city: businessAddress.business_city || "",
        business_address: businessAddress.business_address || "",
      };

      setFormData(newFormData);

      const hasAddressValues =
        newFormData.business_country ||
        newFormData.business_state ||
        newFormData.business_city ||
        newFormData.business_address;
      setAddressFieldsLocked(Boolean(hasAddressValues));

      if (newFormData.business_country) {
        const countryObj = Country.getAllCountries().find(
          (c) => c.name === newFormData.business_country
        );
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          loadStates(countryObj.isoCode);
        }
      }
      if (newFormData.business_state)
        setSelectedState(newFormData.business_state);
      if (newFormData.business_city) setSelectedCity(newFormData.business_city);
    }
    setEditMode(Boolean(isEditing));
  }, [sellerData, isEditing]);

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
    setFormData((p) => ({
      ...p,
      business_country: name,
      business_state: "",
      business_city: "",
    }));
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
    setFormData((p) => ({ ...p, business_state: name, business_city: "" }));
    if (code && selectedCountry) loadCities(selectedCountry, code);
    else setCities([]);
  };

  const handleCityChange = (e) => {
    const name = e.target.value;
    setSelectedCity(name);
    setFormData((p) => ({ ...p, business_city: name }));
  };

  const isAddressField = (k) =>
    [
      "business_country",
      "business_state",
      "business_city",
      "business_address",
    ].includes(k);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (addressFieldsLocked && isAddressField(name) && !isCreating) return;
    setFormData((p) => ({
      ...p,
      [name]:
        name === "years_in_business"
          ? value
            ? parseInt(value, 10)
            : 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload;
    if (isCreating) {
      payload = {
        business_name: formData.business_name,
        business_description: formData.business_description,
        product_categories: formData.product_categories,
        certifications: formData.certifications,
        years_in_business: formData.years_in_business,
        business_address: {
          business_country: formData.business_country,
          business_state: formData.business_state,
          business_city: formData.business_city,
          business_address: formData.business_address,
          is_primary: true,
        },
      };
    } else {
      payload = {
        business_name: formData.business_name,
        business_description: formData.business_description,
        product_categories: formData.product_categories,
        certifications: formData.certifications,
        years_in_business: formData.years_in_business,
      };
      if (!addressFieldsLocked) {
        payload.business_address = {
          business_country: formData.business_country,
          business_state: formData.business_state,
          business_city: formData.business_city,
          business_address: formData.business_address,
          is_primary: true,
        };
      }
    }

    const result = await onSave(payload);
    if (result.success) {
      setShowSuccess(true);
      setEditMode(false);
      if (
        !addressFieldsLocked &&
        (formData.business_country ||
          formData.business_state ||
          formData.business_city ||
          formData.business_address)
      ) {
        setAddressFieldsLocked(true);
      }
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save");
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (sellerData) {
      const data = sellerData.data || sellerData;
      const businessAddress = data.business_addresses?.[0] || {};
      const newFormData = {
        business_name: data.business_name || "",
        business_description: data.business_description || "",
        product_categories: data.product_categories || "",
        certifications: data.certifications || "",
        years_in_business: data.years_in_business || 0,
        business_country: businessAddress.business_country || "",
        business_state: businessAddress.business_state || "",
        business_city: businessAddress.business_city || "",
        business_address: businessAddress.business_address || "",
      };
      setFormData(newFormData);
      if (newFormData.business_country) {
        const countryObj = Country.getAllCountries().find(
          (c) => c.name === newFormData.business_country
        );
        if (countryObj) {
          setSelectedCountry(countryObj.isoCode);
          loadStates(countryObj.isoCode);
        }
      }
      if (newFormData.business_state)
        setSelectedState(newFormData.business_state);
      if (newFormData.business_city) setSelectedCity(newFormData.business_city);
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
        {!editMode && sellerData && !isCreating && (
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

      {editMode || isCreating ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Business Name
              </span>
              <input
                name="business_name"
                value={formData.business_name}
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
                Product Categories
              </span>
              <input
                name="product_categories"
                value={formData.product_categories}
                onChange={handleChange}
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>

            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Certifications
              </span>
              <input
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>

            <label className="flex flex-col">
              <span
                className="text-sm mb-1"
                style={{ color: "var(--color-accent-900)" }}
              >
                Years in Business
              </span>
              <input
                type="number"
                name="years_in_business"
                value={formData.years_in_business}
                onChange={handleChange}
                min={0}
                className="px-3 py-2 rounded-md border"
                style={{ borderColor: "var(--color-accent-100)" }}
              />
            </label>
          </div>

          <label className="flex flex-col">
            <span
              className="text-sm mb-1"
              style={{ color: "var(--color-accent-900)" }}
            >
              Business Description
            </span>
            <textarea
              name="business_description"
              value={formData.business_description}
              onChange={handleChange}
              rows={3}
              className="px-3 py-2 rounded-md border"
              style={{ borderColor: "var(--color-accent-100)" }}
            />
          </label>

          {/* Address - editable only if not locked or when creating */}
          {!addressFieldsLocked || isCreating ? (
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

              <label className="flex flex-col md:col-span-3">
                <span
                  className="text-sm mb-1"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  Business Address
                </span>
                <textarea
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleChange}
                  rows={2}
                  required={isCreating}
                  className="px-3 py-2 rounded-md border"
                  style={{ borderColor: "var(--color-accent-100)" }}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500">Business Country</div>
                <div
                  className="mt-1"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  {formData.business_country || (
                    <i style={{ color: "var(--color-accent-700)" }}>
                      Not provided
                    </i>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Business State</div>
                <div
                  className="mt-1"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  {formData.business_state || (
                    <i style={{ color: "var(--color-accent-700)" }}>
                      Not provided
                    </i>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Business City</div>
                <div
                  className="mt-1"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  {formData.business_city || (
                    <i style={{ color: "var(--color-accent-700)" }}>
                      Not provided
                    </i>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Business Address</div>
                <div
                  className="mt-1"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  {formData.business_address || (
                    <i style={{ color: "var(--color-accent-700)" }}>
                      Not provided
                    </i>
                  )}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  Address fields cannot be modified once set
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            {!isCreating && (
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
            )}
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
              {saving
                ? "Saving..."
                : isCreating
                ? "Create Business Profile"
                : "Save Business Information"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500">Business Name</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.business_name || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Product Categories</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.product_categories || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Years in Business</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.years_in_business || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Business Description</div>
            <div className="mt-1" style={{ color: "var(--color-accent-900)" }}>
              {formData.business_description || (
                <i style={{ color: "var(--color-accent-700)" }}>Not provided</i>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
