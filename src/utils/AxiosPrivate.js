import axios from "axios";
import { useAuth } from "../context/AuthContext";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});

export default axiosInstance;
