"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Phone } from "lucide-react";

export default function ProductCard({ listing, className = "" }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getFirstImage = () => {
    if (!listing.listing_media || listing.listing_media.length === 0)
      return null;
    const images = listing.listing_media
      .filter((m) => m.file_type === "image")
      .sort((a, b) => a.sort_order - b.sort_order);
    return images[0] || null;
  };

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const firstImage = getFirstImage();
  const bannerImageUrl = firstImage?.file_path
    ? `${baseUrl}${firstImage.file_path}`
    : null;

  const formatPrice = () =>
    listing.pricing_model === "custom_quote"
      ? "Custom Quote"
      : `₹${listing.max_price?.toLocaleString() || "0"}`;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#e4e5f7] ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-[#f2f3fb] to-[#e4e5f7]">
        {bannerImageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#e4e5f7] to-[#cdd0ef] animate-pulse" />
            )}
            <img
              src={bannerImageUrl}
              alt={listing.title}
              className={`w-full h-full object-cover ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = "none";
                setImageLoaded(true);
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#e4e5f7] to-[#cdd0ef] flex items-center justify-center">
            <div className="text-[#7A85C1] text-2xl">📦</div>
          </div>
        )}

        {/* Rating Badge */}
        {/* <div className="absolute top-2 left-2">
          <span className="bg-white/95 backdrop-blur-sm text-amber-600 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 shadow-sm border border-[#e4e5f7]">
            <Star className="w-3 h-3 fill-amber-500" />
            {listing.seller.overall_rating}
          </span>
        </div> */}
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-[#3B38A0] font-semibold text-sm mb-2">
          {formatPrice()}
        </p>

        {/* Location */}
        {listing.service_cities && (
          <div className="flex items-start gap-1 text-xs text-gray-600 mb-3">
            <MapPin className="w-3 h-3 text-[#7A85C1] mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {Array.isArray(listing.service_cities)
                ? listing.service_cities.join(", ")
                : listing.service_cities}
            </span>
          </div>
        )}

        {/* Stats & CTA */}
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{listing.view_count || 0} views</span>
            <span>•</span>
            <span>{listing.lead_count || 0} leads</span>
          </div> */}

          <Link
            href={`/listings/${listing.listing_id}`}
            className="flex items-center gap-1 bg-[#3B38A0] hover:bg-[#1A2A80] text-white text-xs px-3 py-1.5 rounded transition-colors duration-200"
          >
            <Phone className="w-3 h-3" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
