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
  async (error) => {
    const originalRequest = error.config;


    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("auth")
    ) {
      originalRequest._retry = true;

      const authData = JSON.parse(localStorage.getItem("auth"));

      try {
        const res = await axios.post("http://localhost:8000/api/refresh", {
          refresh_token: authData.refreshToken,
        });

        const newAuthData = {
          token: res.data.access_token,
          refreshToken: res.data.refresh_token,
          user: authData.user,
        };

        localStorage.setItem("auth", JSON.stringify(newAuthData));

        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;

        return axiosInstance(originalRequest); 
      } catch (refreshError) {
     
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
