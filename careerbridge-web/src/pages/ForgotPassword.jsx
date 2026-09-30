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

function ForgotPassword() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");

        if (!firstName.trim()) {
            setError("First name is required.");
            return;
        }

        if (!lastName.trim()) {
            setError("Last name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        try {
            setLoading(true);

            const response = await axiosAPI.post(
                "/auth/verify-reset",
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                }
            );

            const resetToken = response.data.resetToken;

            // Move to reset password page
            navigate("/reset-password", {
                state: {
                    resetToken,
                },
            });

        } catch (error) {
            console.error("PASSWORD RESET VERIFICATION ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to verify your account. Please try again."
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
                    <CardContent
                        sx={{
                            p: { xs: 3, sm: 5 },
                        }}
                    >
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
                                Forgot your password?
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Enter your account information to verify
                                your identity.
                            </Typography>
                        </Stack>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleVerify}
                        >
                            <Stack spacing={2.5}>
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
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
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Account"
                                    )}
                                </Button>

                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="text"
                                    fullWidth
                                >
                                    Back to Login
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default ForgotPassword;