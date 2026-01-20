"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getsubCategories } from "../../../api/homeAPI";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Star, 
  Shield,
  ChevronRight,
  Building2,
  Briefcase
} from "lucide-react";

const CategoryPage = () => {
  const { categoryId, categorySlug } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modern color palette
  const COLOR_PALETTES = [
    { gradient: "from-blue-600 to-purple-700", accent: "bg-blue-500", text: "text-blue-600" },
    { gradient: "from-emerald-600 to-teal-700", accent: "bg-emerald-500", text: "text-emerald-600" },
    { gradient: "from-amber-600 to-orange-700", accent: "bg-amber-500", text: "text-amber-600" },
    { gradient: "from-rose-600 to-pink-700", accent: "bg-rose-500", text: "text-rose-600" },
    { gradient: "from-indigo-600 to-violet-700", accent: "bg-indigo-500", text: "text-indigo-600" },
    { gradient: "from-cyan-600 to-blue-700", accent: "bg-cyan-500", text: "text-cyan-600" },
  ];

  const SUBCATEGORY_ICONS = [
    <Briefcase className="w-6 h-6" />,
    <Users className="w-6 h-6" />,
    <TrendingUp className="w-6 h-6" />,
    <Shield className="w-6 h-6" />,
    <Star className="w-6 h-6" />,
    <Building2 className="w-6 h-6" />,
  ];

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getsubCategories(categoryId);
        const parent = res.data.data?.parent_category;
        const data = res.data.data?.subcategories;

        console.log("Parent category:", parent);
        console.log("Subcategories data:", data);
        
        setParentCategory(parent);
        setSubcategories(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchSubcategories();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Professional Services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Category</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getColorPalette = (index) => COLOR_PALETTES[index % COLOR_PALETTES.length];
  const getIcon = (index) => SUBCATEGORY_ICONS[index % SUBCATEGORY_ICONS.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Parent Category */}
      {parentCategory && (
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
          {/* Background Image with Reduced Overlay */}
          <div className="absolute inset-0">
            <img
              src={parentCategory.image}
              alt={parentCategory.name}
              className="w-full h-full object-cover"
            />
            {/* Reduced opacity for better image visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-gray-800/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-gray-900/20"></div>
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm mb-4">
                <Link
                  href="/categories"
                  className="text-white/90 font-sans hover:text-white transition-colors"
                >
                  Categories
                </Link>
                <ChevronRight className="w-4 h-4 text-white/70" />
                <span className="text-white font-sans">{parentCategory.name}</span>
              </div>
              
              <h1 className="text-4xl md:text-4xl lg:text-5xl font-sans font-semibold mb-6 leading-tight">
                {parentCategory.name}
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                {parentCategory.description || "Premium professional services for your business growth and success"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Subcategories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-3xl font-sans font-semibold text-[var(--color-accent-900)] mb-4">
              Professional Services
            </h2>
            <p className="text-lg font-sans text-[var(--color-accent-800)] max-w-2xl mx-auto">
              Browse through our curated list of professional services to find the perfect expertise for your business needs.
            </p>
          </div>

          {/* Subcategories Grid */}
          {subcategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subcategories.map((subcategory, index) => {
                const colors = getColorPalette(index);
                const icon = getIcon(index);

                return (
                  <Link
                    key={subcategory.id}
                    href={`/categories/subcategory/${subcategory.id}/listings`}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02] h-full flex flex-col border border-gray-100">
                      {/* Image Section with Reduced Overlay */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={subcategory.image || parentCategory?.image}
                          alt={subcategory.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Reduced overlay for better image visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Icon with subtle background */}
                        {/* <div className={`absolute top-4 right-4 ${colors.accent} text-white p-2 rounded-lg bg-opacity-80 backdrop-blur-sm`}>
                          {icon}
                        </div> */}
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-xl font-sans font-semibold text-[var(--color-accent-900)] mb-3 group-hover:text-[var(--color-accent-800)] transition-colors">
                            {subcategory.name}
                          </h3>
                          
                          <p className="text-[var(--color-accent-700)] leading-relaxed mb-4 line-clamp-3">
                            {subcategory.description || `Professional ${subcategory.name} services for your business needs`}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            {/* <div className={`w-2 h-2 rounded-full ${colors.accent}`}></div> */}
                            <span className="text-sm font-medium text-gray-700">
                              {subcategory.listing_count || 0} {subcategory.listing_count === 1 ? 'Service' : 'Services'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[var(--color-accent-900)] text-sm font-semibold group-hover:text-[var(--color-accent-700)] transition-colors">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Available</h3>
              <p className="text-gray-500">Check back later for professional services in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section with Reduced Opacity */}
   
    </div>
  );
};

export default CategoryPage;