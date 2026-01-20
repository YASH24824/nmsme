import axiosInstance from "../lib/axiosInstance";

export const loginUser = (data) => axiosInstance.post("/auth/login", data);
export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);
export const logoutUser = () => axiosInstance.post("/auth/logout");

export const requestOtp = (data) =>
  axiosInstance.post("/auth/forgot-password", data);
export const verifyOtp = (data) => axiosInstance.post("/auth/verify-otp", data);
export const resetPassword = (data) =>
  axiosInstance.post("/auth/reset-password", data);
