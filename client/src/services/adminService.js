import api from "./api.js";

export const fetchDashboardStats = () => api.get("/admin/dashboard").then((res) => res.data);
export const uploadProductImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api
    .post("/admin/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);
};
export const adminCreateProduct = (data) => api.post("/admin/products", data).then((res) => res.data);
export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data).then((res) => res.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then((res) => res.data);
export const adminFetchOrders = () => api.get("/admin/orders").then((res) => res.data);
export const adminUpdateOrderStatus = (id, data) => api.put(`/admin/orders/${id}`, data).then((res) => res.data);
