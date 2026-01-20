// app/components/Products/SearchFilters.jsx
import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Search } from "@mui/icons-material";
import { getCategories } from "@/app/api/productsAPI";
import toast from "react-hot-toast";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchFilters = ({
  filters,
  onFilterChange,
  compact = false,
  currentCity,
  onLocationDetect,
  locationLoading = false,
}) => {
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isTypingCity, setIsTypingCity] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    city: filters.city || "",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
    category: filters.category || "",
  });

  const debouncedSearch = useDebounce(localFilters.search, 500);
  const debouncedCity = useDebounce(localFilters.city, 500);
  const debouncedMinPrice = useDebounce(localFilters.minPrice, 500);
  const debouncedMaxPrice = useDebounce(localFilters.maxPrice, 500);

  useEffect(() => {
    setLocalFilters({
      search: filters.search || "",
      city: filters.city || "",
      minPrice: filters.minPrice || "",
      maxPrice: filters.maxPrice || "",
      category: filters.category || "",
    });
  }, [filters]);

  useEffect(() => {
    if (currentCity && !isTypingCity) {
      setLocalFilters((prev) => ({
        ...prev,
        city: currentCity,
      }));
    }
  }, [currentCity, isTypingCity]);

  // Handle debounced filters
  useEffect(() => {
    const changes = {};
    if (debouncedSearch !== filters.search) changes.search = debouncedSearch;
    if (isTypingCity && debouncedCity.trim() !== "") {
      changes.city = debouncedCity;
    }

    if (debouncedMinPrice !== filters.minPrice)
      changes.minPrice = debouncedMinPrice;
    if (debouncedMaxPrice !== filters.maxPrice)
      changes.maxPrice = debouncedMaxPrice;

    if (Object.keys(changes).length > 0) {
      onFilterChange(changes);
    }
  }, [
    debouncedSearch,
    debouncedCity,
    debouncedMinPrice,
    debouncedMaxPrice,
    onFilterChange,
    filters.search,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const handleImmediateChange = useCallback(
    (key, value) => {
      onFilterChange({ [key]: value });
    },
    [onFilterChange]
  );

  const handleLocalChange = (key, value) => {
    if (key === "city") setIsTypingCity(true);
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    const timeoutId = setTimeout(() => {
      setDetectingLocation(false);
      toast.error("Location detection timed out.");
    }, 15000);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = position.coords;
      console.log("detedct", currentCity);

      // Parent returns detected city → we update UI
      const detectedCity = await onLocationDetect(latitude, longitude);
      if (detectedCity) {
        // Update input
        setLocalFilters((prev) => ({
          ...prev,
          city: detectedCity,
        }));

        // Update filters immediately
        onFilterChange({ city: detectedCity });
      }
    } catch (err) {
      console.error("Error detecting location:", err);
      let errorMessage = "Unable to detect your location.";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access denied.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case err.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
      }
      toast.error(errorMessage);
    } finally {
      clearTimeout(timeoutId);
      setDetectingLocation(false);
    }
  };

  const isLocationLoading = detectingLocation || locationLoading;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          SEARCH
        </label>
        <div className="relative">
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleLocalChange("search", e.target.value)}
            placeholder="Service name or keyword"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B38A0] focus:border-[#3B38A0] bg-white"
          />
          <Search className="absolute right-2 top-2 w-4 h-4 text-[#7A85C1]" />
        </div>
      </div>

      {/* City */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-700">
            CITY
          </label>
          <button
            type="button"
            onClick={detectCurrentLocation}
            disabled={isLocationLoading}
            className="flex items-center gap-1 text-xs text-[#3B38A0] hover:text-[#1A2A80] disabled:opacity-50 transition-colors"
          >
            <Navigation className="w-3 h-3" />
            {isLocationLoading ? "Detecting..." : "Auto"}
          </button>
        </div>

        {currentCity && (
          <div className="mb-2 p-2 bg-[#f2f3fb] rounded border border-[#e4e5f7]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#3B38A0]" />
              <span className="text-xs text-[#1A2A80] font-medium">
                {currentCity}
              </span>
            </div>
          </div>
        )}

        <input
          type="text"
          value={localFilters.city}
          onChange={(e) => handleLocalChange("city", e.target.value)}
          placeholder="Enter city"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B38A0] focus:border-[#3B38A0] bg-white"
          disabled={isLocationLoading}
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          PRICE RANGE (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={localFilters.minPrice}
            onChange={(e) => handleLocalChange("minPrice", e.target.value)}
            placeholder="Min"
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B38A0] focus:border-[#3B38A0] bg-white"
          />
          <input
            type="number"
            value={localFilters.maxPrice}
            onChange={(e) => handleLocalChange("maxPrice", e.target.value)}
            placeholder="Max"
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B38A0] focus:border-[#3B38A0] bg-white"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          CATEGORY
        </label>
        <select
          value={localFilters.category}
          onChange={(e) => handleImmediateChange("category", e.target.value)}
          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B38A0] focus:border-[#3B38A0] bg-white"
          disabled={loadingCategories}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Featured */}
      <div className="flex items-center pt-2 border-t border-gray-200">
        <input
          type="checkbox"
          id="featured"
          checked={filters.featured === "true"}
          onChange={(e) =>
            handleImmediateChange("featured", e.target.checked ? "true" : "")
          }
          className="w-4 h-4 text-[#3B38A0] border-gray-300 rounded focus:ring-[#3B38A0]"
        />
        <label htmlFor="featured" className="ml-2 text-xs text-gray-700">
          Featured listings only
        </label>
      </div>
    </div>
  );
};

export default SearchFilters;
