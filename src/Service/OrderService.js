import axiosInstance from "../api/axiosInstance";
 
export const latestOrder = async () => {
  return await axiosInstance.get("/orders/latest");
};
 
export const createOrder = async (order) => {
  return await axiosInstance.post("/orders", order);
};
 
export const deleteOrder = async (orderId) => {
  return await axiosInstance.delete(`/orders/${orderId}`);
};