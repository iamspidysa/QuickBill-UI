import axiosInstance from "../api/axiosInstance";
 
export const addUser = async (user) => {
  return await axiosInstance.post("/admin/register", user);
};
 
export const deleteUser = async (userId) => {
  return await axiosInstance.delete(`/admin/users/${userId}`);
};
 
export const fetchUsers = async () => {
  return await axiosInstance.get("/admin/users");
};