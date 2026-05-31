// APIs calls to backend server
// Axios instance created in axiosInstance.js, the interceptor only adds the header when a token exists in localStorage.

import axiosInstance from "../api/axiosInstance";
 
export const addCategory = async (category) => {
  return await axiosInstance.post("/admin/categories", category);
};
 
export const deleteCategory = async (categoryId) => {
  return await axiosInstance.delete(`/admin/categories/${categoryId}`);
};
 
export const fetchCategory = async () => {
  return await axiosInstance.get("/categories");
};