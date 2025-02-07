import axiosInstance from "@/lib/Intercapters";
import axios from "axios";

export const signup = (data) => axiosInstance.post("/auth/register", data);
export const login = (formData) => {
  const { data } = axiosInstance.post("/auth/login", formData);
  localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
  return data;
};
export const fetchNotebooks = () => axiosInstance.get("/notebooks");
