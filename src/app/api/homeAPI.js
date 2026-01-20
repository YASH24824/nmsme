import axiosInstance from "../lib/axiosInstance";

export const getHomePageData = (params = {}) =>
  axiosInstance.get("/home", { params });

export const getSearchSuggestions = (query = "") =>
  axiosInstance.get("/home/search-suggestions", {
    params: { query },
  });

export const detectUserLocation = (coordinates) =>       
axiosInstance.post("/home/detect-location", coordinates);

export const getCategories = () => axiosInstance.get("/home/categories");
export const getAllCategories = () => axiosInstance.get("/categories/all");


export const getsubCategories = (id)=> axiosInstance.get(`/categories/${id}/subcategories`)

export const getlistingfromsubcategories=(id)=>axiosInstance.get(`/categories/subcategory/${id}/listings`)





export const getPromotedListings = (filters = {}) =>
  axiosInstance.get("/home/promoted/listings", {
    params: filters, // {country, state, city}
  });

export const getRecentListings = (params = {}) =>
  axiosInstance.get("/home/recent/listings", { params });

export const getPopularListings = (filters = {}) =>
  axiosInstance.get("/home/popular/listings", {
    params: filters,
  });

  export const getTrendingListings = (filters = {}) =>
  axiosInstance.get("/home/popular-tags");

  


export const getRecentReviews = () => axiosInstance.get("/home/recent/reviews");

export const getPlatformStats = () => axiosInstance.get("/home/platform/stats");

export const submitQuickInquiry = (data) => axiosInstance.post("/lead", data);
