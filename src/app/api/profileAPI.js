import axiosInstance from "../lib/axiosInstance.js";

// Profile APIs
export const getUserProfile = () => axiosInstance.get("/profile/user");
export const updateUserProfile = (data) =>
  axiosInstance.put("/profile/user", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Buyer APIs
export const getBuyerProfile = () => axiosInstance.get("/profile/buyer");
export const createBuyerProfile = (data) =>
  axiosInstance.post("/profile/buyer", data);
export const updateBuyerProfile = (data) =>
  axiosInstance.put("/profile/buyer", data);

// Seller APIs
export const getSellerProfile = () => axiosInstance.get("/profile/seller");
export const createSellerProfile = (data) =>
  axiosInstance.post("/profile/seller", data);
export const updateSellerProfile = (data) =>
  axiosInstance.put("/profile/seller", data);
