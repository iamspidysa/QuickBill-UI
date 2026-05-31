import axiosInstance from "../api/axiosInstance";
 
export const addItem = async (item) => {
  return await axiosInstance.post("/admin/items", item);
};
 
export const deleteItem = async (itemId) => {
  return await axiosInstance.delete(`/admin/items/${itemId}`);
};
 
export const fetchItems = async () => {
  return await axiosInstance.get("/items");
};