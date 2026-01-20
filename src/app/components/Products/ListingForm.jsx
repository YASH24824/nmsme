"use client";
// components/ListingForm.jsx
import React, { useState, useEffect } from "react";
import {
  createListing,
  updateListing,
  addListingMedia,
  updateListingStatus,
  getCategories,
  getSubcategories,
} from "../../api/productsAPI";
import toast from "react-hot-toast";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import {
  FileText,
  DollarSign,
  MapPin,
  Tag,
  Image,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const ListingForm = ({ listing = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    service_type: "project_based",
    pricing_model: "custom_quote",
    min_price: "",
    max_price: "",
    estimated_timeline: "",
    service_areas: [],
    service_locations: [], // Array of location objects
    tags: [],
    category_id: "",
    subcategory_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Service Areas State
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentServiceArea, setCurrentServiceArea] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  // Convert library data to react-select format
  const countries = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((s) => ({
        value: s.isoCode,
        label: s.name,
      }))
    : [];

  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
          (c) => ({
            value: c.name,
            label: c.name,
          })
        )
      : [];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const cate = res.data?.categories || res.data || [];
        setCategories(Array.isArray(cate) ? cate : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.category_id) {
        setSubcategories([]);
        return;
      }

      try {
        const selectedCategory = categories.find(
          (cat) => cat.id === parseInt(formData.category_id)
        );

        if (selectedCategory) {
          const res = await getSubcategories(selectedCategory.id);
          // Small bug fix: check the shape properly
          const data = Array.isArray(res.data)
            ? res.data
            : res.data?.subcategories;
          setSubcategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [formData.category_id, categories]);

  // Prefill form when editing
  useEffect(() => {
    if (listing) {
      const serviceLocations = [];
      if (
        listing.service_countries &&
        listing.service_states &&
        listing.service_cities
      ) {
        const maxLength = Math.max(
          listing.service_countries.length,
          listing.service_states.length,
          listing.service_cities.length
        );

        for (let i = 0; i < maxLength; i++) {
          serviceLocations.push({
            country: listing.service_countries[i] || "",
            state: listing.service_states[i] || "",
            city: listing.service_cities[i] || "",
            id: i,
          });
        }
      }

      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        service_type: listing.service_type || "project_based",
        pricing_model: listing.pricing_model || "custom_quote",
        min_price: listing.min_price || "",
        max_price: listing.max_price || "",
        estimated_timeline: listing.estimated_timeline || "",
        service_areas: listing.service_areas || [],
        service_locations: serviceLocations,
        tags: listing.tags || [],
        category_id: listing.category_id || "",
        subcategory_id: listing.subcategory_id || "",
      });
    }
  }, [listing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Service Areas Functions - Row-based approach
  const handleAddLocation = () => {
    if (!selectedCountry || !selectedState || !selectedCity) {
      toast.error("Please select country, state, and city!");
      return;
    }

    const isDuplicate = formData.service_locations.some(
      (location) =>
        location.country === selectedCountry.label &&
        location.state === selectedState.label &&
        location.city === selectedCity.label
    );

    if (isDuplicate) {
      toast.error("This location has already been added!");
      return;
    }

    const newLocation = {
      id: Date.now(),
      country: selectedCountry.label,
      state: selectedState.label,
      city: selectedCity.label,
    };

    setFormData((prev) => ({
      ...prev,
      service_locations: [...prev.service_locations, newLocation],
    }));

    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    toast.success("Location added");
  };

  const handleRemoveLocation = (locationId) => {
    setFormData((prev) => ({
      ...prev,
      service_locations: prev.service_locations.filter(
        (location) => location.id !== locationId
      ),
    }));
  };

  const handleClearAllLocations = () => {
    setFormData((prev) => ({
      ...prev,
      service_locations: [],
    }));
  };

  // Convert service_locations to separate arrays for API payload
  const getServiceArrays = () => {
    const countriesArr = [];
    const statesArr = [];
    const citiesArr = [];

    formData.service_locations.forEach((location) => {
      countriesArr.push(location.country);
      statesArr.push(location.state);
      citiesArr.push(location.city);
    });

    return { countries: countriesArr, states: statesArr, cities: citiesArr };
  };

  const handleServiceAreaAdd = () => {
    if (
      currentServiceArea &&
      !formData.service_areas.includes(currentServiceArea)
    ) {
      setFormData((prev) => ({
        ...prev,
        service_areas: [...prev.service_areas, currentServiceArea],
      }));
      setCurrentServiceArea("");
      toast.success("Service area added");
    }
  };

  const handleServiceAreaRemove = (area) => {
    setFormData((prev) => ({
      ...prev,
      service_areas: prev.service_areas.filter((a) => a !== area),
    }));
  };

  const handleTagAdd = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag("");
      toast.success("Tag added");
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + mediaFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setMediaFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} image(s) added`);
  };

  const removeMediaFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (listingId) => {
    if (mediaFiles.length === 0 && !listing) {
      throw new Error("At least one image is required for new listings");
    }

    if (!listingId) {
      throw new Error("No listing ID provided for media upload");
    }

    try {
      const fd = new FormData();
      mediaFiles.forEach((file) => {
        fd.append("media", file);
      });
      fd.append("sort_order", "0");
      fd.append("file_type", "image");

      const response = await addListingMedia(listingId, fd);
      return response;
    } catch (error) {
      throw new Error(
        `Failed to upload images: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let listingId;

      const { countries, states, cities } = getServiceArrays();

      const payload = {
        ...formData,
        min_price: parseFloat(formData.min_price),
        max_price: parseFloat(formData.max_price),
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id
          ? parseInt(formData.subcategory_id)
          : null,
        service_countries: countries,
        service_states: states,
        service_cities: cities,
      };

      delete payload.service_locations;

      if (listing) {
        await updateListing(listing.listing_id, payload);
        listingId = listing.listing_id;
        toast.success("Service updated successfully");
      } else {
        const response = await createListing(payload);
        listingId = response.data.listing?.listing_id;

        if (!listingId) {
          throw new Error(
            "Failed to create listing - no ID returned from server"
          );
        }
        toast.success("Service created");
      }

      if (mediaFiles.length > 0) {
        await uploadMedia(listingId);
        toast.success("Images uploaded");
      }

      await updateListingStatus(listingId, { status: "active" });
      onSuccess?.(listingId);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save listing";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", name: "Basic Info", icon: FileText },
    { id: "pricing", name: "Pricing & Timeline", icon: DollarSign },
    { id: "details", name: "Service Areas", icon: MapPin },
    { id: "tags", name: "Tags & Media", icon: Tag },
  ];

  return (
    <div
      className="max-w-4xl mx-auto p-6"
      style={{ background: "var(--color-primary)" }}
    >
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 shadow-sm border"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent-700), var(--color-accent-900))",
          borderColor: "var(--color-accent-300)",
        }}
      >
        <div className="flex items-center gap-3 ">
          <FileText className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-sans text-white">
            {listing ? "Edit Listing" : "Create New Listing"}
          </h1>
        </div>
        <p
          className="text-sm ml-11"
          style={{ color: "var(--color-accent-100)" }}
        >
          {listing
            ? "Update your service listing details to keep them fresh and attractive."
            : "Fill in the details of your service offering to start attracting clients."}
        </p>
      </div>

      {/* Progress Tabs */}
      <div
        className="flex space-x-1 mb-8 rounded-2xl p-2"
        style={{
          background: "var(--color-accent-50)",
          border: "1px solid var(--color-accent-100)",
        }}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                activeTab === tab.id
                  ? "shadow-sm"
                  : "hover:shadow-none hover:opacity-90"
              }`}
              style={
                activeTab === tab.id
                  ? {
                      background: "var(--color-primary)",
                      color: "var(--color-accent-900)",
                      border: "1px solid var(--color-accent-200)",
                    }
                  : {
                      background: "transparent",
                      color: "var(--color-accent-700)",
                      border: "1px solid transparent",
                    }
              }
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div
              className="rounded-2xl p-6 shadow-sm border"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-accent-100)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText
                  className="w-5 h-5"
                  style={{ color: "var(--color-accent-700)" }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  Basic Information
                </h3>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      border: "1px solid var(--color-accent-200)",
                      background: "var(--color-primary)",
                      color: "var(--color-accent-900)",
                    }}
                    placeholder="Enter a compelling title for your service"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
                    style={{
                      border: "1px solid var(--color-accent-200)",
                      background: "var(--color-primary)",
                      color: "var(--color-accent-900)",
                    }}
                    placeholder="Describe your service in detail..."
                  />
                </div>

                {/* Service Type + Category + Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Type */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      Service Type *
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        border: "1px solid var(--color-accent-200)",
                        background: "var(--color-primary)",
                        color: "var(--color-accent-900)",
                      }}
                    >
                      <option value="one_time">One Time Service</option>
                      <option value="ongoing">Ongoing Service</option>
                      <option value="consultation">Consultation</option>
                      <option value="project_based">Project Based</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      Category *
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        border: "1px solid var(--color-accent-200)",
                        background: "var(--color-primary)",
                        color: "var(--color-accent-900)",
                      }}
                    >
                      <option value="">Select a Category</option>
                      {Array.isArray(categories) &&
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      Subcategory *
                    </label>
                    <select
                      name="subcategory_id"
                      value={formData.subcategory_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        border: "1px solid var(--color-accent-200)",
                        background: "var(--color-primary)",
                        color: "var(--color-accent-900)",
                      }}
                    >
                      <option value="">Select a Subcategory</option>
                      {Array.isArray(subcategories) &&
                        subcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Timeline Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div
              className="rounded-2xl p-6 shadow-sm border"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-accent-100)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <DollarSign
                  className="w-5 h-5"
                  style={{ color: "var(--color-accent-700)" }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  Pricing & Timeline
                </h3>
              </div>

              <div className="space-y-6">
                {/* Pricing Model */}
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Pricing Model *
                  </label>
                  <select
                    name="pricing_model"
                    value={formData.pricing_model}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      border: "1px solid var(--color-accent-200)",
                      background: "var(--color-primary)",
                      color: "var(--color-accent-900)",
                    }}
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="daily">Daily Rate</option>
                    <option value="custom_quote">Custom Quote</option>
                  </select>
                </div>

                {/* Min / Max Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      Minimum Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="min_price"
                      value={formData.min_price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        border: "1px solid var(--color-accent-200)",
                        background: "var(--color-primary)",
                        color: "var(--color-accent-900)",
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      Maximum Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="max_price"
                      value={formData.max_price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        border: "1px solid var(--color-accent-200)",
                        background: "var(--color-primary)",
                        color: "var(--color-accent-900)",
                      }}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Estimated Timeline
                  </label>
                  <input
                    type="text"
                    name="estimated_timeline"
                    value={formData.estimated_timeline}
                    onChange={handleInputChange}
                    placeholder="e.g., 2-4 weeks, 3-5 days"
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{
                      border: "1px solid var(--color-accent-200)",
                      background: "var(--color-primary)",
                      color: "var(--color-accent-900)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Areas Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div
              className="rounded-2xl p-6 shadow-sm border"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-accent-100)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin
                  className="w-5 h-5"
                  style={{ color: "var(--color-accent-700)" }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  Service Areas
                </h3>
              </div>

              <div className="space-y-6">
                {/* Location Selectors */}
                <div>
                  <label
                    className="block text-sm font-medium mb-4"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Add Service Location
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={(val) => {
                        setSelectedCountry(val);
                        setSelectedState(null);
                        setSelectedCity(null);
                      }}
                      placeholder="Select Country"
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />

                    <Select
                      options={states}
                      value={selectedState}
                      onChange={(val) => {
                        setSelectedState(val);
                        setSelectedCity(null);
                      }}
                      placeholder="Select State"
                      isSearchable
                      isDisabled={!selectedCountry}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />

                    <Select
                      options={cities}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Select City"
                      isSearchable
                      isDisabled={!selectedState}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLocation}
                    disabled={
                      !selectedCountry || !selectedState || !selectedCity
                    }
                    className="w-full px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--color-accent-700)",
                      color: "#fff",
                      opacity:
                        !selectedCountry || !selectedState || !selectedCity
                          ? 0.6
                          : 1,
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Location to Service Areas
                  </button>
                </div>

                {/* Service Locations Display */}
                {formData.service_locations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4
                        className="text-md font-semibold"
                        style={{ color: "var(--color-accent-900)" }}
                      >
                        Added Service Locations (
                        {formData.service_locations.length})
                      </h4>
                      <button
                        type="button"
                        onClick={handleClearAllLocations}
                        className="text-sm font-medium flex items-center gap-1"
                        style={{ color: "#b91c1c" }}
                      >
                        <X className="w-4 h-4" />
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {formData.service_locations.map((location) => (
                        <div
                          key={location.id}
                          className="flex items-center justify-between p-4 rounded-xl border"
                          style={{
                            background: "var(--color-accent-50)",
                            borderColor: "var(--color-accent-100)",
                          }}
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label className="text-xs font-medium uppercase tracking-wide mb-2 block">
                                <span
                                  style={{
                                    color: "var(--color-accent-600)",
                                  }}
                                >
                                  Country
                                </span>
                              </label>
                              <p
                                className="text-sm font-medium"
                                style={{
                                  color: "var(--color-accent-900)",
                                }}
                              >
                                {location.country}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs font-medium uppercase tracking-wide mb-2 block">
                                <span
                                  style={{
                                    color: "var(--color-accent-600)",
                                  }}
                                >
                                  State
                                </span>
                              </label>
                              <p
                                className="text-sm font-medium"
                                style={{
                                  color: "var(--color-accent-900)",
                                }}
                              >
                                {location.state}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs font-medium uppercase tracking-wide mb-2 block">
                                <span
                                  style={{
                                    color: "var(--color-accent-600)",
                                  }}
                                >
                                  City
                                </span>
                              </label>
                              <p
                                className="text-sm font-medium"
                                style={{
                                  color: "var(--color-accent-900)",
                                }}
                              >
                                {location.city}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(location.id)}
                            className="ml-4 p-2 rounded-lg transition-colors duration-200"
                            style={{
                              background: "rgba(248,113,113,0.15)",
                              color: "#b91c1c",
                            }}
                            title="Remove this location"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.service_locations.length === 0 && (
                  <div
                    className="text-center py-12 border-2 border-dashed rounded-2xl"
                    style={{
                      borderColor: "var(--color-accent-200)",
                      background: "var(--color-accent-50)",
                    }}
                  >
                    <MapPin
                      className="w-16 h-16 mx-auto mb-4"
                      style={{ color: "var(--color-accent-300)" }}
                    />
                    <p
                      className="mb-2 text-lg font-medium"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      No service locations added yet
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-accent-600)" }}
                    >
                      Add locations using the selectors above
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tags & Media Tab */}
        {activeTab === "tags" && (
          <div className="space-y-6">
            {/* Tags Section */}
            <div
              className="rounded-2xl p-6 shadow-sm border"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-accent-100)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Tag
                  className="w-5 h-5"
                  style={{ color: "var(--color-accent-700)" }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  Tags
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Add Tags
                  </label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tag (e.g., Web Development, Design)"
                      className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        border: "1px solid var(--color-accent-200)",
                        background: "var(--color-primary)",
                        color: "var(--color-accent-900)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                      style={{
                        background: "var(--color-accent-700)",
                        color: "#fff",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm border"
                        style={{
                          background: "var(--color-accent-50)",
                          color: "var(--color-accent-800)",
                          borderColor: "var(--color-accent-200)",
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 hover:opacity-70 transition-opacity"
                          style={{ color: "var(--color-accent-700)" }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div
              className="rounded-2xl p-6 shadow-sm border"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-accent-100)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Image
                  className="w-5 h-5"
                  style={{ color: "var(--color-accent-700)" }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-accent-900)" }}
                >
                  Media Upload
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: "var(--color-accent-800)" }}
                  >
                    Upload Images ({mediaFiles.length}/5)
                  </label>
                  <div
                    className="border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-200 hover:border-[var(--color-accent-300)]"
                    style={{
                      borderColor: "var(--color-accent-200)",
                      background: "var(--color-accent-50)",
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMediaChange}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="cursor-pointer block"
                    >
                      <Upload
                        className="w-12 h-12 mx-auto mb-4"
                        style={{ color: "var(--color-accent-400)" }}
                      />
                      <p
                        className="mb-2 text-lg font-medium"
                        style={{ color: "var(--color-accent-800)" }}
                      >
                        Click to upload images
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-accent-600)" }}
                      >
                        PNG, JPG, JPEG up to 5MB each (max 5 images)
                      </p>
                    </label>
                  </div>
                </div>

                {mediaFiles.length > 0 && (
                  <div>
                    <h4
                      className="text-sm font-medium mb-4"
                      style={{ color: "var(--color-accent-800)" }}
                    >
                      Preview
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border"
                            style={{ borderColor: "var(--color-accent-200)" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeMediaFile(index)}
                            className="absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{
                              background: "rgba(248,113,113,1)",
                              color: "#fff",
                            }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!listing && mediaFiles.length === 0 && (
                  <div
                    className="rounded-xl border p-4 flex items-start gap-3"
                    style={{
                      background: "rgba(254,242,242,1)",
                      borderColor: "rgba(254,202,202,1)",
                    }}
                  >
                    <AlertCircle
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: "#b91c1c" }}
                    />
                    <div>
                      <p className="font-medium" style={{ color: "#b91c1c" }}>
                        Image Required
                      </p>
                      <p className="text-sm mt-1" style={{ color: "#b91c1c" }}>
                        At least one image is required for new listings
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation and Submit */}
        <div
          className="flex justify-between items-center pt-8 border-t"
          style={{ borderColor: "var(--color-accent-100)" }}
        >
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
              style={{
                border: "1px solid var(--color-accent-200)",
                background: "var(--color-primary)",
                color: "var(--color-accent-800)",
              }}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            {activeTab !== "basic" && (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(
                    (tab) => tab.id === activeTab
                  );
                  if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                }}
                className="px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                style={{
                  background: "var(--color-accent-100)",
                  color: "var(--color-accent-800)",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {activeTab !== "tags" && (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(
                    (tab) => tab.id === activeTab
                  );
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
                className="px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                style={{
                  background: "var(--color-accent-700)",
                  color: "#fff",
                }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeTab === "tags" && (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent-700), var(--color-accent-900))",
                  color: "#fff",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {listing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {listing ? "Update Listing" : "Create Listing"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {errors.submit && (
          <div
            className="rounded-xl p-4 mt-6"
            style={{
              background: "rgba(254,242,242,1)",
              border: "1px solid rgba(254,202,202,1)",
            }}
          >
            <div
              className="flex items-center gap-3"
              style={{ color: "#b91c1c" }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-medium">Error: </span>
                <span>{errors.submit}</span>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* react-select theme overrides */}
      <style jsx>{`
        .react-select-container .react-select__control {
          border-radius: 12px;
          padding: 4px 4px;
          font-size: 14px;
          border: 1px solid var(--color-accent-200);
          background: var(--color-primary);
          box-shadow: none;
        }
        .react-select-container .react-select__control:hover {
          border-color: var(--color-accent-300);
        }
        .react-select-container .react-select__control--is-focused {
          border-color: var(--color-accent-500);
          box-shadow: 0 0 0 2px rgba(122, 133, 193, 0.2);
        }
        .react-select-container .react-select__menu {
          z-index: 40;
        }
      `}</style>
    </div>
  );
};

export default ListingForm;
