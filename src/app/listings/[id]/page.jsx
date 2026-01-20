"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle,
  Award,
  Clock,
  Shield,
  Download,
  Share2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getListingById } from "@/app/api/productsAPI";
import { createLead } from "@/app/api/leadAPI";
import LeadInquiryModal from "@/app/components/Leads/SendLeadInquiryModal";

// Define LoadingScreen as a separate component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#e4e5f7] border-t-[#3B38A0] rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#3B38A0] rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading MSME Guru...</p>
      </div>
    </div>
  );
}

export default function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [images, setImages] = useState([]);

  const [leadForm, setLeadForm] = useState({
    project_title: "",
    project_description: "",
    budget_range: "",
    timeline: "",
    contact_preference: "",
    custom_requirements: "",
    is_urgent: false,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await getListingById(id);
        const data = res.data;
        console.log("Listing data:", data);

        const parsedListing = {
          ...data,
          service_areas:
            typeof data.service_areas === "string"
              ? JSON.parse(data.service_areas)
              : data.service_areas || [],
          tags:
            typeof data.tags === "string"
              ? JSON.parse(data.tags)
              : data.tags || [],
        };

        setListing(parsedListing);

        // Safely handle listing_media
        const listingMedia = data.listing_media || [];
        const sortedImages = listingMedia.sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
        );
        setImages(sortedImages);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // Auto-slide effect
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const slider = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(slider);
  }, [images]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await createLead({
        ...leadForm,
        listing_id: parseInt(id),
      });

      toast.success("Inquiry sent!");
      setShowLeadForm(false);
      setLeadForm({
        project_title: "",
        project_description: "",
        budget_range: "",
        timeline: "",
        contact_preference: "",
        custom_requirements: "",
        is_urgent: false,
      });
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("Failed to send inquiry");
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeadForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Use the custom LoadingScreen
  if (loading) {
    return <LoadingScreen />;
  }

  if (!listing)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Data not found.</p>
      </div>
    );

  const formatPrice = () => {
    if (listing.pricing_model === "custom_quote") {
      return "Custom Quote";
    }
    return `₹${listing.min_price?.toLocaleString() || "0"} - ₹${
      listing.max_price?.toLocaleString() || "0"
    }`;
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "quick-info", label: "Quick Info" },
    { id: "reviews", label: "Reviews" },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const downloadImage = (imagePath) => {
    if (!imagePath) {
      toast.error("No image to download");
      return;
    }

    const link = document.createElement("a");
    link.href = `${baseUrl}${imagePath}`;
    link.download = `${listing.title || "listing"}-image-${
      currentImageIndex + 1
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareListing = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title || "MSME Guru Listing",
          text: listing.description || "Check out this service on MSME Guru",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Lead Inquiry Modal Component */}
      <LeadInquiryModal
        showLeadForm={showLeadForm}
        setShowLeadForm={setShowLeadForm}
        leadForm={leadForm}
        handleInputChange={handleInputChange}
        handleLeadSubmit={handleLeadSubmit}
        formLoading={formLoading}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {images.length > 0 && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            {/* ZOOM MODAL */}
            {zoomImage && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setZoomImage(null)}
              >
                <button
                  className="absolute top-6 right-6 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors z-10"
                  onClick={() => setZoomImage(null)}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>

                <img
                  src={zoomImage}
                  alt="Zoomed view"
                  className="max-w-[95%] max-h-[90%] rounded-lg shadow-lg object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ⭐ MAIN IMAGE */}
              <div className="lg:col-span-2 relative">
                <div
                  className="relative h-80 sm:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-[#f2f3fb] to-[#e4e5f7] cursor-zoom-in"
                  onClick={() => {
                    if (images[currentImageIndex]?.file_path) {
                      setZoomImage(
                        `${baseUrl}${images[currentImageIndex].file_path}`
                      );
                    }
                  }}
                >
                  {images[currentImageIndex]?.file_path ? (
                    <img
                      src={`${baseUrl}${images[currentImageIndex].file_path}`}
                      alt={`${listing.title || "Listing"} - Image ${
                        currentImageIndex + 1
                      }`}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-[#7A85C1]" />
                    </div>
                  )}

                  {/* Prev Button */}
                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow hover:scale-110 transition-all border border-gray-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                  )}

                  {/* Next Button */}
                  {images.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow hover:scale-110 transition-all border border-gray-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  )}

                  {/* Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}

                  {/* Download + Share */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (images[currentImageIndex]?.file_path) {
                          downloadImage(images[currentImageIndex].file_path);
                        }
                      }}
                      className="bg-white/90 p-2.5 rounded-md shadow hover:bg-white transition-all border border-gray-200 hover:scale-105"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareListing();
                      }}
                      className="bg-white/90 p-2.5 rounded-md shadow hover:bg-white transition-all border border-gray-200 hover:scale-105"
                      title="Share listing"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Zoom Hint */}
                  <div className="absolute top-4 left-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded text-sm font-medium backdrop-blur-sm border border-gray-200 opacity-0 hover:opacity-100 transition-opacity">
                    Click to zoom
                  </div>
                </div>
              </div>

              {/* ⭐ THUMBNAILS */}
              {images.length > 1 && (
                <div className="lg:col-span-1">
                  <div className="grid grid-cols-2 gap-3">
                    {images.slice(0, 4).map((image, index) => (
                      <button
                        key={image.listing_media_id || index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 relative ${
                          currentImageIndex === index
                            ? "border-[#3B38A0] ring-2 ring-[#e4e5f7] shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={`${baseUrl}${image.file_path}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Show + count overlay on the 4th image when there are more than 4 images */}
                        {index === 3 && images.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-lg font-bold">
                                +{images.length - 4}
                              </div>
                              <div className="text-xs mt-1">More</div>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImageIndex === index
                            ? "bg-[#3B38A0] w-6"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile strip */}
            {images.length > 1 && (
              <div className="mt-6 lg:hidden">
                <h3 className="text-sm font-semibold mb-3 text-gray-800">
                  All Photos
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-3">
                  {images.map((image, index) => (
                    <button
                      key={image.listing_media_id || index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-[#3B38A0] ring-1 ring-[#e4e5f7] shadow-sm"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={`${baseUrl}${image.file_path}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {listing.title || "Untitled Listing"}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center bg-[#f2f3fb] text-[#1A2A80] px-3 py-1 rounded-md text-sm font-semibold border border-[#e4e5f7]">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {listing.seller?.overall_rating || 0}
                  <span className="text-[#585ea9] mx-2">•</span>
                  <span className="text-[#585ea9] font-normal">
                    {listing.lead_count || 0} Leads
                  </span>
                </div>

                {listing.featured && (
                  <span className="bg-[#f2f3fb] text-[#1A2A80] px-2 py-1 rounded-md text-sm font-medium border border-[#e4e5f7]">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Location & Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-[#3B38A0]" />
                  <span>
                    {Array.isArray(listing.service_cities)
                      ? listing.service_cities.join(", ")
                      : listing.service_cities || "N/A"}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-[#3B38A0]" />
                  <span>
                    Timeline: {listing.estimated_timeline || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {listing.seller?.user?.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-[#3B38A0]" />
                      <span>{listing.seller.user.phone}</span>
                    </div>
                  )}
                  {listing.seller?.user?.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-[#3B38A0]" />
                      <span>{listing.seller.user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price & Stats */}
            <div className="mt-4 lg:mt-0 lg:text-right">
              <div className="text-2xl font-bold text-[#1A2A80] mb-2">
                {formatPrice()}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center justify-end">
                  <Eye className="w-4 h-4 mr-2 text-[#7A85C1]" />
                  <span>{listing.view_count || 0} Views</span>
                </div>
                <div className="flex items-center justify-end">
                  <Users className="w-4 h-4 mr-2 text-[#7A85C1]" />
                  <span>{listing.lead_count || 0} Active Leads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowLeadForm(true)}
              className="bg-[#3B38A0] hover:bg-[#1A2A80] text-white px-6 py-3 rounded-md font-semibold flex items-center transition-all shadow-sm hover:shadow-md"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Inquiry
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#3B38A0] text-[#3B38A0]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 border-t-0">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Service Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {listing.description || "No description available."}
                  </p>

                  {/* Seller Info */}
                  <div className="mt-6 p-4 bg-[#f2f3fb] rounded-md border border-[#e4e5f7]">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      About {listing.seller?.business_name || "the seller"}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {listing.seller?.business_description ||
                        "No business description available."}
                    </p>
                    {listing.seller?.user?.bio && (
                      <p className="text-gray-700 mt-2">
                        <strong className="text-gray-900">Bio:</strong>{" "}
                        {listing.seller.user.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Service Type</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {listing.service_type?.replace("_", " ") ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Pricing Model</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {listing.pricing_model?.replace("_", " ") ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900">
                        {listing.category?.category_name || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Subcategory</span>
                      <span className="font-medium text-gray-900">
                        {listing.subcategory?.category_name || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`font-medium ${
                          listing.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {listing.status || "unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {listing.tags?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Tags & Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {listing.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#f2f3fb] text-[#3B38A0] px-3 py-1 rounded-md text-sm font-medium border border-[#e4e5f7]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Locations */}
              {(listing.service_countries?.length > 0 ||
                listing.service_states?.length > 0 ||
                listing.service_cities?.length > 0) && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Service Locations
                  </h3>
                  <div className="p-4 bg-[#f2f3fb] rounded-md border border-[#e4e5f7]">
                    <div className="space-y-2">
                      {listing.service_countries?.length > 0 && (
                        <div className="text-gray-700">
                          <strong>Country:</strong>{" "}
                          {listing.service_countries.join(", ")}
                        </div>
                      )}
                      {listing.service_states?.length > 0 && (
                        <div className="text-gray-700">
                          <strong>State:</strong>{" "}
                          {listing.service_states.join(", ")}
                        </div>
                      )}
                      {listing.service_cities?.length > 0 && (
                        <div className="text-gray-700">
                          <strong>City:</strong>{" "}
                          {listing.service_cities.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Services Offered
              </h3>
              <div className="space-y-4">
                {/* Main Service */}
                <div className="p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {listing.title || "Service"}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {listing.description || "No description available."}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                        <span className="bg-[#f2f3fb] text-[#3B38A0] px-2 py-1 rounded-md font-medium">
                          {listing.service_type?.replace("_", " ") || "Service"}
                        </span>
                        <span className="font-semibold text-[#1A2A80]">
                          {formatPrice()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Features */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">Quality Assurance</span>
                    </div>
                    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
                      <Clock className="w-4 h-4 text-[#3B38A0] mr-2" />
                      <span className="text-gray-700">On-time Delivery</span>
                    </div>
                    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
                      <Award className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-gray-700">
                        Professional Service
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
                      <Shield className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-gray-700">Secure & Reliable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Tab */}
          {activeTab === "quick-info" && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-[#f2f3fb] rounded-md border border-[#e4e5f7]">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Business Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business Since</span>
                        <span className="font-medium text-gray-900">
                          {listing.seller?.years_in_business || 0} Years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium text-gray-900">
                          Within 24 hours
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f2f3fb] rounded-md border border-[#e4e5f7]">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Service Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pricing Model</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {listing.pricing_model?.replace("_", " ") ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeline</span>
                        <span className="font-medium text-gray-900">
                          {listing.estimated_timeline || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#f2f3fb] rounded-md border border-[#e4e5f7]">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Company Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certifications</span>
                        <span className="font-medium text-gray-900">
                          {listing.seller?.certifications || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Verification Status
                        </span>
                        <span className="font-medium text-green-600 capitalize">
                          {listing.seller?.verification_status ||
                            "Not verified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f2f3fb] rounded-md border border-[#e4e5f7]">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Performance Metrics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overall Rating</span>
                        <span className="font-medium text-gray-900">
                          {listing.seller?.overall_rating || 0}/5
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Leads</span>
                        <span className="font-medium text-gray-900">
                          {listing.lead_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Customer Reviews
              </h3>

              {/* Rating Summary */}
              <div className="bg-[#f2f3fb] rounded-md border border-[#e4e5f7] p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {listing.seller?.overall_rating || 0}
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (listing.seller?.overall_rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      Based on customer feedback
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg text-gray-600 mb-2">No reviews yet</p>
                <p className="text-gray-500 mb-4">
                  Be the first to share your experience with this service!
                </p>
                <button className="bg-[#3B38A0] hover:bg-[#1A2A80] text-white px-6 py-2 rounded-md font-semibold transition-colors">
                  Write a Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
