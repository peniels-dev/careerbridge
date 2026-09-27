import axios from "axios";

const axiosAPI = axios.create({
    baseURL: "http://localhost:5138/api",
});

axiosAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Let Axios/browser set the correct multipart/form-data
        // Content-Type and boundary for file uploads.
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosAPI;