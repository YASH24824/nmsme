"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getListingById } from "@/app/api/adminApi";

export default function ProductsDetails() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useParams();
  const router = useRouter();
  const listingId = params.id;
  
  useEffect(() => {
    if (listingId) {
      fetchListingDetails();
    }
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const response = await getListingById(listingId);
      console.log(response.data);
      setListing(response.data || null);
      // Set first image as default selected
      if (response.data?.listing_media?.length > 0) {
        setSelectedImage(0);
      }
    } catch (error) {
      console.error("Error fetching listing details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800 border border-green-200", label: "Active" },
      inactive: { color: "bg-red-100 text-red-800 border border-red-200", label: "Inactive" },
      pending: { color: "bg-yellow-100 text-yellow-800 border border-yellow-200", label: "Pending" },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709V14a4 4 0 014-4h2a4 4 0 014 4v4.291z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/admin/products")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/products")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            {getStatusBadge(listing.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
         {listing.listing_media && listing.listing_media.length > 0 && (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Product Images
    </h2>

    {/* Main Image Preview */}
    <div className="mb-6">
      <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${listing.listing_media[selectedImage]?.file_path}`}
          alt={listing.title}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
    </div>

    {/* Thumbnail Gallery */}
    <div className="flex flex-wrap gap-3 justify-center">
      {listing.listing_media.map((media, index) => (
        <button
          key={media.media_id || index}
          onClick={() => setSelectedImage(index)}
          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
            selectedImage === index
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${media.file_path}`}
            alt={`${listing.title} - Image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </button>
      ))}
    </div>

    {/* Image Counter */}
    <div className="text-center mt-4">
      <span className="text-sm text-gray-600">
        Image {selectedImage + 1} of {listing.listing_media.length}
      </span>
    </div>
  </div>
)}


          {/* Product Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <p className="text-gray-900 font-medium">{listing.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <p className="text-gray-900 capitalize font-medium">
                  {listing.service_type?.replace("_", " ") || "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pricing & Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Model
                </label>
                <p className="text-gray-900 capitalize font-medium">
                  {listing.pricing_model?.replace("_", " ") || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <p className="text-gray-900 font-medium">
                  ${listing.min_price?.toLocaleString() || "0"} - $
                  {listing.max_price?.toLocaleString() || "0"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <p className="text-gray-900 font-medium">{listing.estimated_timeline || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Service Areas & Tags */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Areas & Tags
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {listing.service_cities ?.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {area}
                    </span>
                  )) || <span className="text-gray-500">No service areas specified</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {listing.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200"
                    >
                      {tag}
                    </span>
                  )) || <span className="text-gray-500">No tags specified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Seller Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <p className="text-gray-900 font-medium">{listing.seller?.business_name || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  listing.seller?.verification_status === "verified"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : listing.seller?.verification_status === "pending"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                  {listing.seller?.verification_status || "Unknown"}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Plan
                </label>
                <p className="text-gray-900 capitalize font-medium">
                  {listing.seller?.subscription_plan || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business
                </label>
                <p className="text-gray-900 font-medium">
                  {listing.seller?.years_in_business || "0"} years
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <p className="text-gray-900 leading-relaxed">
                  {listing.seller?.business_description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Performance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {listing.view_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Leads</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {listing.lead_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Featured</span>
                <span className={`font-semibold text-lg ${
                  listing.featured ? "text-green-600" : "text-gray-600"
                }`}>
                  {listing.featured ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dates</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {listing.created_at ? formatDate(listing.created_at) : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <p className="text-gray-900 text-sm font-medium">
                  {listing.updated_at ? formatDate(listing.updated_at) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Category Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <p className="text-gray-900 font-medium">
                  {listing.category?.category_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-gray-900 text-sm">
                  {listing.category?.description || "No description available"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  listing.category?.is_active 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                  {listing.category?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}