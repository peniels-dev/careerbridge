import axios from "axios";

const axiosAPI = axios.create({
    baseURL: "http://localhost:5138/api",
});

// Add token and content type to every request
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

// Handle common API errors centrally
axiosAPI.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // 401 = token is missing, invalid, or expired
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Only redirect if the user is not already on the login page
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

            return Promise.reject({
                ...error,
                friendlyMessage:
                    message ||
                    "Your session has expired. Please log in again.",
            });
        }

        // 403 = authenticated but not allowed to perform the action
        if (status === 403) {
            return Promise.reject({
                ...error,
                friendlyMessage:
                    message ||
                    "You do not have permission to perform this action.",
            });
        }

        // Other API errors
        if (message) {
            return Promise.reject({
                ...error,
                friendlyMessage: message,
            });
        }

        return Promise.reject({
            ...error,
            friendlyMessage:
                "Something went wrong. Please try again.",
        });
    }
);

export default axiosAPI;