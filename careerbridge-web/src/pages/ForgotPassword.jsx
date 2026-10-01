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

import {
    ArrowBack,
    Lock,
    Person,
    Phone,
} from "@mui/icons-material";

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

            navigate("/reset-password", {
                state: {
                    resetToken,
                },
            });
        } catch (error) {
            console.error(
                "PASSWORD RESET VERIFICATION ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to verify your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const fieldStyles = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFDF9",
            borderRadius: 2,
            "& fieldset": {
                borderColor: "#E9DED0",
            },
            "&:hover fieldset": {
                borderColor: "#E76F51",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#E76F51",
                borderWidth: 2,
            },
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#E76F51",
        },
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 5,
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            backgroundColor: "#FFF1D6",
                            px: { xs: 3, sm: 5 },
                            py: 3,
                            borderBottom: "1px solid #E9DED0",
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2,
                                    backgroundColor: "#E76F51",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Lock
                                    sx={{
                                        color: "#fff",
                                        fontSize: 23,
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        color: "#293241",
                                        fontWeight: 800,
                                        fontSize: "1.15rem",
                                    }}
                                >
                                    CareerBridge
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#7A7068",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Account recovery
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <CardContent
                        sx={{
                            p: { xs: 3, sm: 5 },
                        }}
                    >
                        {/* Page heading */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: "#293241",
                                    fontWeight: 800,
                                    mb: 1,
                                    fontSize: {
                                        xs: "1.8rem",
                                        sm: "2.15rem",
                                    },
                                }}
                            >
                                Forgot your password?
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#7A7068",
                                    lineHeight: 1.7,
                                }}
                            >
                                Enter the information linked to your
                                CareerBridge account so we can verify your
                                identity.
                            </Typography>
                        </Box>

                        {/* Info box */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1.5,
                                alignItems: "flex-start",
                                backgroundColor: "#FFF8EF",
                                border: "1px solid #E9DED0",
                                borderRadius: 2,
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Person
                                sx={{
                                    color: "#E76F51",
                                    mt: 0.2,
                                    fontSize: 21,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: "#7A7068",
                                    fontSize: "0.88rem",
                                    lineHeight: 1.6,
                                }}
                            >
                                Use the same first name, last name, email,
                                and phone number you used when creating your
                                account.
                            </Typography>
                        </Box>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleVerify}
                        >
                            <Stack spacing={2.5}>
                                {/* First Name */}
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    sx={fieldStyles}
                                    InputProps={{
                                        startAdornment: (
                                            <Person
                                                sx={{
                                                    color: "#9A9189",
                                                    mr: 1,
                                                    fontSize: 21,
                                                }}
                                            />
                                        ),
                                    }}
                                />

                                {/* Last Name */}
                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    sx={fieldStyles}
                                />

                                {/* Email */}
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    sx={fieldStyles}
                                />

                                {/* Phone */}
                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    sx={fieldStyles}
                                    InputProps={{
                                        startAdornment: (
                                            <Phone
                                                sx={{
                                                    color: "#9A9189",
                                                    mr: 1,
                                                    fontSize: 21,
                                                }}
                                            />
                                        ),
                                    }}
                                />

                                {/* Verify button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        mt: 1,
                                        py: 1.5,
                                        backgroundColor: "#E76F51",
                                        color: "#fff",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor: "#D85F43",
                                            boxShadow: "none",
                                        },
                                        "&.Mui-disabled": {
                                            backgroundColor: "#E9B5A7",
                                            color: "#fff",
                                        },
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

                                {/* Back to login */}
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="text"
                                    fullWidth
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        color: "#6D6258",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        py: 1,
                                        "&:hover": {
                                            backgroundColor: "#FFF1D6",
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

                <Typography
                    align="center"
                    sx={{
                        mt: 3,
                        color: "#9A9189",
                        fontSize: "0.85rem",
                    }}
                >
                    CareerBridge · Your next opportunity starts here.
                </Typography>
            </Container>
        </Box>
    );
}

export default ForgotPassword;