// components/admin/categories/CategoriesManagement.jsx
"use client";

import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminApi";
import toast from "react-hot-toast";
import CreateCategoryForm from "@/app/components/admin/CreateCategories";
import EditCategoryForm from "@/app/components/admin/EditCategories";

// Loading Screen Component
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


const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [parentSearchTerm, setParentSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // "all" or "parent"

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create category handler
  const handleCreateCategory = async (formDataPayload) => {
    try {
      setSubmitting(true);

      // Pass FormData directly
      await createCategory(formDataPayload);

      setShowCreateModal(false);
      fetchCategories();
      toast.success("Category created!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  // Update category handler
  // Update category handler
  const handleUpdateCategory = async (formData) => {
    try {
      setSubmitting(true);
      await updateCategory(selectedCategory.category_id, formData);
      setShowEditModal(false);
      setSelectedCategory(null);
      fetchCategories();
      toast.success("Category updated!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory.category_id);
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
      toast.success("Category deleted!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const getParentCategories = () => {
    return categories.filter((category) => !category.parent_category_id);
  };

  const getChildCategories = (parentId) => {
    return categories.filter(
      (category) => category.parent_category_id === parentId
    );
  };

  const handleViewChildCategories = (parentCategory) => {
    setSelectedParentCategory(parentCategory);
    setViewMode("parent");
  };

  const handleBackToAll = () => {
    setSelectedParentCategory(null);
    setViewMode("all");
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        Inactive
      </span>
    );
  };

  const getParentCategoryName = (parentId) => {
    if (!parentId) return "None";
    const parent = categories.find((cat) => cat.category_id === parentId);
    return parent ? parent.category_name : "Unknown";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter parent categories based on search
  const filteredParentCategories = getParentCategories().filter((category) => {
    return category.category_name
      ?.toLowerCase()
      .includes(parentSearchTerm.toLowerCase());
  });

  // Filter categories based on search
  const filteredCategories = categories.filter((category) => {
    return category.category_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // Get categories to display based on current view mode
  const getDisplayCategories = () => {
    if (viewMode === "parent" && selectedParentCategory) {
      return getChildCategories(selectedParentCategory.category_id);
    }
    return filteredCategories;
  };

  // Show loading screen when loading
  if (loading && categories.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categories Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage product categories for sellers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Category
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Parent Categories
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {getParentCategories().length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Child Categories
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter((cat) => cat.parent_category_id).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Categories Grid with Search */}
      {viewMode === "all" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Parent Categories
            </h3>

            {/* Parent Categories Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search parent categories..."
                  value={parentSearchTerm}
                  onChange={(e) => setParentSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredParentCategories.map((parentCategory) => (
              <div
                key={parentCategory.category_id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 ml-3">
                    <h4 className="font-medium text-gray-900">
                      {parentCategory.category_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getChildCategories(parentCategory.category_id).length}{" "}
                      sub-categories
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {getStatusBadge(parentCategory.is_active)}
                  <button
                    onClick={() => handleViewChildCategories(parentCategory)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Categories
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
        {/* Table Header with Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Left Side - Title and Back Button */}
            <div className="flex items-center space-x-4">
              {viewMode === "parent" && selectedParentCategory ? (
                <>
                  <button
                    onClick={handleBackToAll}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to All Categories
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Child Categories of: {selectedParentCategory.category_name}
                  </h3>
                </>
              ) : (
                <h3 className="text-lg font-semibold text-gray-900">
                  Children Categories
                </h3>
              )}
            </div>

            {/* Right Side - Search Bar */}
            <div className="max-w-md">
              <div className="relative w-full max-w-md">
                {/* Search Icon */}
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {/* Input Field */}
                <input
                  type="text"
                  placeholder="Search categories by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getDisplayCategories()
                .filter((category) => category.parent_category_id !== null)
                .map((category) => (
                  <tr
                    key={category.category_id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {category.icon && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={category.icon}
                              alt={category.category_name}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.category_name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {getParentCategoryName(category.parent_category_id)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(category.is_active)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {getDisplayCategories().length === 0 && !loading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {viewMode === "parent"
                ? "No child categories found for this parent category."
                : "Get started by creating a new category."}
            </p>
            {viewMode === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Category Modal Component */}
      <CreateCategoryForm
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCategory}
        categories={categories}
        submitting={submitting}
      />

      {/* Edit Category Modal Component */}
      <EditCategoryForm
        showModal={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdateCategory}
        categories={categories}
        category={selectedCategory}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Category
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedCategory.category_name}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
