import axiosInstance from "../lib/axiosInstance";

// Listing APIs
export const getListings = (params) =>
  axiosInstance.get("/listing/", { params });

export const getListingById = (id) => axiosInstance.get(`/listing/${id}`);

export const createListing = (data) => axiosInstance.post("/listing", data);

export const updateListing = (id, data) =>
  axiosInstance.put(`/listing/${id}`, data);

export const deleteListing = (id) => axiosInstance.delete(`/listing/${id}`);

export const getUserListings = () =>
  axiosInstance.get("/listing/user/my-listings");

export const updateListingStatus = (id, data) =>
  axiosInstance.patch(`/listing/${id}/status`, data);


export const getCategories =(data) => axiosInstance.get("/listing/categories/parent")

export const getSubcategories =(id)=> axiosInstance.get(`/listing/categories/${id}/subcategories`)

// Listing Media APIs
export const addListingMedia = (id, formData) =>
  axiosInstance.post(`/listing/${id}/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const removeListingMedia = (id, mediaId) =>
  axiosInstance.delete(`/listing/${id}/media/${mediaId}`);

export const fetchListingsWithPagination = async (
  page = 1,
  limit = 12,
  filters = {}
) => {
  const params = {
    page,
    limit,
    ...filters,
  };

  const response = await getListings(params);
  return response.data;
};

export const fetchFeaturedListings = async () => {
  const response = await getListings({ featured: true, limit: 8 });
  return response.data;
};
