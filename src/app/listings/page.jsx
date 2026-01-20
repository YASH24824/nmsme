"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import SearchFilters from "../components/Products/SearchFilters";
import { smartSearchListings } from "../api/smartSearchAPI";
import { getCategories } from "../api/productsAPI";
import ProductCard from "../components/Products/ProductCard";
import { Search, FilterList, MyLocation } from "@mui/icons-material";
import { detectUserLocation } from "../api/homeAPI";

export default function ProductsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCity, setCurrentCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    serviceType: "",
    city: "",
    category: "",
    featured: "",
    sortBy: "relevance",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const locationFetched = useRef(false);

  const convertFiltersToApiParams = (filterObj) => {
    const apiParams = {};
    if (filterObj.search) apiParams.search = filterObj.search;
    if (filterObj.minPrice) apiParams.min_price = filterObj.minPrice;
    if (filterObj.maxPrice) apiParams.max_price = filterObj.maxPrice;
    if (filterObj.serviceType) apiParams.service_type = filterObj.serviceType;
    if (filterObj.city) apiParams.city = filterObj.city;
    if (filterObj.category) apiParams.category_id = filterObj.category;
    if (filterObj.featured) apiParams.featured = filterObj.featured;
    if (filterObj.sortBy) apiParams.sort_by = filterObj.sortBy;
    return apiParams;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchListings = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);

      const searchParams = {
        page,
        limit: 12,
        ...filterParams,
      };

      Object.keys(searchParams).forEach((key) => {
        if (
          searchParams[key] === "" ||
          searchParams[key] === null ||
          searchParams[key] === undefined
        ) {
          delete searchParams[key];
        }
      });

      const response = await smartSearchListings(searchParams);
      const data = response.data;

      setListings(data.listings || []);
      setPagination(data.pagination);
      setCurrentPage(page);
      setError("");

      if (data.detectedCity) {
        setCurrentCity(data.detectedCity);
        setFilters((prev) => ({ ...prev, city: data.detectedCity }));
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load listings.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = async (latitude, longitude) => {
    try {
      setLocationLoading(true);
      const response = await detectUserLocation({ latitude, longitude });
      const locationData = response.data?.data;
      const detectedCity = locationData.city || locationData.detectedCity;

      if (detectedCity) {
        setCurrentCity(detectedCity);
        const updatedFilters = {
          ...filters,
          city: detectedCity,
        };
        setFilters(updatedFilters);
        const apiParams = convertFiltersToApiParams(updatedFilters);
        await fetchListings(1, apiParams);
        toast.success(`Location set to ${detectedCity}`);
      } else {
        toast.error("Could not detect city from location");
      }
    } catch (error) {
      console.error("Failed to detect location:", error);
      toast.error("Failed to detect location. Please enter city manually.");
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (locationFetched.current) return;

    const loadInitialData = async () => {
      locationFetched.current = true;
      try {
        await fetchListings();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                await handleLocationDetect(
                  position.coords.latitude,
                  position.coords.longitude
                );
              } catch (error) {
                console.log("Background location detection failed");
              }
            },
            (error) => {
              console.log("Location permission denied:", error);
            },
            {
              timeout: 8000,
              enableHighAccuracy: false,
            }
          );
        }
      } catch (error) {
        console.error("Initial data load failed:", error);
      }
    };

    loadInitialData();
  }, []);

  function LoadingScreen() {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#3B38A0] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading MSME Guru...</p>
        </div>
      </div>
    );
  }

  if (loading && listings.length === 0) {
    return <LoadingScreen />;
  }

  const handlePageChange = (page) => {
    const apiParams = convertFiltersToApiParams(filters);
    fetchListings(page, apiParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    const apiParams = convertFiltersToApiParams(updatedFilters);
    fetchListings(1, apiParams);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      minPrice: "",
      maxPrice: "",
      serviceType: "",
      city: "",
      category: "",
      featured: "",
      sortBy: "relevance",
    };
    setFilters(resetFilters);
    setCurrentCity(null);
    fetchListings(1);
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Section Container */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                {currentCity ? `Services in ${currentCity}` : "All Services"}
              </h1>

              <span className="mt-2 sm:mt-0 text-xs sm:text-sm text-gray-500 bg-[#f2f3fb] px-2 py-1 rounded">
                {pagination?.total || 0} services
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center flex-wrap gap-3 sm:space-x-3 sm:flex-nowrap">
              {/* Location Button */}
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        await handleLocationDetect(
                          position.coords.latitude,
                          position.coords.longitude
                        );
                      }
                    );
                  }
                }}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-[#3B38A0] transition-colors border border-gray-300 rounded-md hover:border-[#3B38A0]"
              >
                <MyLocation className="w-4 h-4" />
                <span>Location</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3B38A0] focus:border-[#3B38A0] w-full sm:w-auto bg-white"
              >
                <option value="relevance">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-[#3B38A0] text-white rounded-md text-sm hover:bg-[#1A2A80] transition-colors w-full sm:w-auto justify-center"
              >
                <FilterList className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 space-y-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">FILTERS</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#3B38A0] hover:text-[#1A2A80] font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  currentCity={currentCity}
                  onLocationDetect={handleLocationDetect}
                  locationLoading={locationLoading}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.search && (
                  <FilterChip
                    label={`"${filters.search}"`}
                    onRemove={() => handleFilterChange({ search: "" })}
                  />
                )}
                {filters.minPrice && (
                  <FilterChip
                    label={`Min: ₹${filters.minPrice}`}
                    onRemove={() => handleFilterChange({ minPrice: "" })}
                  />
                )}
                {filters.maxPrice && (
                  <FilterChip
                    label={`Max: ₹${filters.maxPrice}`}
                    onRemove={() => handleFilterChange({ maxPrice: "" })}
                  />
                )}
                {filters.category && (
                  <FilterChip
                    label={`${
                      categories.find((c) => c.id == filters.category)?.name ||
                      filters.category
                    }`}
                    onRemove={() => handleFilterChange({ category: "" })}
                  />
                )}
              </div>
            )}

            {/* Products Grid */}
            {!error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ProductCard
                    key={listing.listing_id}
                    listing={listing}
                    className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white"
                  />
                ))}
              </div>
            )}

            {/* Loading More */}
            {loading && listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {listings.length === 0 && !loading && !error && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-[#f2f3fb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#7A85C1]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {hasActiveFilters
                    ? "Try adjusting your filters or search in a different location"
                    : "No services available at the moment"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 bg-[#3B38A0] text-white text-sm rounded-md hover:bg-[#1A2A80] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-[#f2f3fb] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-[#7A85C1]">⚠️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Unable to load services
                </h3>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                  onClick={() => fetchListings()}
                  className="px-5 py-2 bg-[#3B38A0] text-white text-sm rounded-md hover:bg-[#1A2A80] transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && !error && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded border border-gray-300 disabled:opacity-30 hover:bg-[#f2f3fb] text-sm bg-white"
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded text-sm transition-colors border ${
                            currentPage === pageNum
                              ? "bg-[#3B38A0] text-white border-[#3B38A0]"
                              : "text-gray-600 hover:bg-[#f2f3fb] border-gray-300 bg-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="p-2 rounded border border-gray-300 disabled:opacity-30 hover:bg-[#f2f3fb] text-sm bg-white"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 hover:bg-[#f2f3fb] rounded text-gray-600"
                >
                  ✕
                </button>
              </div>

              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                currentCity={currentCity}
                onLocationDetect={handleLocationDetect}
                locationLoading={locationLoading}
                compact={true}
              />

              <div className="flex space-x-3 pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 border border-gray-300 rounded text-gray-700 text-sm hover:bg-[#f2f3fb] bg-white"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2 bg-[#3B38A0] text-white rounded text-sm hover:bg-[#1A2A80]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Filter Chip Component
const FilterChip = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-3 py-1 bg-[#f2f3fb] text-[#3B38A0] rounded-full text-xs border border-[#e4e5f7]">
    {label}
    <button
      onClick={onRemove}
      className="ml-1 hover:text-[#1A2A80] text-sm font-medium"
    >
      ×
    </button>
  </div>
);
