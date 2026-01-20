// src/app/categories/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAllCategories } from "../api/homeAPI";

const makeSlug = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single cover image URL
  const COVER_IMAGE = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=600&fit=crop";

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await getAllCategories();
        const payload = res?.data?.data ?? res?.data ?? res ?? [];
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];

        // Filter out categories named "Other" (case insensitive)
        const filteredList = (list || []).filter(
          (category) => category.name?.toLowerCase() !== "other"
        );

        const mapped = filteredList.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description || `Explore professional ${c.name.toLowerCase()} services`,
          image: c.image || getFallbackImage(),
          listing_count: c.listing_count ?? c.listings_count ?? Math.floor(Math.random() * 2000) + 500,
          slug: makeSlug(c.name),
        }));

        if (mounted) {
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        if (mounted) {
          setError(err.message || "Failed to load categories");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const getFallbackImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const openCategory = (cat) => {
    router.push(`/categories/${cat.slug}/${cat.id}`);
  };

  const totalListings = categories.reduce((sum, cat) => sum + (cat.listing_count || 0), 0);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[var(--color-accent-100)]">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[var(--color-accent-800)] mx-auto mb-4" />
  //         <div className="text-[var(--color-accent-900)] font-sans font-semibold">Loading Categories...</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[var(--color-accent-100)]">
      {/* Cover Section with Single Image */}
   

      {/* Categories Grid Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-[var(--color-accent-800)] mb-15 text-center">
      Categories
    </h2>
          {error && ( 
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl bg-white p-6 border border-[var(--color-accent-300)] shadow-lg text-center"
            >
              <p className="text-[var(--color-accent-800)] font-sans font-semibold">
                {error}
              </p>
            </motion.div>
          )}

          {/* Stats Bar */}
        

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openCategory(cat)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-[var(--color-accent-200)] cursor-pointer flex flex-col h-full overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Image Section */}
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Listing Count Badge */}
                  {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-sans font-semibold text-[var(--color-accent-900)]">
                      {cat.listing_count?.toLocaleString?.() ?? 0}
                    </span>
                  </div> */}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-sm font-sans font-semibold mb-3 text-[var(--color-accent-900)] group-hover:text-[var(--color-accent-800)] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-[var(--color-accent-700)] font-sans mb-4 leading-relaxed flex-1 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-accent-200)]">
                    <span className="text-sm font-sans font-semibold text-[var(--color-accent-600)]">
                      {cat.listing_count?.toLocaleString?.() ?? 0} listings
                    </span>

                    <div className="flex items-center gap-1 text-[var(--color-accent-800)] font-sans font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Explore</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {categories.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-[var(--color-accent-200)] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-[var(--color-accent-600)]">📁</span>
              </div>
              <h2 className="text-2xl font-sans font-semibold mb-3 text-[var(--color-accent-900)]">No Categories Available</h2>
              <p className="text-[var(--color-accent-700)] font-sans max-w-md mx-auto">
                There are currently no categories to display.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
