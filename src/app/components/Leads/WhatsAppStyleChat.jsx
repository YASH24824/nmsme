"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getSellerLeads,
  updateLeadStatus,
  sendLeadMessage,
  getLeadConversations,
  markMessageAsRead,
  getSocket,
} from "../../api/leadAPI";

import { getUserListings } from "@/app/api/productsAPI";

// Import components
import {
  StatusFilterBar,
  LeadList,
  LeadDetails,
  ChatWindow,
} from "./ChatComponents";

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

// Helper function to detect duplicate messages
const isDuplicateMessage = (existingMsg, newMsg) => {
  if (existingMsg.conversation_id === newMsg.conversation_id) return true;

  if (
    existingMsg.message_text === newMsg.message_text &&
    existingMsg.participant_id === newMsg.participant_id &&
    Math.abs(new Date(existingMsg.created_at) - new Date(newMsg.created_at)) <
      5000
  ) {
    return true;
  }

  return false;
};

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

// Main WhatsAppStyleChat Component
const WhatsAppStyleChat = ({ onClose, initialLead = null }) => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(initialLead);
  const [activeFilter, setActiveFilter] = useState("all");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("details");
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const socketRef = useRef(null);
  const mountedRef = useRef(false);
  const currentLeadIdRef = useRef(null);
  const pendingMessageIdsRef = useRef(new Set());

  const user = getUserData();
  const currentUserId = user?.user_id;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const res = await getUserListings();
        console.log("Fetched products:", res);
        setProducts(res?.data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Get base filtered leads (by product only)
  const getBaseFilteredLeads = () => {
    if (!selectedProduct) return leads;

    const selectedProductId = parseInt(selectedProduct);
    return leads.filter((lead) => lead.listing_id === selectedProductId);
  };

  const baseFilteredLeads = getBaseFilteredLeads();

  // Calculate lead counts for filters (based on product filter only)
  const leadCounts = {
    all: baseFilteredLeads.length,
    new: baseFilteredLeads.filter((lead) => lead.status === "new").length,
    in_progress: baseFilteredLeads.filter((lead) =>
      IN_PROGRESS_STATUSES.includes(lead.status)
    ).length,
    archived: baseFilteredLeads.filter((lead) =>
      ARCHIVED_STATUSES.includes(lead.status)
    ).length,
  };

  // Get final filtered leads (by product AND status)
  const getFilteredLeads = () => {
    let filtered = baseFilteredLeads;

    console.log("🔍 DEBUG: Starting filter process");
    console.log("Total leads:", leads.length);
    console.log(
      "Selected product ID:",
      selectedProduct,
      "Type:",
      typeof selectedProduct
    );
    console.log("Base filtered leads (by product):", baseFilteredLeads.length);

    // Apply status filter
    const statusFiltered = (() => {
      switch (activeFilter) {
        case "new":
          return filtered.filter((lead) => lead.status === "new");
        case "in_progress":
          return filtered.filter((lead) =>
            IN_PROGRESS_STATUSES.includes(lead.status)
          );
        case "archived":
          return filtered.filter((lead) =>
            ARCHIVED_STATUSES.includes(lead.status)
          );
        case "all":
        default:
          return filtered;
      }
    })();

    console.log("📈 Final filtered leads count:", statusFiltered.length);
    return statusFiltered;
  };

  const filteredLeads = getFilteredLeads();

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getSellerLeads();

      // Handle different response structures
      let leadsData = [];
      if (response.leads) {
        leadsData = response.leads;
        console.log("Leads data:", leadsData);
      } else if (response.data?.leads) {
        leadsData = response.data.leads;
      } else if (response.data) {
        leadsData = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (Array.isArray(response)) {
        leadsData = response;
      }

      setLeads(leadsData);

      // Calculate unread counts
      const counts = {};
      leadsData.forEach((lead) => {
        const unreadConversations =
          lead.conversations?.filter((conv) => !conv.is_read) || [];
        counts[lead.lead_id] = unreadConversations.length;
      });
      setUnreadCounts(counts);

      // Auto-select first lead if none selected
      if (!selectedLead && leadsData.length > 0) {
        setSelectedLead(leadsData[0]);
        setCurrentView("details");
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLead]);

  // Load conversations - OPTIMIZED for your API structure
 const fetchConversations = useCallback(async (leadId) => {
  if (!leadId) return;

  try {
    setIsLoadingConversations(true);
    const response = await getLeadConversations(leadId, 1, 200);

    let conversationsData = [];
    let conversationId = null;

    // Handle multiple possible response structures
    if (response.data?.success && response.data.data?.messages) {
      conversationsData = response.data.data.messages;

      // get latest message's conversation_id
      conversationId = conversationsData.at(-1)?.conversation_id;
      console.log("Latest Conversation ID:", conversationId);

    } else if (response.data?.success && Array.isArray(response.data.data)) {
      conversationsData = response.data.data;
      conversationId = conversationsData.at(-1)?.conversation_id;

    } else if (response.conversations) {
      conversationsData = response.conversations;
      conversationId = conversationsData.at(-1)?.conversation_id;

    } else if (response.data?.conversations) {
      conversationsData = response.data.conversations;
      conversationId = conversationsData.at(-1)?.conversation_id;

    } else if (Array.isArray(response.data)) {
      conversationsData = response.data;
      conversationId = conversationsData.at(-1)?.conversation_id;

    } else if (Array.isArray(response)) {
      conversationsData = response;
      conversationId = conversationsData.at(-1)?.conversation_id;
    }

    setConversations(conversationsData);

    // 🔥 Only call if we have a valid conversationId (meaning there are messages)
    if (conversationId) {
      try {
        await markMessageAsRead(leadId, conversationId);
        setUnreadCounts((prev) => ({
          ...prev,
          [leadId]: 0,
        }));
      } catch (readErr) {
        console.warn("Could not mark messages as read:", readErr);
      }
    } else {
      console.log("No messages yet — read API not called.");
    }

  } catch (err) {
    console.error("Error fetching conversations:", err);
    setConversations([]);
  } finally {
    setIsLoadingConversations(false);
  }
}, []);













  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    if (!currentUserId || !selectedLead?.lead_id) {
      return;
    }

    try {
      setConnectionError(null);
      const socketInstance = await getSocket();

      if (!mountedRef.current) return;

      socketRef.current = socketInstance;

      const handleNewMessage = (message) => {
        if (!mountedRef.current) return;

        let actualParticipantId = message.participant_id;
        if (!actualParticipantId && message.participant) {
          actualParticipantId = message.participant.user_id;
        }

        const isCurrentUserMsg =
          String(actualParticipantId) === String(currentUserId);

        // Ignore messages from current user via socket
        if (isCurrentUserMsg) return;

        // Check if this is a message we just sent
        if (pendingMessageIdsRef.current.has(message.conversation_id)) return;

        if (message.lead_id === parseInt(selectedLead.lead_id)) {
          setConversations((prev) => {
            const fixedMessage = {
              ...message,
              participant_id: actualParticipantId,
            };
            const exists = prev.some((existingMsg) =>
              isDuplicateMessage(existingMsg, fixedMessage)
            );
            if (exists) return prev;
            return [...prev, fixedMessage];
          });
        }
      };

      const handleMessageRead = (data) => {
        if (!mountedRef.current) return;
        if (data.lead_id === parseInt(selectedLead.lead_id)) {
          setConversations((prev) =>
            prev.map((msg) =>
              msg.conversation_id === data.conversation_id
                ? { ...msg, is_read: true, read_at: data.read_at }
                : msg
            )
          );
        }
      };

      const handleSocketConnect = () => {
        if (!mountedRef.current) return;
        setSocketConnected(true);
        setConnectionError(null);

        if (socketRef.current) {
          socketRef.current.emit("join_lead", {
            leadId: parseInt(selectedLead.lead_id),
            userId: currentUserId,
          });
        }
      };

      const handleSocketDisconnect = () => {
        if (!mountedRef.current) return;
        setSocketConnected(false);
      };

      const handleSocketError = (error) => {
        if (!mountedRef.current) return;
        setConnectionError("Connection error");
      };

      // Register event listeners
      socketInstance.on("connect", handleSocketConnect);
      socketInstance.on("disconnect", handleSocketDisconnect);
      socketInstance.on("new_message", handleNewMessage);
      socketInstance.on("message_read", handleMessageRead);
      socketInstance.on("error", handleSocketError);

      if (socketInstance.connected) {
        handleSocketConnect();
      }
    } catch (error) {
      console.error("Socket initialization failed:", error);
      setConnectionError("Failed to connect");
      setSocketConnected(false);
    }
  }, [selectedLead?.lead_id, currentUserId]);

  // Handle sending messages
  const handleSendMessage = async (leadId, messageData) => {
    if (!currentUserId || !socketConnected) return;

    const tempMessageId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Optimistic UI update
    const tempMessage = {
      conversation_id: tempMessageId,
      message_text: messageData.message_text,
      message_type: messageData.message_type,
      attachments: null,
      participant_id: currentUserId,
      lead_id: parseInt(leadId),
      created_at: new Date().toISOString(),
      is_read: false,
      participant: {
        user_id: currentUserId,
        email: user?.email || "",
        fullname: user?.fullname || "You",
      },
    };

    pendingMessageIdsRef.current.add(tempMessageId);
    setConversations((prev) => [...prev, tempMessage]);

    try {
      const response = await sendLeadMessage(leadId, messageData);

      if (response.data?.success) {
        const serverMessage = response.data.data;
        pendingMessageIdsRef.current.add(serverMessage.conversation_id);

        setConversations((prev) =>
          prev.map((msg) =>
            msg.conversation_id === tempMessageId ? serverMessage : msg
          )
        );

        setTimeout(() => {
          pendingMessageIdsRef.current.delete(tempMessageId);
        }, 2000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      pendingMessageIdsRef.current.delete(tempMessageId);
      setConversations((prev) =>
        prev.filter((msg) => msg.conversation_id !== tempMessageId)
      );
      throw error;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      setError(null);
      await updateLeadStatus(leadId, { status: newStatus });

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.lead_id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      if (selectedLead?.lead_id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError("Failed to update status");
      console.error("Error updating status:", err);
    }
  };

  // Handle retry connection
  const handleRetryConnection = async () => {
    setConnectionError(null);
    await initializeSocket();
  };

  // Handle product change
  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
    // Reset selected lead when product filter changes
    setSelectedLead(null);
    setCurrentView("details");
  };

  // Clear product filter
  const handleClearProductFilter = () => {
    setSelectedProduct("");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle lead selection
  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setCurrentView("details");
    setConversations([]);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle start chat
  const handleStartChat = async (lead) => {
    setSelectedLead(lead);
    setCurrentView("chat");
    await fetchConversations(lead.lead_id);
    await initializeSocket();
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Initial setup
  useEffect(() => {
    mountedRef.current = true;
    currentLeadIdRef.current = selectedLead?.lead_id;

    const initializeChat = async () => {
      if (!mountedRef.current) return;
      await fetchLeads();
      if (selectedLead && currentView === "chat") {
        await fetchConversations(selectedLead.lead_id);
        await initializeSocket();
      }
    };

    initializeChat();

    return () => {
      mountedRef.current = false;
      pendingMessageIdsRef.current.clear();

      if (socketRef.current) {
        socketRef.current.emit("leave_lead", {
          leadId: parseInt(selectedLead?.lead_id),
        });
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("new_message");
        socketRef.current.off("message_read");
        socketRef.current.off("error");
        socketRef.current = null;
      }

      setSocketConnected(false);
      setConnectionError(null);
    };
  }, [
    fetchLeads,
    selectedLead?.lead_id,
    fetchConversations,
    initializeSocket,
    currentView,
  ]);

  return (
    <div className="h-screen bg-gray-100 p-0 m-0 overflow-hidden">
      {/* Main Rounded Container */}
      <div className="h-full bg-white rounded-none shadow-lg overflow-hidden">
        <div className="flex flex-1 overflow-hidden h-full relative">
          {/* Mobile Overlay */}
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left Sidebar - Light Gray Background */}
          <div
            className={`
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            ${
              isMobile
                ? "fixed inset-y-0 left-0 z-30 w-4/5 max-w-sm"
                : "relative w-2/5"
            } 
            flex flex-col border-r border-gray-200 bg-gray-50 h-full 
            transition-transform duration-300 ease-in-out
          `}
          >
            {/* Header with Product Filter */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#0C2B4E]">
              <h2 className="text-lg font-semibold text-white">Leads</h2>
              <div className="flex items-center space-x-2">
                {/* Product Filter Dropdown and Clear Button Container */}
                <div className="flex items-center space-x-2 bg-white rounded-lg px-2 py-1">
                  {/* Product Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedProduct}
                      onChange={(e) => handleProductChange(e.target.value)}
                      disabled={isLoadingProducts}
                      className="w-40 px-3 py-1.5 border-0 rounded-lg focus:outline-none  text-sm bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">All Products</option>
                      {products.map((product) => (
                        <option
                          key={product.id || product.listing_id}
                          value={product.id || product.listing_id}
                        >
                          {product.title || "Untitled Product"}
                        </option>
                      ))}
                    </select>
                    {isLoadingProducts && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>

                  {/* Clear Filter Button - Only show when a product is selected */}
                  {selectedProduct && (
                    <>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <button
                        onClick={handleClearProductFilter}
                        className="flex items-center text-gray-600 hover:text-red-600 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        title="Clear filter"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
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
                        Clear
                      </button>
                    </>
                  )}
                </div>

                {/* Toggle Button */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-white hover:bg-[#1a3a5f] rounded-lg md:hidden"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <StatusFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              leadCounts={leadCounts}
              selectedProduct={selectedProduct}
              onProductChange={handleProductChange}
              products={products}
              isLoadingProducts={isLoadingProducts}
            />
            <LeadList
              leads={filteredLeads}
              activeFilter={activeFilter}
              selectedLead={selectedLead}
              onLeadSelect={handleLeadSelect}
              unreadCounts={unreadCounts}
              isLoading={isLoading}
              selectedProduct={selectedProduct}
              products={products}
            />
          </div>

          {/* Right Area - White Background */}
          <div
            className={`
            ${isMobile ? "w-full" : "w-3/5"} 
            flex flex-col h-full bg-white relative
          `}
          >
            {/* Mobile Header with Toggle */}
            {isMobile && !isSidebarOpen && (
              <div className="bg-[#0C2B4E] px-4 py-3 flex items-center border-b border-gray-300">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-white hover:bg-[#1a3a5f] rounded-lg mr-3"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-white">
                  {currentView === "chat" ? "Chat" : "Lead Details"}
                </h2>
              </div>
            )}

            {currentView === "details" && (
              <LeadDetails
                lead={selectedLead}
                onStartChat={handleStartChat}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
            {currentView === "chat" && (
              <ChatWindow
                lead={selectedLead}
                conversations={conversations}
                isLoading={isLoadingConversations}
                onSendMessage={handleSendMessage}
                socketConnected={socketConnected}
                connectionError={connectionError}
                onRetryConnection={handleRetryConnection}
                onBack={() => setCurrentView("details")}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>
      </div>

      {/* Global Scrollbar Styles */}
      <style jsx global>{`
        /* Thin scrollbars that show on hover */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 2px;
        }

        .overflow-y-auto:hover::-webkit-scrollbar-thumb {
          background: #cbd5e0;
        }

        .overflow-y-auto:hover::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* For Firefox */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .overflow-y-auto:hover {
          scrollbar-color: #cbd5e0 transparent;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppStyleChat;
