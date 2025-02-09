"use client";

import axios from "axios";
import toast from "react-hot-toast";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken !== "undefined") {
      try {
        const parsedToken = JSON.parse(accessToken);
        JSON;
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch (error) {
        console.error("Invalid token format:", error);
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Unauthorized, please login again");
      }
      if (error.response.status === 403) {
        toast.error("Forbidden access");
      }
    } else {
      toast.error("Network error, please try again later");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
