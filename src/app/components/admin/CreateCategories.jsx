"use client";

import { useState } from "react";

const CreateCategoryForm = ({
  showModal,
  onClose,
  onSubmit,
  categories,
  submitting,
}) => {
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
    parent_category_id: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.category_name.trim()) {
      errors.category_name = "Category name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Create FormData with exact field names
    const submitData = new FormData();
    submitData.append("category_name", formData.category_name);
    submitData.append("description", formData.description);
    submitData.append("parent_category_id", formData.parent_category_id || "");
    submitData.append("sort_order", "0");
    submitData.append("is_active", "true");
    
    // Append image with correct field name
    if (selectedImage) {
      submitData.append("image", selectedImage);
    }

    onSubmit(submitData);
    
    // Reset form after successful submission
    setFormData({
      category_name: "",
      description: "",
      parent_category_id: null,
    });
    setSelectedImage(null);
  };

  const resetForm = () => {
    setFormData({
      category_name: "",
      description: "",
      parent_category_id: null,
    });
    setFormErrors({});
    setSelectedImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Category
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) =>
                handleFormChange("category_name", e.target.value)
              }
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                formErrors.category_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="Enter category name"
            />
            {formErrors.category_name && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.category_name}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Image
            </label>
            <div className="space-y-3">
              {selectedImage ? (
                <div className="flex items-center space-x-3 p-3 border-2 border-green-200 bg-green-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedImage.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedImage.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
              placeholder="Enter category description (optional)"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              value={formData.parent_category_id || ""}
              onChange={(e) =>
                handleFormChange(
                  "parent_category_id",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 bg-white"
            >
              <option value="">None (Main Category)</option>
              {categories
                .filter((cat) => !cat.parent_category_id)
                .map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {formData.parent_category_id
                ? "This will be a subcategory"
                : "This will be a main category"}
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;