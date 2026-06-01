import axiosInstance from "../api/axiosInstance";
 
export const latestOrder = async (page = 0, size = 20) => {
  return await axiosInstance.get("/orders/latest", {
    params: {page, size},
  });
};
 
export const createOrder = async (order) => {
  return await axiosInstance.post("/orders", order);
};
 
export const deleteOrder = async (orderId) => {
  return await axiosInstance.delete(`/orders/${orderId}`);
};