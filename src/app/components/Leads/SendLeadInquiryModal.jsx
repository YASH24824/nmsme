"use client";

import React from "react";
import { X, Mail } from "lucide-react";

const LeadInquiryModal = ({
  showLeadForm,
  setShowLeadForm,
  leadForm,
  handleInputChange,
  handleLeadSubmit,
  formLoading,
}) => {
  const budgetOptions = [
    { value: "under_1k", label: "Under ₹1,000" },
    { value: "k_1_5", label: "₹1,000 - ₹5,000" },
    { value: "k_5_10", label: "₹5,000 - ₹10,000" },
    { value: "k_10_25", label: "₹10,000 - ₹25,000" },
    { value: "k_25_50", label: "₹25,000 - ₹50,000" },
    { value: "k_50_100", label: "₹50,000 - ₹100,000" },
    { value: "k_100_plus", label: "₹100,000+" },
  ];

  const timelineOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "weeks_1_2", label: "1-2 Weeks" },
    { value: "month_1", label: "1 Month" },
    { value: "flexible", label: "Flexible" },
  ];

  const contactOptions = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "video_call", label: "Video Call" },
    { value: "in_person", label: "In Person" },
  ];

  if (!showLeadForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowLeadForm(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        {/* Modal Content */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Send Inquiry
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Get in touch with the service provider
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLeadForm(false)}
              className="p-2 hover:bg-gray-100/50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Form */}
          <div className="overflow-y-auto px-6 md:px-8 py-6 md:py-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <form onSubmit={handleLeadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="project_title"
                    value={leadForm.project_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your project title"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="project_description"
                    value={leadForm.project_description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200"
                    placeholder="Describe your project requirements..."
                  />
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Budget Range *
                    </label>
                    <select
                      name="budget_range"
                      value={leadForm.budget_range}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Budget</option>
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Timeline *
                    </label>
                    <select
                      name="timeline"
                      value={leadForm.timeline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Timeline</option>
                      {timelineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Preference */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Preferred Contact Method *
                  </label>
                  <select
                    name="contact_preference"
                    value={leadForm.contact_preference}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select Contact Method</option>
                    {contactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Requirements */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Additional Requirements
                  </label>
                  <textarea
                    name="custom_requirements"
                    value={leadForm.custom_requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200"
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                {/* Urgent Project */}
                <div className="flex items-center space-x-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200/30">
                  <input
                    type="checkbox"
                    name="is_urgent"
                    checked={leadForm.is_urgent}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500/20 focus:ring-2"
                  />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      This is an urgent
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Get priority response from the service provider
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-6">
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="w-full md:w-1/2 px-6 py-4 border border-gray-300/50 text-gray-700 rounded-xl font-semibold hover:bg-gray-50/50 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full md:w-1/2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {formLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Send Inquiry</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadInquiryModal;
