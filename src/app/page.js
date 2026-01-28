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
import { ChevronLeft, ChevronRight, X, Check, ArrowRight } from 'lucide-react';

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const panelRef = useRef(null);
  const heroRef = useRef(null);

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "Connect Local Businesses",
      subtitle: "Grow Together",
      description: "Discover verified suppliers, connect with qualified buyers, and grow your business through India's premier MSME networking platform.",
      backgroundImage: "/imm8.png",
      fullTitle: "Connect Local Businesses & Grow Together",
      fullDescription: "MSME Sahaay's networking platform connects you with thousands of verified businesses across India. Access real-time market insights, participate in exclusive business events, and leverage our intelligent matchmaking algorithm.",
      keyPoints: [
        "Verified Business Profiles with Trust Scores",
        "Real-time Market Insights & Analytics",
        "Intelligent Matchmaking Algorithm",
        "Exclusive Business Networking Events"
      ],
      ctaText: "Start Networking",
      ctaLink: "/network"
    },
    {
      id: 2,
      title: "Find Quality Suppliers",
      subtitle: "Build Your Network",
      description: "Access 5,000+ verified manufacturers, wholesalers, and service providers across India. Quality assured, delivery guaranteed.",
      backgroundImage: "/imm9.png",
      fullTitle: "Find Quality Suppliers & Build Your Network",
      fullDescription: "Our curated supplier database includes manufacturers, wholesalers, and service providers verified for quality and reliability. Each supplier undergoes a rigorous verification process to ensure business credibility.",
      keyPoints: [
        "Quality Verified Suppliers Only",
        "Competitive Pricing & Bulk Discounts",
        "End-to-End Delivery Tracking",
        "Verified Rating & Review System"
      ],
      ctaText: "Explore Suppliers",
      ctaLink: "/suppliers"
    },
    {
      id: 3,  
      title: "Expand Your Market",
      subtitle: "Reach New Customers",
      description: "Showcase your products to 15,000+ active business buyers. Increase your sales and grow your customer base exponentially.",
      backgroundImage: "/imm10.png",
      fullTitle: "Expand Your Market & Reach New Customers",
      fullDescription: "Expand your market reach with our powerful marketing tools and extensive buyer network. Showcase your products to thousands of verified business buyers across multiple industries.",
      keyPoints: [
        "Premium Product Showcase Pages",
        "Targeted Marketing Campaigns",
        "Advanced Sales Analytics Dashboard",
        "Automated Lead Generation System"
      ],
      ctaText: "Grow Your Business",
      ctaLink: "/grow"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    if (isAutoPlaying && heroSlides.length > 1 && !isPanelOpen) {
      autoPlayRef.current = setInterval(() => {
        setSlideDirection('right');
        setCurrentSlide(prev => 
          prev === heroSlides.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, heroSlides.length, isPanelOpen]);

  // Navigation functions
  const goToSlide = useCallback((index, direction = 'right') => {
    setSlideDirection(direction);
    setCurrentSlide(index);
    
    // Reset auto-play timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isAutoPlaying && !isPanelOpen) {
      autoPlayRef.current = setInterval(() => {
        setSlideDirection('right');
        setCurrentSlide(prev => 
          prev === heroSlides.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
  }, [heroSlides.length, isAutoPlaying, isPanelOpen]);

  const nextSlide = useCallback(() => {
    goToSlide(
      currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1,
      'right'
    );
  }, [currentSlide, goToSlide, heroSlides.length]);

  const prevSlide = useCallback(() => {
    goToSlide(
      currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1,
      'left'
    );
  }, [currentSlide, goToSlide, heroSlides.length]);

  // Open panel function (click anywhere on hero)
  const openPanel = useCallback((slideIndex) => {
    setCurrentSlide(slideIndex);
    setIsPanelOpen(true);
    setIsAutoPlaying(false);
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  // Close panel function
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setIsAutoPlaying(true);
  }, []);

  // Handle click anywhere on hero section to open panel
  useEffect(() => {
    const handleHeroClick = (event) => {
      // If panel is not open and click is on the hero container (not on buttons or dots)
      if (!isPanelOpen && heroRef.current && heroRef.current.contains(event.target)) {
        // Check if click is not on navigation elements
        const isNavigationElement = 
          event.target.closest('button') || 
          event.target.closest('a') ||
          event.target.closest('.carousel-nav') ||
          event.target.closest('.hero-cta');
        
        if (!isNavigationElement) {
          openPanel(currentSlide);
        }
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('click', handleHeroClick);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('click', handleHeroClick);
      }
    };
  }, [isPanelOpen, currentSlide, openPanel]);

  // Handle click outside panel on mobile (close panel when clicking outside)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Check if we're on mobile (panel should cover full width)
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          closePanel();
        } else {
          // On desktop, only close if click is on the left 50% (carousel side)
          if (heroRef.current && heroRef.current.contains(event.target)) {
            closePanel();
          }
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        closePanel();
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isPanelOpen, closePanel]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isPanelOpen) {
      setIsAutoPlaying(true);
    }
  };

  // Handle button click to open panel
  const handleCtaClick = (e) => {
    e.stopPropagation();
    openPanel(currentSlide);
  };

  return (
    <section className="relative w-full bg-white py-8 md:py-12 px-2 md:px-5">
      <div className="max-w-8xl mx-auto">
        {/* Hero Container with fixed height */}
        <div 
          ref={heroRef}
          className="relative w-full h-[500px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Carousel */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={heroSlides[currentSlide].id}
              initial={{ 
                opacity: 0,
                x: slideDirection === 'right' ? 100 : -100 
              }}
              animate={{ 
                opacity: 1,
                x: 0 
              }}
              exit={{ 
                opacity: 0,
                x: slideDirection === 'right' ? -100 : 100 
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <div className="relative w-full h-full">
                <Image
                  src={heroSlides[currentSlide].backgroundImage}
                  alt={heroSlides[currentSlide].title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0   " />
                
                {/* Content Overlay */}
                {/* <div className="absolute inset-0 flex items-center">
                  <div className="px-8 md:px-12 lg:px-16 max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
                        {heroSlides[currentSlide].subtitle}
                      </span>
                      
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {heroSlides[currentSlide].title}
                      </h1>
                      
                      <p className="text-base md:text-lg text-white/90 mb-6 max-w-xl">
                        {heroSlides[currentSlide].description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleCtaClick}
                          className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 group w-fit hero-cta"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="px-6 py-3 bg-transparent border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 w-fit hero-cta"
                        >
                          Watch Demo
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div> */}
                
                {/* Click Indicator */}
                {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white/80 text-sm animate-pulse">
                  <span>Click anywhere for details</span>
                 <ArrowRight className="w-4 h-4" />
                </div> */}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10 carousel-nav">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index, index > currentSlide ? 'right' : 'left');
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-6 bg-white' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          {heroSlides.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 carousel-nav"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 carousel-nav"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Content Panel */}
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                ref={panelRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 300
                }}
                className="absolute right-0 top-0 h-full w-full md:w-1/2 bg-white shadow-2xl z-20 overflow-hidden border-l border-gray-200"
              >
                <div className="h-full flex flex-col">
                  {/* Panel Header */}
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                          {heroSlides[currentSlide].fullTitle}
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base mt-1">
                          Detailed Information
                        </p>
                      </div>
                      
                      <button
                        onClick={closePanel}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                        aria-label="Close panel"
                      >
                        <X className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* Description */}
                    <div className="mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                        Overview
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {heroSlides[currentSlide].fullDescription}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                        Key Features
                      </h3>
                      <div className="space-y-2 md:space-y-3">
                        {heroSlides[currentSlide].keyPoints.map((point, index) => (
                          <div 
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-gray-700 text-sm md:text-base">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                      <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
                        <div className="text-base md:text-lg font-bold text-blue-700">10K+</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Businesses</div>
                      </div>
                      <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
                        <div className="text-base md:text-lg font-bold text-green-700">95%</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Success Rate</div>
                      </div>
                      <div className="text-center p-2 md:p-3 bg-purple-50 rounded-lg">
                        <div className="text-base md:text-lg font-bold text-purple-700">150+</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Cities</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <button className="w-full py-3 md:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group shadow-md">
                        <span className="text-sm md:text-base">{heroSlides[currentSlide].ctaText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <p className="text-center text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
                        No credit card required • Free 14-day trial
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
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
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    const slug = slugify(categoryName);
    router.push(`/categories/${slug}/${categoryId}`);
  };

  if (!topcategories || topcategories.length === 0) {
    return (
      <div className="w-full py-16 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Loading categories...</h2>
      </div>
    );
  }

  // Get three categories
  const firstCategory = topcategories[0] || {};
  const secondCategory = topcategories[1] || {};
  const thirdCategory = topcategories[2] || {};
  
  // Get subcategories for each (6 each)
  const subCategories0 = (firstCategory?.subcategories || []).slice(0, 6);
  const subCategories1 = (secondCategory?.subcategories || []).slice(0, 6);
  const subCategories2 = (thirdCategory?.subcategories || []).slice(0, 6);

  // Function to render each category section
  const renderCategorySection = (category, subCategories, index) => (
    <div key={category.id || index} className="max-w-7xl mx-auto px-6 border-t-5 border-blue-800 shadow-xs rounded-2xl mb-10">
      {/* Main Category Header */}
      <div className="mb-5 mt-5">
        <h1 className="text-3xl font-sans font-semibold text-[var(--color-black-darker)] pb-3">
          {category?.name || `Category ${index + 1}`}
        </h1>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl overflow-hidden mb-0.5">
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Side: Category Photo & Description */}
          <div className="lg:w-5/12 mb-5 p-4 rounded-xl">
            <div className="relative h-70 rounded-xl overflow-hidden shadow-lg mb-3">
              <Image
                src={category?.image_url || "/placeholder-category.jpg"}
                alt={category?.name || `Category ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-[var(--color-accent-800)] font-sans font-semibold leading-relaxed">
                {category?.name || `Category ${index + 1}`}
              </p>
              
              <div className="pt-0 mb-1">
                <button
                  onClick={() => handleCategoryClick(category.id, category.name)}
                  className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Subcategories Grid */}
          <div className="lg:w-7/12 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map((subCategory, subIndex) => (
                <div
                  key={subCategory.id || subIndex}
                  onClick={() => handleCategoryClick(subCategory.id, subCategory.name)}
                  className="bg-white rounded-xs p-3 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
                >
                  {/* Category Name */}
                  <h4 className="text-base font-semibold text-[var(--color-accent-800)] mb-3 text-center line-clamp-1">
                    {subCategory.name || `Subcategory ${subIndex + 1}`}
                  </h4>

                  <div className="flex gap-3">
                    {/* Left: Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={subCategory.image_url || "/placeholder-subcategory.jpg"}
                        alt={subCategory.name || `Subcategory ${subIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Right: Description */}
                    <div className="flex-1">
                      <p className="text-xs font-sans font-semibold text-[var(--color-accent-800)] line-clamp-4">
                        {subCategory.description || subCategory.name || "Explore quality products in this category."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-3xl font-semibold mb-8 text-gray-800">Top Categories</h2>

      {/* Render first category */}
      {firstCategory && renderCategorySection(firstCategory, subCategories0, 0)}
      
      {/* Render second category */}
      {secondCategory && renderCategorySection(secondCategory, subCategories1, 1)}
      
      {/* Render third category */}
      {thirdCategory && renderCategorySection(thirdCategory, subCategories2, 2)}
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

  const CATEGORIES_SECTION3 = [
    {
      title: "Travel Agencies",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=350&h=250&fit=crop&auto=format",
    },
    {
      title: "Adventure Trips",
      img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=350&h=250&fit=crop&auto=format",
    },
    {
      title: "Tour Guides",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&h=250&fit=crop&auto=format",
    },
    {
      title: "Luxury Resorts",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=350&h=250&fit=crop&auto=format",
    },
  ];

  const handleCategoryClick = (category) => {
    const slug = category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    onCategorySelect?.(category);

    router.push(`/categories/${slug}`);
  };

  return (
    <section className="py-20 bg-[var(--color-accent-50)]">
      {/* Heading */}
      <h2
        className="text-4xl md:text-5xl font-bold text-center mb-14
        bg-gradient-to-r from-[var(--color-accent-900)] to-[var(--color-accent-600)]
        bg-clip-text text-transparent"
      >
        Explore Travel
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {CATEGORIES_SECTION3.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(item.title)}
            className="group bg-white rounded-2xl p-8 cursor-pointer
            border border-[var(--color-accent-200)]
            shadow-md hover:shadow-2xl
            transition-all duration-300
            hover:-translate-y-2"
          >
            {/* Image */}
            <div
              className="mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden
              bg-[var(--color-accent-800)]
              flex items-center justify-center
              shadow-lg group-hover:scale-110
              transition-transform duration-300"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Title */}
            <h3
              className="text-center text-xl font-semibold
              text-[var(--color-accent-900)]
              group-hover:text-[var(--color-accent-600)]
              transition-colors"
            >
              {item.title}
            </h3>
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