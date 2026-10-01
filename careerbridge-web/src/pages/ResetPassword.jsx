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

import {
    Lock,
    ArrowBack,
    CheckCircle,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const resetToken = location.state?.resetToken;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // RESET PASSWORD
    // ==========================================

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
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (password.length > 20) {
            setError(
                "Password must not exceed 20 characters."
            );
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
            console.error(
                "PASSWORD RESET ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to reset your password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INVALID / EXPIRED SESSION
    // ==========================================

    if (!resetToken) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#FFF8EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: "#FFFDF9",
                            border: "1px solid #E9DED0",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    sm: 5,
                                },
                            }}
                        >
                            <Stack
                                spacing={3}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#FFF1D6",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                    }}
                                >
                                    <Lock
                                        sx={{
                                            fontSize: 30,
                                            color: "#E76F51",
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 27,
                                            fontWeight: 800,
                                            color: "#293241",
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        Reset Session Expired
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            color: "#7A7068",
                                            textAlign:
                                                "center",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        Your password reset
                                        session is no longer
                                        available. Please
                                        start the recovery
                                        process again.
                                    </Typography>
                                </Box>

                                <Button
                                    component={Link}
                                    to="/forgot-password"
                                    variant="contained"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    sx={{
                                        width: "100%",
                                        maxWidth: 300,
                                        py: 1.4,
                                        textTransform:
                                            "none",
                                        fontWeight: 800,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#E76F51",
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#D85F43",
                                            boxShadow:
                                                "none",
                                        },
                                    }}
                                >
                                    Start Again
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    // ==========================================
    // RESET PASSWORD PAGE
    // ==========================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: {
                    xs: 4,
                    sm: 6,
                },
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: "#FFFDF9",
                        border:
                            "1px solid #E9DED0",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    {/* HEADER */}

                    <Box
                        sx={{
                            backgroundColor: "#FFF1D6",
                            borderBottom:
                                "1px solid #E9DED0",
                            px: {
                                xs: 3,
                                sm: 5,
                            },
                            py: 4,
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 58,
                                height: 58,
                                borderRadius: 2,
                                backgroundColor:
                                    "#E76F51",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                                mx: "auto",
                                mb: 2,
                            }}
                        >
                            <Lock
                                sx={{
                                    fontSize: 29,
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                fontSize: 25,
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#293241",
                            }}
                        >
                            Create a new password
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                color: "#7A7068",
                                fontSize: 14,
                                lineHeight: 1.6,
                            }}
                        >
                            Choose a strong password to
                            keep your account secure.
                        </Typography>
                    </Box>

                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                            },
                        }}
                    >
                        {/* ERROR */}

                        {error && (
                            <Alert
                                severity="error"
                                onClose={() =>
                                    setError("")
                                }
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    border:
                                        "1px solid #E8C7C0",
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* FORM */}

                        <Box
                            component="form"
                            onSubmit={handleReset}
                        >
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: "#3B454F",
                                            mb: 1,
                                        }}
                                    >
                                        New Password
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter your new password"
                                        required
                                        disabled={loading}
                                        inputProps={{
                                            minLength: 8,
                                            maxLength: 20,
                                        }}
                                        sx={
                                            fieldStyles
                                        }
                                    />

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontSize: 12,
                                            color: "#7A7068",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        8–20 characters with
                                        uppercase,
                                        lowercase, number
                                        and special
                                        character.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: "#3B454F",
                                            mb: 1,
                                        }}
                                    >
                                        Confirm New Password
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        type="password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter your password again"
                                        required
                                        disabled={loading}
                                        sx={
                                            fieldStyles
                                        }
                                    />
                                </Box>

                                {/* PASSWORD REQUIREMENTS */}

                                <Box
                                    sx={{
                                        backgroundColor:
                                            "#FFF8EF",
                                        border:
                                            "1px solid #E9DED0",
                                        borderRadius: 2,
                                        p: 2,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 800,
                                            color: "#293241",
                                            mb: 1,
                                        }}
                                    >
                                        Password requirements
                                    </Typography>

                                    <Requirement
                                        text="8–20 characters"
                                        valid={
                                            password.length >=
                                                8 &&
                                            password.length <=
                                                20
                                        }
                                    />

                                    <Requirement
                                        text="One uppercase letter"
                                        valid={/[A-Z]/.test(
                                            password
                                        )}
                                    />

                                    <Requirement
                                        text="One lowercase letter"
                                        valid={/[a-z]/.test(
                                            password
                                        )}
                                    />

                                    <Requirement
                                        text="One number"
                                        valid={/[0-9]/.test(
                                            password
                                        )}
                                    />

                                    <Requirement
                                        text="One special character"
                                        valid={/[!@#$%^&*(),.?":{}|<>]/.test(
                                            password
                                        )}
                                    />

                                    <Requirement
                                        text="Passwords match"
                                        valid={
                                            password.length >
                                                0 &&
                                            password ===
                                                confirmPassword
                                        }
                                    />
                                </Box>

                                {/* SUBMIT */}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: "1rem",
                                        fontWeight: 800,
                                        textTransform:
                                            "none",
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#E76F51",
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#D85F43",
                                            boxShadow:
                                                "none",
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress
                                                size={21}
                                                color="inherit"
                                                sx={{
                                                    mr: 1,
                                                }}
                                            />
                                            Resetting...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>

                                <Button
                                    component={Link}
                                    to="/login"
                                    disabled={loading}
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    sx={{
                                        color: "#7A7068",
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        "&:hover": {
                                            backgroundColor:
                                                "transparent",
                                            color: "#E76F51",
                                        },
                                    }}
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

// ==========================================
// PASSWORD REQUIREMENT
// ==========================================

const Requirement = ({ text, valid }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.7,
            }}
        >
            <CheckCircle
                sx={{
                    fontSize: 17,
                    color: valid
                        ? "#6A994E"
                        : "#C8BEB5",
                }}
            />

            <Typography
                sx={{
                    fontSize: 12,
                    color: valid
                        ? "#477A35"
                        : "#7A7068",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

// ==========================================
// TEXT FIELD STYLES
// ==========================================

const fieldStyles = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFDF9",
        borderRadius: 2,

        "& fieldset": {
            borderColor: "#DCCFC1",
        },

        "&:hover fieldset": {
            borderColor: "#C6B5A5",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#E76F51",
            borderWidth: 1.5,
        },
    },
};

export default ResetPassword;