"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getlistingfromsubcategories } from "../../../../api/homeAPI";
import { Package, ArrowLeft, MapPin, User, Eye, Star } from "lucide-react";

const SubcategoryListingsPage = () => {
  const { subCategoryId } = useParams();
  const router = useRouter();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getlistingfromsubcategories(subCategoryId);

        console.log("API response:", res.data);
        const list = res.data?.data?.listings || [];

        if (Array.isArray(list) && list.length > 0) {
          setListings(list);
          // Extract subcategory data from first listing
          setSubcategoryData({
            name: list[0].subcategory,
            image: list[0].subcategory_image,
            category: list[0].category
          });
        } else {
          setListings([]);
          setSubcategoryData(null);
        }

      } catch (err) {
        console.error("Error loading listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (subCategoryId) fetchListings();
  }, [subCategoryId]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-accent-100)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-800)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-accent-700)] font-sans">Loading listings...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-accent-100)]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-xl font-sans font-semibold text-[var(--color-accent-900)] mb-2">
            Error loading listings
          </h2>
          <p className="text-[var(--color-accent-700)] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white font-sans font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-accent-100)]">
      {/* Cover Section with Subcategory Image */}
      {subcategoryData && (
        <section className="relative h-64 sm:h-80 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={subcategoryData.image}
              alt={subcategoryData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-900)]/70 to-[var(--color-accent-800)]/70" />
          </div>
          
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-semibold mb-3">
                {subcategoryData.name}
              </h1>
              <p className="text-white/90 font-sans text-lg">
                {subcategoryData.category}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Listings Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/categories')}
              className="flex items-center gap-2 text-[var(--color-accent-800)] hover:text-[var(--color-accent-900)] font-sans font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            {/* <h2 className="text-3xl font-sans font-semibold text-[var(--color-accent-900)] mb-3">
              Available Listings
            </h2>
            <p className="text-lg text-[var(--color-accent-700)] font-sans">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} available
            </p> */}
          </div>

          {/* No Listings State */}
          {listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[var(--color-accent-100)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-accent-200)]">
                <Package className="w-10 h-10 text-[var(--color-accent-600)]" />
              </div>
              <h3 className="text-xl font-sans font-semibold text-[var(--color-accent-900)] mb-3">
                No Listings Found
              </h3>
              <p className="text-[var(--color-accent-700)] font-sans max-w-md mx-auto mb-8">
                There are currently no listings available for this subcategory.
              </p>
              <button
                onClick={() => router.push('/categories')}
                className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white font-sans font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Browse Categories
              </button>
            </div>
          ) : (
            /* Listings Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {listings.map((item) => {
                const bannerImage = item.image || item.subcategory_image;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-[var(--color-accent-200)] overflow-hidden transition-all duration-300 hover:scale-[1.02] group flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={bannerImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      
                      {/* Views Badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div className="flex items-center gap-1 text-xs font-sans font-semibold text-[var(--color-accent-900)]">
                          <Eye className="w-3 h-3" />
                          {item.views || 0}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="font-sans font-semibold text-[var(--color-accent-900)] text-lg mb-2 line-clamp-2 group-hover:text-[var(--color-accent-800)] transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[var(--color-accent-700)] font-sans text-sm mb-4 line-clamp-3 flex-1">
                        {item.description || "No description available"}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-xl font-sans font-bold text-[var(--color-accent-900)]">
                          {item.price || "₹0"}
                        </span>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-accent-700)]">
                          <User className="w-4 h-4" />
                          <span className="font-sans">{item.seller || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-accent-700)]">
                          <MapPin className="w-4 h-4" />
                          <span className="font-sans">
                            {item.location?.join(", ") || "Remote"}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-accent-200)] mt-auto">
                        <div className="flex items-center gap-1 text-sm text-[var(--color-accent-600)]">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-sans">{item.rating || 0}</span>
                        </div>
                        
                        <button
                          onClick={() => router.push(`/listings/${item.id}`)}
                          className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white font-sans font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubcategoryListingsPage;