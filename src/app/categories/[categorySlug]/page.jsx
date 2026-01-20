"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getsubCategories } from "../../api/homeAPI";

export default function CategoryPage() {
  const router = useRouter();
  const { id } = useParams(); // <-- Extracting URL param correctly

  const [category, setCategory] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [subcategories, setSubcategories] = useState([]);

  // -------------------------- FIXED API CALL -------------------------
  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const body = { id }; // Passing ID in body instead of params
        const response = await getsubCategories(body);

        if (response?.data?.subcategories) {
          setSubcategories(response.data.subcategories);
        } else {
          console.warn("Invalid API format:", response);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (id) fetchSubcategory();
  }, [id]);

  // --------------------- FIX CATEGORY LOADING--------------------------
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 500));

      const categoryData = CATEGORIES_DATA[id]; // <-- FIX: use `id` not params.id

      if (categoryData) {
        setCategory(categoryData);
        setListings(MOCK_LISTINGS);
      } else {
        setCategory(null);
      }

      setLoading(false);
    };

    if (id) fetchCategoryData();
  }, [id]);

  // ---------------- FILTER LISTINGS ----------------
  const filteredListings = listings.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------------- UI LOADER ----------------
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex justify-center items-center text-xl">
  //       Loading Category...
  //     </div>
  //   );
  // }

  // ---------------- NOT FOUND ----------------
  if (!category) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <p className="text-lg font-semibold">Category Not Found ❌</p>
        <button
          onClick={() => router.push("/categories")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold">{category?.name}</h1>

      {/* Debug to see if subcategories are coming */}
      <pre className="bg-gray-100 p-4 rounded mt-4 text-sm">
        {JSON.stringify(subcategories, null, 2)}
      </pre>
    </div>
  );
}
