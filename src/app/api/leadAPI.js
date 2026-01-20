import axiosInstance from "../lib/axiosInstance";
import { socketService } from "../lib/socket";

// Lead APIs
export const createLead = (data) => axiosInstance.post("/lead/create", data);

export const getBuyerLeads = () => axiosInstance.get("/lead/buyer/my-leads");

export const getSellerLeads = () =>
  axiosInstance.get("/lead/seller/incoming-leads");

export const getLeadById = (id) => axiosInstance.get(`/lead/${id}`);

export const updateLeadStatus = (id, data) =>
  axiosInstance.patch(`/lead/${id}/status`, data);

// Lead Conversations
export const getLeadConversations = (leadId, page = 1, limit = 100) =>
  axiosInstance.get(`/lead/${leadId}/conversations`, {
    params: { page, limit },
  });

export const sendLeadMessage = (leadId, data) =>
  axiosInstance.post(`/lead/${leadId}/conversations`, data);

export const markMessageAsRead = (leadId, conversationId) =>
  axiosInstance.patch(`/lead/${leadId}/conversations/${conversationId}/read`);

export const getUnreadMessageCount = (leadId) =>
  axiosInstance.get(`/lead/${leadId}/unread-count`);

// Socket helper - returns a promise that resolves with socket
export const getSocket = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  return await socketService.connect(token);
};
