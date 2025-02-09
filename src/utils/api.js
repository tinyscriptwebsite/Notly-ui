import axiosInstance from "@/lib/Intercapters";
import axios from "axios";

// AUTH API FOR USER
export const signup = (data) => axiosInstance.post("/auth/register", data);
export const login = (formData) => axiosInstance.post("/auth/login", formData);

// DASHBOARD API FOR DASHBOARD
export const getDashboard = () => axiosInstance.get("/dashboard");

// NOTEBOOK API FOR NOTEBOOK
export const fetchNotebooks = () => axiosInstance.get("/notebooks");
export const saveNotebook = (canvasData) =>
  axiosInstance.post("/notebooks", canvasData);

export const getNotebook = (id) => axiosInstance.get(`/notebooks/${id}`);

export const updateNotebook = (id, canvasData) =>
  axiosInstance.put(`/notebooks/${id}`, canvasData);

export const deleteNotebook = (id) => axiosInstance.delete(`/notebooks/${id}`);
