"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, LocationOn, Factory, RocketLaunch } from '@mui/icons-material';

// Import your local images
import img1 from '../../../../public/101.jpeg';
import img2 from '../../../../public/102.jpeg';
import img3 from '../../../../public/103.jpeg';

function HeroSection({
  userLocation = "",
  onLocationChange = (value) => console.log("Location changed:", value),
  onUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Position:", position.coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  },
  onSearch = (query) => console.log("Searching for:", query),
  searchSuggestions = [],
  showSuggestions = false,
  onHideSuggestions = () => {},
  onSuggestionSelect = (suggestion) => console.log("Suggestion selected:", suggestion),
  isScrolled = false,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const slideIntervalRef = useRef(null);
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Hero section mock data
  const heroSlides = [
    {
      id: 1,
      title: "Connect Local Businesses",
      subtitle: "Grow Together",
      description: "Discover verified suppliers, connect with qualified buyers, and grow your business through India's premier MSME networking platform.",
      backgroundImage: img1,
      ctaText: "Start Exploring",
      secondaryCta: "Watch Demo",
      icon: <RocketLaunch />,
      badge: "Trusted by 10,000+ MSMEs",
    },
    {
      id: 2,
      title: "Find Quality Suppliers",
      subtitle: "Build Your Network",
      description: "Access 5,000+ verified manufacturers, wholesalers, and service providers across India. Quality assured, delivery guaranteed.",
      backgroundImage: img2,
      ctaText: "Find Suppliers",
      secondaryCta: "Learn More",
      icon: <Factory />,
      badge: "5,000+ Factories",
    },
    {
      id: 3,
      title: "Expand Your Market",
      subtitle: "Reach New Customers",
      description: "Showcase your products to 15,000+ active business buyers. Increase your sales and grow your customer base exponentially.",
      backgroundImage: img3,
      ctaText: "List Your Business",
      secondaryCta: "See Pricing",
      icon: <RocketLaunch />,
      badge: "95% Success Rate",
    },
  ];

  const popularCategories = [
    "Manufacturing",
    "Retail",
    "Handicrafts",
    "Food",
    "Textiles",
    "Electronics",
  ];

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      onSearch(localSearchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Auto-rotate slides
  useEffect(() => {
    if (isAutoPlaying && heroSlides.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === heroSlides.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isAutoPlaying, heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    goToSlide(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        onHideSuggestions();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onHideSuggestions]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Carousel - FIXED FOR NO BLUR */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000
              ${index === currentSlide ? "opacity-10" : "opacity-0"}`}
          >
            {/* Use Next.js Image component for crisp images */}
            <Image
              src={slide.backgroundImage}
              alt=""
              fill
              priority={index === 0}
              quality={100}
              className="object-cover"
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                imageRendering: 'auto',
              }}
            />
          </div>
        ))}
      </div>

      {/* Carousel Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30  rounded-full flex items-center justify-center text-white transition-all group"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Carousel Text */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10  border border-white/20">
                <span className="text-sm font-sans">
                  {currentSlideData.badge}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-sans font-semibold leading-tight">
                  <div className="bg-gradient-to-r from-white to-[var(--color-accent-500)] bg-clip-text text-transparent">
                    {currentSlideData.title}
                  </div>
                  <div className="text-[var(--color-accent-100)] mt-2">
                    {currentSlideData.subtitle}
                  </div>
                </h1>
                <p className="text-xl text-[var(--color-accent-100)] leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push("/listings")} 
                className="group bg-white text-[var(--color-accent-800)] px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl hover:text-[var(--color-accent-500)] flex items-center justify-center"
              >
                <span>{currentSlideData.ctaText}</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Card */}
          <div className="relative">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-sans font-semibold text-white mb-2">
                    Find Business Partners
                  </h3>
                  <p className="text-blue-100">
                    Search across 5,000+ verified listings
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[var(--color-accent-100)] font-medium mb-3">
                      Your Location
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={userLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="Enter city or pincode"
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-[var(--color-accent-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-200)] backdrop-blur-sm"
                      />
                      <button
                        onClick={onUseLocation}
                        className="bg-white/20 hover:bg-white/30 text-[var(--color-accent-100)] px-4 py-3 rounded-xl font-medium transition-all  border border-white/20 flex items-center gap-2"
                      >
                        <LocationOn className="w-4 h-4" /> Detect
                      </button>
                    </div>
                  </div>

                  <div className="relative" ref={searchInputRef}>
                    <label className="block text-[var(--color-accent-100)] font-medium mb-3">
                      What are you looking for?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Products, services, or businesses..."
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-[var(--color-accent-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-200)] pr-20"
                      />
                      <button
                        onClick={handleSearchSubmit}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>

                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[var(--color-accent-200)] overflow-hidden z-50">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              onSuggestionSelect(suggestion);
                              setLocalSearchQuery(suggestion.display);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3 transition-colors"
                          >
                            <span
                              className={`text-lg ${
                                suggestion.type === "category"
                                  ? "text-blue-500"
                                  : suggestion.type === "seller"
                                  ? "text-green-500"
                                  : "text-teal-500"
                              }`}
                            >
                              {suggestion.type === "category" ? (
                                "📁"
                              ) : suggestion.type === "seller" ? (
                                "🏢"
                              ) : (
                                <Search className="w-4 h-4" />
                              )}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {suggestion.display}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {suggestion.type}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {popularCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setLocalSearchQuery(category);
                            onSearch(category);
                          }}
                          className="font-sans bg-white/10 hover:bg-white/20 text-[var(--color-accent-100)] px-4 py-2 rounded-lg text-sm transition-all border border-white/10"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;