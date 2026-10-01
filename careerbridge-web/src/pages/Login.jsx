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
    ArrowForward,
    BusinessCenter,
    Lock,
    Person,
} from "@mui/icons-material";

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

            const { token, user } = response.data.data;

            console.log("Logged in user:", user);
            console.log("Token received:", !!token);

            login(user, token);

            // Send the user to the correct dashboard
            const userRole = user.role || user.Role;

            if (userRole === "Admin") {
                navigate("/admin");
            } else if (userRole === "Employer") {
                navigate("/employer-dashboard");
            } else if (userRole === "JobSeeker") {
                navigate("/dashboard");
            } else {
                navigate("/unauthorized");
            }
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log(
                "SERVER RESPONSE:",
                error.response?.data
            );

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
                backgroundColor: "#FFF8EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: {
                    xs: 4,
                    md: 6,
                },
                px: 2,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative background shapes */}

            <Box
                sx={{
                    position: "absolute",
                    width: {
                        xs: 180,
                        md: 300,
                    },
                    height: {
                        xs: 180,
                        md: 300,
                    },
                    borderRadius: "50%",
                    backgroundColor: "#FFE5CC",
                    top: {
                        xs: -90,
                        md: -140,
                    },
                    right: {
                        xs: -80,
                        md: -100,
                    },
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: {
                        xs: 130,
                        md: 210,
                    },
                    height: {
                        xs: 130,
                        md: 210,
                    },
                    borderRadius: "50%",
                    backgroundColor: "#EDF4E8",
                    bottom: {
                        xs: -60,
                        md: -90,
                    },
                    left: {
                        xs: -50,
                        md: -70,
                    },
                }}
            />

            <Container
                maxWidth="sm"
                sx={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: "#FFFDF9",
                        border:
                            "1px solid #E9DED0",
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        boxShadow:
                            "0 18px 45px rgba(41, 50, 65, 0.10)",
                        overflow: "hidden",
                    }}
                >
                    {/* Top accent */}

                    <Box
                        sx={{
                            height: 7,
                            backgroundColor: "#E76F51",
                        }}
                    />

                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                            },
                        }}
                    >
                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <Stack
                            spacing={1.5}
                            sx={{
                                alignItems: "center",
                                mb: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 3,
                                    backgroundColor:
                                        "#FFF1D6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 0.5,
                                }}
                            >
                                <BusinessCenter
                                    sx={{
                                        fontSize: 32,
                                        color: "#E76F51",
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 30,
                                        sm: 34,
                                    },
                                    fontWeight: 900,
                                    color: "#293241",
                                    letterSpacing:
                                        "-0.8px",
                                }}
                            >
                                Career
                                <Box
                                    component="span"
                                    sx={{
                                        color: "#E76F51",
                                    }}
                                >
                                    Bridge
                                </Box>
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#756C64",
                                    textAlign: "center",
                                    maxWidth: 360,
                                    lineHeight: 1.6,
                                }}
                            >
                                Welcome back. Sign in to
                                continue your journey.
                            </Typography>
                        </Stack>

                        {/* =================================================
                            ERROR
                        ================================================= */}

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

                        {/* =================================================
                            LOGIN FORM
                        ================================================= */}

                        <Box
                            component="form"
                            onSubmit={handleLogin}
                        >
                            <Stack spacing={2.5}>

                                {/* EMAIL */}

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <Person
                                                sx={{
                                                    color: "#9A9188",
                                                    mr: 1,
                                                    fontSize: 21,
                                                }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor:
                                                "#FFFDF9",
                                            borderRadius: 2,

                                            "& fieldset": {
                                                borderColor:
                                                    "#DCCFC2",
                                            },

                                            "&:hover fieldset": {
                                                borderColor:
                                                    "#E76F51",
                                            },

                                            "&.Mui-focused fieldset": {
                                                borderColor:
                                                    "#E76F51",
                                            },
                                        },

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color: "#E76F51",
                                            },
                                    }}
                                />

                                {/* PASSWORD */}

                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <Lock
                                                sx={{
                                                    color: "#9A9188",
                                                    mr: 1,
                                                    fontSize: 21,
                                                }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor:
                                                "#FFFDF9",
                                            borderRadius: 2,

                                            "& fieldset": {
                                                borderColor:
                                                    "#DCCFC2",
                                            },

                                            "&:hover fieldset": {
                                                borderColor:
                                                    "#E76F51",
                                            },

                                            "&.Mui-focused fieldset": {
                                                borderColor:
                                                    "#E76F51",
                                            },
                                        },

                                        "& .MuiInputLabel-root.Mui-focused":
                                            {
                                                color: "#E76F51",
                                            },
                                    }}
                                />

                                {/* FORGOT PASSWORD */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "flex-end",
                                        mt: -0.5,
                                    }}
                                >
                                    <Link
                                        to="/forgot-password"
                                        style={{
                                            color: "#E76F51",
                                            fontWeight: 700,
                                            fontSize:
                                                "0.9rem",
                                            textDecoration:
                                                "none",
                                        }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </Box>

                                {/* LOGIN BUTTON */}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    endIcon={
                                        !loading && (
                                            <ArrowForward />
                                        )
                                    }
                                    sx={{
                                        py: 1.45,
                                        mt: 0.5,
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

                                        "&.Mui-disabled": {
                                            backgroundColor:
                                                "#E9B4A5",
                                            color: "#FFFDF9",
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
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </Stack>
                        </Box>

                        {/* =================================================
                            REGISTER
                        ================================================= */}

                        <Box
                            sx={{
                                mt: 4,
                                pt: 3,
                                borderTop:
                                    "1px solid #E9DED0",
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#756C64",
                                }}
                            >
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    style={{
                                        color: "#E76F51",
                                        fontWeight: 800,
                                        textDecoration:
                                            "none",
                                    }}
                                >
                                    Create an account
                                </Link>
                            </Typography>
                        </Box>

                        {/* Small footer note */}

                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mt: 3,
                                textAlign: "center",
                                color: "#A09890",
                            }}
                        >
                            Find opportunities. Build your
                            career.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Login;