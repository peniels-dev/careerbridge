import { createContext, useContext, useEffect, useState } from "react";
import axiosAPI from "../api/axiosAPI";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await axiosAPI.get("/auth/me");

                setUser(response.data.data);

            } catch (error) {
                console.error("Unable to restore user:", error);

                localStorage.removeItem("token");

                setToken(null);
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (userData, userToken) => {
        localStorage.setItem("token", userToken);

        setToken(userToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated : !!token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}