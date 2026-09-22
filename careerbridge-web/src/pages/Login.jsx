import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await axiosAPI.post("/auth/login", {
                email,
                password,
            });

            // Backend returns token and user inside data
            const { token, user } = response.data.data;

            console.log("Logged in user:", user);
            console.log("Token:", token);

            // Save authentication information
            login(user, token);

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("LOGIN ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log("SERVER RESPONSE:", error.response?.data);

            setError(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>

                        {/* Logo / Brand */}
                        <Stack spacing={1} alignItems="center" mb={4}>
                            <Typography
                                variant="h4"
                                fontWeight={800}
                                color="primary"
                            >
                                CareerBridge
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Welcome back. Sign in to continue.
                            </Typography>
                        </Stack>

                        {/* Error message */}
                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3 }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Login form */}
                        <Box
                            component="form"
                            onSubmit={handleLogin}
                        >
                            <Stack spacing={3}>

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    fullWidth
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                                sx={{ mr: 1 }}
                                            />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>

                            </Stack>
                        </Box>

                        {/* Register link */}
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ mt: 4 }}
                        >
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                style={{
                                    color: "#2563EB",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Create an account
                            </Link>
                        </Typography>

                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Login;