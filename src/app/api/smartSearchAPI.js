// app/api/smartSearchAPI.js
import axiosInstance from "../lib/axiosInstance";

export const smartSearchListings = (searchParams) =>
  axiosInstance.post("/get/smart-search", searchParams);

export const detectUserLocation = (coordinates) =>
  axiosInstance.post("/get/detect-location", coordinates);
