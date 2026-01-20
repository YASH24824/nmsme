"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";

// Status configuration
const STATUS_CONFIG = {
  new: { color: "bg-green-500 text-white", label: "New" },
  contacted: { color: "bg-blue-500 text-white", label: "Contacted" },
  qualified: { color: "bg-purple-500 text-white", label: "Qualified" },
  proposal_sent: { color: "bg-yellow-500 text-white", label: "Proposal Sent" },
  negotiation: { color: "bg-orange-500 text-white", label: "Negotiation" },
  won: { color: "bg-emerald-500 text-white", label: "Won" },
  lost: { color: "bg-red-500 text-white", label: "Lost" },
};

const CHAT_FILTERS = {
  all: "All Leads",
  new: "New",
  in_progress: "In Progress",
  archived: "Archived",
};

const IN_PROGRESS_STATUSES = [
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiation",
];
const ARCHIVED_STATUSES = ["won", "lost"];

// Message types
const MESSAGE_TYPES = [
  { value: "initial_inquiry", label: "Initial Inquiry" },
  { value: "follow_up", label: "Follow Up" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
];

// Get user data safely
const getUserData = () => {
  if (typeof window === "undefined") return null;
  try {
    const userData = localStorage.getItem("user");
    if (!userData) {
      console.error("❌ No user data found in localStorage");
      return null;
    }
    return JSON.parse(userData);
  } catch (error) {
    console.error("❌ Error getting user data:", error);
    return null;
  }
};

// Date Separator Component
const DateSeparator = ({ date }) => {
  const getDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="bg-gray-200 px-3 py-1 rounded-full">
        <span className="text-xs text-gray-600 font-medium">
          {getDisplayDate(date)}
        </span>
      </div>
    </div>
  );
};

// Status Filter Bar Component
export const StatusFilterBar = ({
  activeFilter,
  onFilterChange,
  leadCounts,
}) => {
  return (
    <div className="bg-[#0C2B4E] px-4 md:px-6 py-3 md:py-4.5 border-b border-gray-300 flex-shrink-0">
      <div className="flex space-x-1 overflow-x-auto custom-scrollbar">
        {Object.entries(CHAT_FILTERS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center space-x-2 ${
              activeFilter === key
                ? "bg-white text-[#0C2B4E] shadow-sm border border-gray-300"
                : "text-white hover:bg-[#1a3a5f]"
            }`}
          >
            <span className="text-xs md:text-sm">{label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeFilter === key
                  ? "bg-[#0C2B4E] text-white"
                  : "bg-white text-[#0C2B4E]"
              }`}
            >
              {leadCounts[key] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Lead List Item Component
const LeadListItem = ({ lead, isActive, onClick, currentUserId }) => {
  const getUnreadCount = (lead) => {
    if (!lead.conversations) return 0;
    return lead.conversations.filter(
      (msg) => msg.participant_id === lead.buyer.user.user_id && !msg.is_read
    ).length;
  };

  const unreadCount = getUnreadCount(lead);

  const getLastMessageTime = () => {
    const lastConversation = lead.conversations?.[0];
    if (!lastConversation?.created_at) return "";
    const messageTime = new Date(lastConversation.created_at);
    const now = new Date();
    const diffHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return messageTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return messageTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div
      onClick={() => onClick(lead)}
      className={`flex items-center p-3 md:p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 flex-shrink-0 ${
        isActive
          ? "bg-gray-100 border-l-4 border-l-[#0C2B4E]"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex-shrink-0 relative">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0C2B4E] rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
          {lead.buyer?.user?.avatar_url ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lead.buyer?.user?.avatar_url}`}
              alt={lead.buyer.full_name || "User Avatar"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            getInitials(lead.buyer?.full_name)
          )}
        </div>
      </div>

      <div className="ml-3 flex-1 min-w-0 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {lead.project_title}
          </h3>
          <span className="text-xs text-gray-500 font-medium hidden sm:block">
            {STATUS_CONFIG[lead.status]?.label || lead.status}
          </span>
        </div>

        {/* Buyer Name + Unread Count */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">
            {lead.buyer?.full_name || "Unknown Buyer"}
          </p>
          {unreadCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">
              {unreadCount} New
            </span>
          )}
        </div>

        {/* Last Message + Time */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 sm:hidden">
              {STATUS_CONFIG[lead.status]?.label || lead.status}
            </span>
            <span className="text-xs text-gray-600 truncate max-w-[120px]">
              {lead?.conversations?.[0]?.message_text || "No messages yet"}
            </span>
          </div>
          <span className="text-xs text-gray-400">{getLastMessageTime()}</span>
        </div>
      </div>
    </div>
  );
};

// Lead List Component
export const LeadList = ({
  leads,
  activeFilter,
  selectedLead,
  onLeadSelect,
  unreadCounts,
  isLoading,
}) => {
  const getFilteredLeads = () => {
    switch (activeFilter) {
      case "new":
        return leads.filter((lead) => lead.status === "new");
      case "in_progress":
        return leads.filter((lead) =>
          IN_PROGRESS_STATUSES.includes(lead.status)
        );
      case "archived":
        return leads.filter((lead) => ARCHIVED_STATUSES.includes(lead.status));
      case "all":
      default:
        return leads;
    }
  };

  const filteredLeads = getFilteredLeads();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2B4E]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
      {filteredLeads.map((lead) => (
        <LeadListItem
          key={lead.lead_id}
          lead={lead}
          isActive={selectedLead?.lead_id === lead.lead_id}
          onClick={onLeadSelect}
          unreadCounts={unreadCounts}
        />
      ))}

      {filteredLeads.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No leads found</p>
        </div>
      )}
    </div>
  );
};

// Lead Details Component
export const LeadDetails = ({
  lead,
  onStartChat,
  onStatusUpdate,
  onBack,
  isMobile,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || "");
  console.log("lead", lead);
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    if (newStatus && newStatus !== lead.status) {
      onStatusUpdate(lead.lead_id, newStatus);
    }
  };

  if (!lead) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Select a lead
            </h3>
            <p className="text-gray-500">
              Choose a lead from the list to view details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-[#0C2B4E] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button
              onClick={onBack}
              className="p-2 text-white hover:bg-[#1a3a5f] rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h2 className="text-lg md:text-xl font-semibold text-white">
            Lead Details
          </h2>
        </div>

        {/* Right Side: Project Name + Status */}
        <div className="flex items-center space-x-3 flex-wrap justify-end text-right">
          <div className="flex items-center space-x-2">
            <span className="text-xs md:text-sm text-blue-100 font-medium hidden sm:inline">
              Status:
            </span>
            <span className="text-xs md:text-sm text-white font-medium px-2 py-1 bg-[#1a3a5f] rounded">
              {STATUS_CONFIG[lead.status]?.label || lead.status}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Profile Section */}
        <div className="bg-white p-4 md:p-6 border-b border-gray-200 rounded-xl shadow-sm relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT SIDE — Avatar + Buyer Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0C2B4E] rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-xl md:text-2xl aspect-square">
              {lead.buyer?.user?.avatar_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lead.buyer?.user?.avatar_url}`}
                  alt={lead.buyer.full_name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(lead.buyer?.full_name)
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 whitespace-nowrap">
                {lead.buyer?.full_name || "Unknown Buyer"}
              </h3>
              <p className="text-gray-500 text-sm whitespace-nowrap">
                {lead.buyer?.company_name || "No Company"}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — Listing Title */}
          {lead.listing?.title && (
            <span className="absolute top-4 right-6 text-xs md:text-sm text-black font-bold italic truncate max-w-[200px] sm:max-w-[250px] text-right">
              {lead.listing.title}
            </span>
          )}
        </div>

        {/* Status + View Chat Row */}
        <div className="bg-white p-4 md:p-6 border-b border-gray-200 rounded-xl shadow-sm mt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
          {/* Update Status */}
          <div className="flex-1 sm:flex-none sm:w-1/3 lg:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status:
            </label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-[#0C2B4E] transition-all text-sm"
            >
              {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Chat Button */}
          <button
            onClick={() => onStartChat(lead)}
            className="px-4 md:px-6 py-2 bg-[#0C2B4E] text-white rounded-lg transition-colors duration-200 font-medium flex-shrink-0 text-sm md:text-base self-start sm:self-end"
          >
            View Chat
          </button>
        </div>

        {/* Two-Column Layout */}
        <div className="bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 mt-2">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 border-b pb-2">
              Contact Information
            </h4>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.buyer?.user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.buyer?.user?.phone || "Not provided"}
                  </p>
                  <p className="text-xs text-gray-500">Phone</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.buyer?.city || "Not provided"}
                  </p>
                  <p className="text-xs text-gray-500">Location</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 border-b pb-2 flex items-center justify-between">
              <span>Lead Details</span>

              {lead?.is_urgent && (
                <span className="text-xs font-medium text-white bg-red-600 px-2 py-1 rounded-full">
                  Urgent
                </span>
              )}
            </h4>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {lead.project_title}
                </p>
                <p className="text-xs text-gray-500">Lead Title</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {lead.project_description}
                </p>
                <p className="text-xs text-gray-500">Lead Description</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {lead.budget_range}
                </p>
                <p className="text-xs text-gray-500">Budget</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {lead.timeline}
                </p>
                <p className="text-xs text-gray-500">Timeline</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {lead.contact_preference}
                </p>
                <p className="text-xs text-gray-500">Contact prefrence</p>
              </div>
              <div>
                {lead?.custom_requirements && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.custom_requirements}
                    </p>
                    <p className="text-xs text-gray-500">Custom requirements</p>
                  </div>
                )}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isCurrentUser }) => {
  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getMessageTypeLabel = (type) => {
    const typeObj = MESSAGE_TYPES.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  return (
    <div
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
          isCurrentUser
            ? "bg-[#0C2B4E] text-white rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none shadow-sm border border-gray-200"
        }`}
      >
        {/* Message type badge */}
        <div className="mb-1 md:mb-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isCurrentUser
                ? "bg-[#1a3a5f] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {getMessageTypeLabel(message.message_type)}
          </span>
        </div>

        {/* Message text */}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.message_text}
        </p>

        {/* Message footer */}
        <div
          className={`flex items-center justify-between mt-1 md:mt-2 text-xs ${
            isCurrentUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <span>{getMessageTime(message.created_at)}</span>
          {isCurrentUser && (
            <span className="ml-2">
              {message.is_read ? "✓ Read" : "✓ Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat Window Component - FIXED LAYOUT
export const ChatWindow = ({
  lead,
  conversations,
  isLoading,
  onSendMessage,
  socketConnected,
  connectionError,
  onRetryConnection,
  onBack,
  isMobile,
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [messageType, setMessageType] = useState("initial_inquiry");

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const user = getUserData();
  const currentUserId = user?.user_id;

  // Group messages by date for date separators
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(conversations);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [conversations, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!message.trim() || sending || !currentUserId || !socketConnected)
      return;

    const messageData = {
      message_text: message.trim(),
      message_type: messageType,
      attachments: null,
    };

    setSending(true);

    try {
      await onSendMessage(lead.lead_id, messageData);
      setMessage("");
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isCurrentUser = (participantId) => {
    if (!participantId || !currentUserId) return false;
    return String(participantId) === String(currentUserId);
  };

  if (!lead) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Select a lead to start chatting
            </h3>
            <p className="text-gray-500">
              Choose a conversation from the list to view messages
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-[#0C2B4E] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            {isMobile && (
              <button
                onClick={onBack}
                className="p-2 text-white hover:bg-[#1a3a5f] rounded-lg mr-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1a3a5f] rounded-full flex items-center justify-center text-white font-semibold">
              {lead.buyer?.user?.avatar_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lead.buyer?.user?.avatar_url}`}
                  alt={lead.buyer.full_name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(lead.buyer?.full_name)
              )}
            </div>
            <div>
              <div className="h-4 bg-[#1a3a5f] rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-[#1a3a5f] rounded w-32 mt-1 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2B4E]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-50 border-b border-red-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-red-700 text-sm">{connectionError}</span>
            <button
              onClick={onRetryConnection}
              className="text-red-700 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-[#0C2B4E] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
          {isMobile && (
            <button
              onClick={onBack}
              className="p-2 text-white hover:bg-[#1a3a5f] rounded-lg flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#1a3a5f] rounded-full text-white hover:bg-[#244a74] transition-colors duration-200 flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1a3a5f] rounded-full overflow-hidden flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0 aspect-square">
              {lead.buyer?.user?.avatar_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lead.buyer?.user?.avatar_url}`}
                  alt={lead.buyer.full_name || "User Avatar"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getInitials(lead.buyer?.full_name)
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base md:text-lg font-semibold text-white truncate">
              {lead.buyer?.full_name}
            </h2>
            <p className="text-blue-100 text-xs md:text-sm truncate">
              {socketConnected ? "Connected" : "connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area - FIXED FLEX LAYOUT */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar"
      >
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              <DateSeparator date={date} />
              {messages.map((message) => (
                <MessageBubble
                  key={message.conversation_id}
                  message={message}
                  isCurrentUser={isCurrentUser(message.participant_id)}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - FIXED POSITION AT BOTTOM */}
      <div className="bg-white border-t border-gray-300 p-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 max-w-4xl mx-auto">
          {/* Message Type Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[160px]">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:block">
              Type:
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-[#0C2B4E] text-sm"
            >
              {MESSAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message Input and Send Button */}
          <div className="flex items-center gap-2 flex-1 w-full">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                socketConnected ? "Type a message..." : "Connecting..."
              }
              disabled={sending || !socketConnected}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0C2B4E] focus:border-[#0C2B4E] disabled:opacity-50 text-sm"
            />

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending || !socketConnected}
              className="p-3 bg-[#0C2B4E] text-white rounded-xl hover:bg-[#1a3a5f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg
                  className="w-5 h-5 rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add custom scrollbar styles to global CSS
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 2px;
    transition: background 0.3s ease;
  }
  
  .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: #cbd5e0;
  }
  
  .custom-scrollbar:hover::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
  
  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  
  .custom-scrollbar:hover {
    scrollbar-color: #cbd5e0 transparent;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
