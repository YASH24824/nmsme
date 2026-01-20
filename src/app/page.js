"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';


import {
  getHomePageData,
  getSearchSuggestions,
  detectUserLocation,
} from "./api/homeAPI";
import {
  Factory,
  LocationOn,
  TrendingUp,
  RocketLaunch,
  Search,
} from "@mui/icons-material";
import { Award, BarChart3, Building2, ShieldCheck, Users2 } from "lucide-react";
import RatingStars from "./components/Ratings";
import Trendingtags from "./components/home/Trendingtags"

const COLORS = {
  primary: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    900: "#134e4a",
  },
  accent: {
    500: "#8b5cf6",
    600: "#7c3aed",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// Fallback mock data
// const FALLBACK_DATA = {
//   categories: [
//     {
//       id: "1",
//       name: "Manufacturing",
//       count: 2314,
//       image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop",
//       icon: "🏭",
//     },
//     {
//       id: "2",
//       name: "Retail",
//       count: 1842,
//       image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
//       icon: "🛍️",
//     },
//     {
//       id: "3",
//       name: "Handicrafts",
//       count: 956,
//       image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
//       icon: "🎨",
//     },
//     {
//       id: "4",
//       name: "Food & Beverage",
//       count: 1287,
//       image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
//       icon: "🍽️",
//     },
//     {
//       id: "5",
//       name: "Textiles",
//       count: 1743,
//       image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
//       icon: "🧵",
//     },
//     {
//       id: "6",
//       name: "Electronics",
//       count: 892,
//       image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
//       icon: "🔌",
//     },
//   ],
//   promoted: [],
//   listings: [],
//   reviews: [],
// };

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================


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



// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

import { motion, AnimatePresence } from 'framer-motion';
import {  ChevronRight, Users, Target, X, Play, ExternalLink } from 'lucide-react';

function HeroSection({
  userLocation,
  onLocationChange,
  onUseLocation,
  onSearch,
  searchSuggestions,
  showSuggestions,
  onHideSuggestions,
  onSuggestionSelect,
  isScrolled,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slideIntervalRef = useRef(null);
  const searchInputRef = useRef(null);
  const curtainRef = useRef(null);
  const router = useRouter();

  // -----------------------
  // 🔵 HERO SLIDES (with expanded details for curtain view)
  // -----------------------
  const heroSlides = [
    {
      id: 1,
      title: "Connect Local Businesses",
      subtitle: "Grow Together",
      description:
        "Discover verified suppliers, connect with qualified buyers, and grow your business through India's premier MSME networking platform.",
      backgroundImage: "/imm.jpeg",
      ctaText: "Start Exploring",
      secondaryCta: "Watch Demo",
      icon: <RocketLaunch />,
      badge: "Trusted by 10,000+ MSMEs",
      // Additional details for curtain view
      fullDescription: "MSME Sahaay's networking platform connects you with thousands of verified businesses across India. Access real-time market insights, participate in exclusive business events, and leverage our intelligent matchmaking algorithm to find the perfect partners for growth. Our platform ensures every connection is meaningful and growth-oriented.",
      features: [
        "Verified Business Profiles",
        "Real-time Market Insights",
        "Intelligent Matchmaking",
        "Exclusive Business Events"
      ],
      stats: [
        { label: "Businesses", value: "10,000+" },
        { label: "Success Rate", value: "92%" },
        { label: "Cities", value: "150+" }
      ]
    },
    {
      id: 2,
      title: "Find Quality Suppliers",
      subtitle: "Build Your Network",
      description:
        "Access 5,000+ verified manufacturers, wholesalers, and service providers across India. Quality assured, delivery guaranteed.",
      backgroundImage: "/imm.jpeg",
      ctaText: "Find Suppliers",
      secondaryCta: "Learn More",
      icon: <Factory />,
      badge: "5,000+ Factories",
      fullDescription: "Our curated supplier database includes manufacturers, wholesalers, and service providers verified for quality and reliability. Each supplier undergoes a rigorous verification process, ensuring you get the best products at competitive prices. From raw materials to finished goods, find everything your business needs.",
      features: [
        "Quality Verified Suppliers",
        "Competitive Pricing",
        "Delivery Tracking",
        "Rating & Reviews"
      ],
      stats: [
        { label: "Suppliers", value: "5,000+" },
        { label: "Categories", value: "200+" },
        { label: "Delivery", value: "98%" }
      ]
    },
    {
      id: 3,
      title: "Expand Your Market",
      subtitle: "Reach New Customers",
      description:
        "Showcase your products to 15,000+ active business buyers. Increase your sales and grow your customer base exponentially.",
      backgroundImage: "/imm.jpeg",
      ctaText: "List Your Business",
      secondaryCta: "See Pricing",
      icon: <RocketLaunch />,
      badge: "95% Success Rate",
      fullDescription: "Expand your market reach with our powerful marketing tools and extensive buyer network. Showcase your products to thousands of verified business buyers looking for exactly what you offer. Our platform provides analytics, lead generation, and sales tools to maximize your growth potential.",
      features: [
        "Product Showcase",
        "Targeted Marketing",
        "Sales Analytics",
        "Lead Generation"
      ],
      stats: [
        { label: "Active Buyers", value: "15,000+" },
        { label: "Growth Rate", value: "95%" },
        { label: "Countries", value: "25+" }
      ]
    },
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

  // -----------------------
  // 🔄 AUTO-ROTATE CAROUSEL
  // -----------------------
  useEffect(() => {
    if (isAutoPlaying && heroSlides.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === heroSlides.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    clearInterval(slideIntervalRef.current);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % heroSlides.length);
  const prevSlide = () =>
    goToSlide(
      currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1
    );

  // -----------------------
  // CURTAIN OPEN/CLOSE FUNCTIONS
  // -----------------------
  const openCurtain = (slideIndex) => {
    setSelectedSlide(slideIndex);
    setCurtainOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    setIsAutoPlaying(false);
  };

  const closeCurtain = () => {
    setCurtainOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
    setTimeout(() => {
      setSelectedSlide(null);
      setIsAutoPlaying(true);
    }, 500);
  };

  // Close curtain on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && curtainOpen) {
        closeCurtain();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [curtainOpen]);

  // -----------------------
  // OUTSIDE CLICK HIDE SUGGESTIONS
  // -----------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        onHideSuggestions();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* MAIN HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center py-6 px-3 lg:px-10 relative">
        <div className="w-full bg-white rounded-3xl p-6 lg:p-10 space-y-8">
          {/* 🔵 TOP CAROUSEL WITH CURTAIN TRIGGER */}
          <div className="w-full flex justify-center">
            <div 
              className="w-full h-60 sm:h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openCurtain(currentSlide)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlides[currentSlide].id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={heroSlides[currentSlide].backgroundImage}
                    alt="Hero Slide"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay with click hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">Click to explore</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 🔻 BOTTOM SECTION — MOBILE STACK / DESKTOP ROW */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* LEFT TEXT CARD */}
            <div className="w-full md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">About MSME Sahaay</h3>
                <button 
                  onClick={() => router.push('/about')}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
                >
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700 text-sm font-sans leading-relaxed">
                MSME Sahaay is a modern platform designed to uplift MSMEs with the right tools, visibility, and guidance. We help businesses grow faster by simplifying selling, buying, networking, and branding. With MSME Sahaay, every small business gets the power to think bigger, act smarter, and scale confidently.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">10K+</div>
                  <div className="text-xs text-gray-600">Businesses</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">95%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">150+</div>
                  <div className="text-xs text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* RIGHT MINI CAROUSEL GRID */}
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-3 gap-4">
                {heroSlides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative h-56 rounded-2xl overflow-hidden shadow-md border border-gray-200 cursor-pointer group"
                    onClick={() => openCurtain(index)}
                  >
                    <Image
                      src={slide.backgroundImage}
                      alt={slide.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          {slide.icon}
                        </div>
                        <span className="text-white/90 text-xs font-medium">{slide.badge}</span>
                      </div>
                      <h4 className="text-white font-semibold text-sm mb-1">{slide.title}</h4>
                      <p className="text-white/80 text-xs line-clamp-2">{slide.description}</p>
                      
                      {/* Expand Button */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center space-x-4">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CURTAIN OVERLAY */}
      <AnimatePresence>
        {curtainOpen && selectedSlide !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeCurtain}
            />
            
            {/* Curtain Panel */}
            <motion.div
              ref={curtainRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 200
              }}
              className="fixed top-0 right-0 h-full w-full md:w-3/4 lg:w-2/3 bg-white z-50 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeCurtain}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center z-50"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Curtain Content */}
              <div className="h-full">
                {/* Hero Image */}
                <div className="relative h-72 md:h-80 w-full">
                  <Image
                    src={heroSlides[selectedSlide].backgroundImage}
                    alt={heroSlides[selectedSlide].title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 lg:p-12">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        {heroSlides[selectedSlide].icon}
                      </div>
                      <div>
                        <div className="text-sm text-blue-600 font-medium">
                          {heroSlides[selectedSlide].badge}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {heroSlides[selectedSlide].title}
                        </h1>
                        <p className="text-gray-600">{heroSlides[selectedSlide].subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                    {heroSlides[selectedSlide].stats?.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Full Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Overview</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {heroSlides[selectedSlide].fullDescription}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {heroSlides[selectedSlide].features?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex-1 flex items-center justify-center space-x-2">
                      <span>{heroSlides[selectedSlide].ctaText}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1">
                      {heroSlides[selectedSlide].secondaryCta}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// SEARCH FILTER BAR COMPONENT
// ============================================================================
function SearchFilterBar({
  searchQuery,
  selectedCategory,
  userLocation,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  categories,
}) {
  const router = useRouter();
  const popularCategories = categories.slice(0, 6);

  // Slugify function
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "& ")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Complete category selection handler
  const handleCategorySelect = (categoryId, categoryName) => {
    // Update state and fetch data
    onCategoryChange(categoryId);
    
    // Navigate to category page
    const slug = slugify(categoryName);
    router.push(`/categories/${slug}/${categoryId}`);
  };

  // Handle category dropdown
  const handleCategoryDropdownChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId) {
      const selectedCat = categories.find(cat => cat.id === categoryId);
      if (selectedCat) {
        handleCategorySelect(categoryId, selectedCat.name);
      }
    } else {
      onCategoryChange(''); // Clear selection
    }
  };

  // Handle popular category chips
  const handlePopularCategoryClick = (category) => {
    handleCategorySelect(category.id, category.name);
  };

  // Static filter options
  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "0-1000", label: "Under ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000+", label: "Over ₹10,000" }
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-popular", label: "Most Popular" },
    { value: "highest-rated", label: "Highest Rated" }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-[var(--color-accent-100)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Row - 4 Filters Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={handleCategoryDropdownChange}
              className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none"
            >
              <option value="" className="text-[var(--color-accent-600)]">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-[var(--color-accent-900)]">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-500)] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <LocationOn className="h-5 w-5 text-[var(--color-accent-500)]" />
            </div>
            <input
              type="text"
              value={userLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Enter location..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)]"
            />
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none">
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-500)] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-500)] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-sm font-sans font-semibold text-[var(--color-accent-700)] flex items-center">
            <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full mr-2 animate-pulse"></span>
            Popular Categories:
          </span>

          {popularCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handlePopularCategoryClick(category)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 transform hover:scale-105 border
                ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-700)] text-white shadow-lg shadow-[var(--color-accent-500)]/30 border-[var(--color-accent-400)]"
                    : "bg-white/80 text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// STATS SECTION COMPONENT
// ============================================================================
function StatsSection({ stats }) {
  const statItems = [
    {
      label: "Active Listings",
      value: stats.totalListings || "10,000+",
      icon: <BarChart3 className="w-7 h-7" />,
      color: "bg-var(--color-accent-500)] to-[var(--color-accent-700)]",
    },
    {
      label: "Verified Sellers",
      value: stats.totalSellers || "5,000+",
      icon: <ShieldCheck className="w-7 h-7" />,
      color: "from-[var(--color-accent-400)] to-[var(--color-accent-600)]",
    },
    {
      label: "Business Buyers",
      value: stats.totalBuyers || "15,000+",
      icon: <Users2 className="w-7 h-7" />,
      color: "from-[var(--color-accent-300)] to-[var(--color-accent-500)]",
    },
    {
      label: "Success Stories",
      value: stats.totalLeads
        ? `${(stats.totalLeads / 1000).toFixed(0)}k+`
        : "50k+",
      icon: <Award className="w-7 h-7" />,
      color: "from-[var(--color-accent-600)] to-[var(--color-accent-900)]",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white to-[var(--color-accent-100)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
         <h3 className="text-4xl mb-2  font-semibold bg-gradient-to-r from-[var(--color-accent-900)] to-[var(--color-accent-600)] bg-clip-text text-transparent">
  India&apos;s Fastest Growing MSME Platform
</h3>
          <p className="text-[var(--color-accent-700)] text-lg font-medium">
            Trusted by businesses across the country
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className={`rounded-2xl p-6 shadow-xl bg-white border border-[var(--color-accent-200)]
                hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Icon */}
              {/* Icon */}
<div
  className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center 
  bg-[var(--color-accent-800)] text-white shadow-lg`}
>
  {stat.icon}
</div>


                {/* Value */}
                <div className="text-3xl font-bold text-[var(--color-accent-900)]">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-[var(--color-accent-700)] mt-1 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


// ============================================================================
// TOP CATEGORIES SECTION 1 COMPONENT
// ============================================================================
function TopCategoriesSection1({ topcategories, onCategorySelect }) {
  const router = useRouter();
  
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "& ")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    const slug = slugify(categoryName);
    router.push(`/categories/${slug}/${categoryId}`);
  };

  const handleImageLoad = (e) => {
    e.target.style.opacity = '1';
  };

  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/${e.target.width}x${e.target.height}/f3f4f6/6b7280?text=${e.target.alt}`;
  };

  if (!topcategories || topcategories.length === 0) {
    return (
      <div className="w-full py-16 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">Loading categories...</h2>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10 bg-[var(--color-accent-50)]">
      <h2 className="text-center text-3xl font-sans font-semibold mb-10 text-gray-800">
        Top Categories
      </h2>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-4">
        {topcategories.map((c, i) => (
          <div 
            key={i}
            className="rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer bg-white"
            onClick={() => handleCategoryClick(c.id, c.name)}
          >
            <div className="relative h-52 bg-gray-200">
  <Image 
    src={c.image_url}
    alt={c.name || c.title}
    fill
    className="w-full h-full object-cover duration-300 opacity-0"
    onLoad={handleImageLoad}
    onError={handleImageError}
    loading="lazy"
  />
</div>
            <div className="p-5">
              <h3 className="text-sm font-sans text-gray-800 group-hover:text-teal-600 transition-colors">
                {c.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// TOP CATEGORIES SECTION 2 COMPONENT
// ============================================================================
function TopCategoriesSection2({ onCategorySelect }) {
  const router = useRouter();

  // Section 2 mock data
  const CATEGORIES_SECTION2 = {
    section3: [
      { title: "Interior Design", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&auto=format" },
      { title: "Home Cleaning", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop&auto=format" },
      { title: "Electricians", img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop&auto=format" },
      { title: "Home Tutors", img: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=300&h=200&fit=crop&auto=format" },
      { title: "Pest Control", img: "https://images.unsplash.com/photo-1598791318878-10e76d178023?w=300&h=200&fit=crop&auto=format" },
    ],
    section4: [
      { title: "Wholesale Market", img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&h=200&fit=crop&auto=format"},
      { title: "Manufacturing", img: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop&auto=format" },
      { title: "IT Companies", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop&auto=format" },
      { title: "Coaching Classes", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=200&fit=crop&auto=format" },
      { title: "Consulting", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&auto=format" },
    ],
  };

  const handleCategoryClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/categories/${slug}`);
  };

  return (
   <section className="py-20 bg-[var(--color-accent-50)]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* LEFT BOX */}
    <div className="bg-white p-6 rounded-2xl border border-[var(--color-accent-200)] shadow-sm">
      <h2 className="text-2xl font-semibold text-[var(--color-accent-900)] mb-6">
        Home Services
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {CATEGORIES_SECTION2.section3.map((c, i) => (
          <div
            key={i}
            className="p-4 rounded-xl cursor-pointer flex flex-col items-center 
            hover:bg-[var(--color-accent-50)] transition-all"
            onClick={() => handleCategoryClick(c.title)}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden 
            bg-[var(--color-accent-800)] flex items-center justify-center shadow-md">
 <Image
  src={c.img}
  alt={c.title}
  width={80}  // Set your desired dimensions
  height={80}
 // opacity={90}
    className="w-full h-full object-cover opacity-90"
  loading="lazy"
/>
            
            </div>

            <div className="mt-3 text-base font-semibold text-[var(--color-accent-900)] text-center">
              {c.title}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT BOX */}
    <div className="bg-white p-6 rounded-2xl border border-[var(--color-accent-200)] shadow-sm">
      <h2 className="text-2xl font-semibold text-[var(--color-accent-900)] mb-6">
        Professional Services
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {CATEGORIES_SECTION2.section4.map((c, i) => (
          <div
            key={i}
            className="p-4 rounded-xl cursor-pointer flex flex-col items-center 
            hover:bg-[var(--color-accent-50)] transition-all"
            onClick={() => handleCategoryClick(c.title)}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden 
            bg-[var(--color-accent-800)] flex items-center justify-center shadow-md">

<Image
  src={c.img}
  alt={c.title}
  width={80}  // Set your desired dimensions
  height={80}
 // opacity={90}
    className="w-full h-full object-cover opacity-90"
  loading="lazy"
/>
           
            </div>

            <h3 className="mt-3 text-base font-semibold text-[var(--color-accent-900)] text-center">
              {c.title}
            </h3>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

  );
}

// ============================================================================
// TOP CATEGORIES SECTION 3 COMPONENT
// ============================================================================
function TopCategoriesSection3({ onCategorySelect }) {
  const router = useRouter();

  // Section 3 mock data
  const CATEGORIES_SECTION3 = {
    section5: [
      { title: "Travel Agencies", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=350&h=250&fit=crop&auto=format" },
      { title: "Adventure Trips", img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=350&h=250&fit=crop&auto=format" },
      { title: "Tour Guides", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&h=250&fit=crop&auto=format" },
      { title: "Luxury Resorts", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=350&h=250&fit=crop&auto=format" },
    ],
  };

  const handleCategoryClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/categories/${slug}`);
  };

  const handleImageLoad = (e) => {
    e.target.style.opacity = '1';
  };

  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/${e.target.width}x${e.target.height}/f3f4f6/6b7280?text=${e.target.alt}`;
  };

  return (
 <section className="py-20 bg-[var(--color-accent-50)] text-[var(--color-accent-900)]">
  <h2 className="text-4xl font-semibold text-center mb-12 
    bg-gradient-to-r from-[var(--color-accent-900)] to-[var(--color-accent-700)]
    bg-clip-text text-transparent">
    Explore Travel
  </h2>

  <div className="flex flex-col md:flex-row justify-center gap-8 px-6 max-w-7xl mx-auto">

    {CATEGORIES_SECTION3.section5.map((c, i) => (
      <div
        key={i}
        className="flex-1 bg-white rounded-2xl overflow-hidden 
        shadow-lg hover:shadow-2xl transition-all duration-300 
        hover:-translate-y-1 cursor-pointer border border-[var(--color-accent-200)]"
        onClick={() => handleCategoryClick(c.title)}
      >
        {/* Image Box */}
     <div className="relative w-20 h-20 rounded-full overflow-hidden 
bg-[var(--color-accent-800)] flex items-center justify-center shadow-md">
  <Image
    src={c.img}
    alt={c.title}
    width={80}
    height={80}
    className="w-full h-full object-cover opacity-90"
    loading="lazy"
  />
</div>

        {/* Title */}
        <div className="p-6 text-center font-semibold text-xl text-[var(--color-accent-900)]">
          {c.title}
        </div>
      </div>
    ))}

  </div>
</section>

  );
}

// ============================================================================
// CATEGORY GRID COMPONENT
// ============================================================================
function CategoryGrid({ categories, onCategoryClick, loading }) {
  const router = useRouter();
  
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "& ")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId, categoryName);
    }

    const slug = slugify(categoryName);
    router.push(`/categories/${slug}/${categoryId}`);
  };

  const handleViewAll = () => {
    router.push('/categories');
  };

  if (loading && categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Browse Categories</h2>
            <p className="text-gray-600 text-lg">
              Explore business opportunities by category
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-white"
              >
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-6">
                  <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-[var(--color-accent-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-sans font-semibold  mb-4 text-[var(--color-black-darker: #1a1a1a)]">Categories Hub</h2>
          <p className="text-[var( --color-black-soft: #111111)] text-lg">
            Explore business opportunities by category
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category, index) => {
            const categoryImage = category.image_url || category.image || "/default-category.jpg";

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="rounded-lg overflow-hidden shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer bg-white group"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
  src={categoryImage}
  alt={category.name}
  width={80}  // Set your desired dimensions
  height={80}
 // opacity={90}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  loading="lazy"
/>
                
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm  font-sans  text-gray-800 group-hover:text-[var(--color-black-darker: #1a1a1a)] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

       <div className="text-center mt-12">
  <button
    onClick={handleViewAll}
    className="inline-flex items-center px-6 py-3 bg-[var(--color-accent-800)] text-white text-sm font-sans font-semibold border border-gray-300 rounded-lg hover:bg-[var(--color-accent-900)] transition-all shadow-sm"
  >
    View All Categories
    <svg
      className="w-4 h-4 ml-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
</div>

      </div>
    </section>
  );
}

// ============================================================================
// LISTINGS GRID COMPONENT
// ============================================================================
function ListingsGrid({
  listings,
  userLocation,
  onInquiryClick,
  onLoadMore,
  loading,
  hasMore,
}) {
     const router=useRouter()

  // Sort listings by views (highest first) and limit to 6
  const sortedListings = [...listings]
    .sort((a, b) => (b.view || b.views || 0) - (a.view || a.views || 0))
    .slice(0, 6);

  if (loading && listings.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Trending Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden shadow-md bg-white border border-gray-200"
              >
                <div className="bg-gray-200 h-40 w-full animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="bg-gray-300 h-4 rounded w-4/5 animate-pulse"></div>
                      <div className="bg-gray-300 h-3 rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="bg-gray-300 h-5 rounded-full w-12 animate-pulse"></div>
                  </div>
                  <div className="bg-gray-300 h-3 rounded w-full animate-pulse"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="bg-gray-300 h-5 rounded w-16 animate-pulse"></div>
                    <div className="bg-gray-300 h-8 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    );
 
  }

  return (
    <section className="py-12 bg-[var(--color-accent-50)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-sans font-semibold text-gray-900 mb-3">
            Most Viewed Listings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Popular business opportunities
          </p>
        </div>

        {/* Controls */}
        {/* <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">
                Top {sortedListings.length} Listings
              </span>
            </div>
          </div>
        </div> */}

        {sortedListings.length === 0 ? (
     <div className="text-center py-16">
  <div className="w-24 h-24 bg-[var(--color-accent-100)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-accent-200)]">
    <Search className="w-10 h-10 text-[var(--color-accent-600)]" />
  </div>
  <h3 className="text-xl font-sans font-semibold text-[var(--color-accent-900)] mb-3">
    No listings found
  </h3>
  <p className="text-[var(--color-accent-700)] font-sans max-w-md mx-auto mb-8">
    Start exploring to see popular listings.
  </p>
  <button
    onClick={() => router.push('/listings')}
    className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white font-sans font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
  >
    Browse All Listings
  </button>
</div>
        ) : (
          <>
            {/* Listings Grid - 3 cards per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                >
                  {/* Views Counter */}
                  <div className="absolute top-3 right-3 z-10 bg-white/95 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-gray-200">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {listing.view || listing.views || 0}
                  </div>

                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                          <Image
  src={listing.image}
  alt={listing.title}
  width={80}  // Set your desired dimensions
  height={80}
 // opacity={90}
    className="w-full h-40 object-cover group-hover:scale-105 rounded-2xl transition-transform duration-300"
  loading="lazy"
/>
               
                    
                   
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        {listing.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 text-base mb-2 leading-tight">
                      {listing.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
                      <LocationOn className="w-3 h-3 text-gray-500" />
                      <span className="truncate">
                        {Array.isArray(listing.location)
                          ? listing.location.join(", ")
                          : listing.location || "Remote"}
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-gray-900 font-bold text-lg">
                        {listing.price}
                      </div>
                      <button
                        onClick={() => onInquiryClick(listing)}
                        className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More - Only show if there are more than 6 listings */}
            {hasMore && listings.length > 6 && (
              <div className="text-center mt-10">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Show All Listings
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// REVIEWS SECTION COMPONENT
// ============================================================================
function ReviewsSection({ reviews }) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What Our Community Says
          </h2>
          <p className="text-gray-600 mt-2">
            Real stories from real businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                  {review.user?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {review.user || "User"}
                  </h4>
                  <div className="flex items-center space-x-1 mt-1">
                    <RatingStars rating={review.rating} />
                    <span className="text-gray-500 text-sm ml-1">
                      ({review.rating}.0)
                    </span>
                  </div>
                </div>
              </div>

             <p className="text-gray-600 mb-4 leading-relaxed">
  &quot;{review.text}&quot;
</p>

              <div className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
                View {review.listingTitle}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-teal-500 hover:text-teal-600 transition-all">
            Read More Reviews
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CATEGORIES LANDING PAGE COMPONENT
// ============================================================================
function CategoriesLandingPage({ topcategories, onCategorySelect }) {
  return (
    <div className="w-full">
      <TopCategoriesSection1 
        topcategories={topcategories} 
        onCategorySelect={onCategorySelect}
      />
      <Trendingtags/>
      <TopCategoriesSection2 
        onCategorySelect={onCategorySelect}
      />
      <TopCategoriesSection3 
        onCategorySelect={onCategorySelect}
      />
    </div>
  );
}

// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================
export default function HomePage() {
  const router = useRouter();
  const [homeData, setHomeData] = useState({
    categories: [],
    promoted: [],
    listings: [],
    reviews: [],
    stats: {},
  });
  const [userLocation, setUserLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topcategories, settopcategories] = useState([]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch home page data
 const fetchHomeData = useCallback(
  async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        userLocation: filters.userLocation || userLocation,
        search: filters.searchQuery || searchQuery,
        category: filters.selectedCategory || selectedCategory,
        page: filters.page || 1,
        limit: 20,
      };

      const response = await getHomePageData(params);

      if (response.data.success) {
        const data = response.data.data;

        setHomeData(data);

        const top = data.categories || [];
        const tops = [...top]
          .sort((a, b) => (b.count || 0) - (a.count || 0))
          .slice(0, 8);

        settopcategories(tops);
      } else {
        throw new Error(response.data.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching home data:", err);

      setError("Failed to load data. Showing sample listings.");
      setHomeData(FALLBACK_DATA);

      const fallbackTops = [...FALLBACK_DATA.categories]
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      settopcategories(fallbackTops);
    } finally {
      setLoading(false);
    }
  },
  [userLocation, searchQuery, selectedCategory]  // ✅ REQUIRED
);

  // Fetch search suggestions
  const fetchSearchSuggestions = async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await getSearchSuggestions(query);
      if (response.data.success) {
        setSearchSuggestions(response.data.data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching search suggestions:", err);
      setSearchSuggestions([]);
    }
  };

  // Handle geolocation
  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await detectUserLocation({ latitude, longitude });
            if (response.data.success) {
              const location = response.data.data;
              setUserLocation(location.city);
              fetchHomeData({ userLocation: location.city });
            }
          } catch (err) {
            console.error("Error detecting location:", err);
            setUserLocation("Mumbai");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation("Mumbai");
        }
      );
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchHomeData({ searchQuery: query });

    // Scroll to listings section after a short delay
    setTimeout(() => {
      const listingsSection = document.getElementById("latest-listings");
      if (listingsSection) {
        listingsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);
    fetchHomeData({ selectedCategory: categoryId });

    // Navigate to category page
    router.push(`/categories/${categoryId}`);
  };

  // Initial data load
 useEffect(() => {
  fetchHomeData();
}, [fetchHomeData]);


  if (loading && homeData.categories.length === 0) {
    return <LoadingScreen />; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeroSection
        userLocation={userLocation}
        onLocationChange={setUserLocation}
        onUseLocation={handleGeolocation}
        onSearch={handleSearch}
        searchSuggestions={searchSuggestions}
        showSuggestions={showSuggestions}
        onHideSuggestions={() => setShowSuggestions(false)}
        onSuggestionSelect={(suggestion) => {
          if (suggestion.type === "category") {
            handleCategorySelect(suggestion.id, suggestion.name);
          } else {
            handleSearch(suggestion.name);
          }
          setShowSuggestions(false);
        }}
        isScrolled={isScrolled}
      />

      <main className="">
        {error && (
          <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <SearchFilterBar
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          userLocation={userLocation}
          onSearchChange={(query) => {
            setSearchQuery(query);
            fetchSearchSuggestions(query);
          }}
          onCategoryChange={handleCategorySelect}
          onLocationChange={(location) => {
            setUserLocation(location);
            fetchHomeData({ userLocation: location });
          }}
          categories={homeData.categories}
        />
  <Trendingtags />
 <TopCategoriesSection1  topcategories={topcategories} 
          onCategorySelect={handleCategorySelect}/>
      
 <div id="latest-listings">
          <ListingsGrid
             listings={homeData.listings}
  onInquiryClick={(listing) => {
    router.push(`/listings/${listing.id}`);
  }}
            userLocation={userLocation}
           
            onLoadMore={() => {
              const nextPage = Math.floor(homeData.listings.length / 20) + 1;
              fetchHomeData({ page: nextPage });
            }}
            loading={loading}
            hasMore={
              homeData.listings.length < (homeData.stats?.totalListings || 0)
            }
          />
        </div>
            <CategoryGrid
          categories={homeData.categories}
          onCategoryClick={handleCategorySelect}
          loading={loading}
        />

        <StatsSection stats={homeData.stats} />
         


        {/* <CategoriesLandingPage 
          topcategories={topcategories} 
          onCategorySelect={handleCategorySelect}
        /> */}

    
       
        <TopCategoriesSection2  topcategories={topcategories} 
          onCategorySelect={handleCategorySelect}/>
          <TopCategoriesSection3  topcategories={topcategories} 
          onCategorySelect={handleCategorySelect}/>

        {homeData.reviews.length > 0 && (
          <ReviewsSection reviews={homeData.reviews} />
        )}
      </main>
    </div>
  );
}

// Export individual components for use in other files
export { 
  LoadingScreen,
  HeroSection,
  SearchFilterBar,
  StatsSection,
  TopCategoriesSection1,
  TopCategoriesSection2,
  TopCategoriesSection3,
  CategoryGrid,
  ListingsGrid,
  ReviewsSection,
  CategoriesLandingPage
};