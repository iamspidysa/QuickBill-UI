import axiosInstance from "../api/axiosInstance";
 
export const login = async (data) => {
  return await axiosInstance.post("/login", data);
};