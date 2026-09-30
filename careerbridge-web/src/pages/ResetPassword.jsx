import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const resetToken = location.state?.resetToken;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();

        setError("");

        if (!resetToken) {
            setError(
                "Your password reset session is invalid. Please start again."
            );
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password.length > 20) {
            setError("Password must not exceed 20 characters.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError(
                "Password must contain at least one uppercase letter."
            );
            return;
        }

        if (!/[a-z]/.test(password)) {
            setError(
                "Password must contain at least one lowercase letter."
            );
            return;
        }

        if (!/[0-9]/.test(password)) {
            setError(
                "Password must contain at least one number."
            );
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError(
                "Password must contain at least one special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await axiosAPI.post(
                "/auth/reset-password",
                {
                    resetToken,
                    password,
                    confirmPassword,
                }
            );

            navigate("/login", {
                state: {
                    successMessage:
                        "Password reset successfully. You can now login with your new password.",
                },
            });

        } catch (error) {
            console.error("PASSWORD RESET ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to reset your password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!resetToken) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
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
                        <CardContent sx={{ p: 5 }}>
                            <Stack spacing={3} alignItems="center">
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    textAlign="center"
                                >
                                    Reset Session Expired
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    Please start the password recovery
                                    process again.
                                </Typography>

                                <Button
                                    component={Link}
                                    to="/forgot-password"
                                    variant="contained"
                                >
                                    Try Again
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
                py: 5,
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
                        <Stack spacing={1} alignItems="center" mb={4}>
                            <Typography
                                variant="h4"
                                fontWeight={800}
                                color="primary"
                            >
                                CareerBridge
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                textAlign="center"
                            >
                                Create a new password
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Choose a strong password for your account.
                            </Typography>
                        </Stack>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleReset}
                        >
                            <Stack spacing={2.5}>
                                <TextField
                                    label="New Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    inputProps={{
                                        minLength: 8,
                                        maxLength: 20,
                                    }}
                                    helperText="8–20 characters, with uppercase, lowercase, number and special character"
                                />

                                <TextField
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
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
                                        fontWeight: 600,
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                                sx={{ mr: 1 }}
                                            />
                                            Resetting...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default ResetPassword;