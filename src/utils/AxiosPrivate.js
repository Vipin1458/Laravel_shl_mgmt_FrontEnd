import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login"; 
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
