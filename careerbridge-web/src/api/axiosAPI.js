import axios from "axios";

const axiosAPI = axios.create({
    baseURL: "http://localhost:5138/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT token to requests
axiosAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosAPI;