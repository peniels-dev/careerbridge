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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import axiosAPI from "../api/axiosAPI";

function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [companyId, setCompanyId] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Validate first name
        if (!firstName.trim()) {
            setError("First name is required.");
            return;
        }

        // Validate last name
        if (!lastName.trim()) {
            setError("Last name is required.");
            return;
        }

        // Validate email
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email.");
            return;
        }

        // Validate phone
        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        // Validate password
        if (!password) {
            setError("Password is required.");
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Validate role
        if (!role) {
            setError("Please select an account type.");
            return;
        }

        // Employer must have company
        if (role === "Employer" && !companyId.trim()) {
            setError("Company ID is required for Employer accounts.");
            return;
        }

        try {
            setLoading(true);

            await axiosAPI.post("/auth/register", {
                firstName,
                lastName,
                email,
                phone,
                password,
                role,
                companyId: role === "Employer" ? companyId : null,
            });

            setSuccess(
                "Registration successful! You can now login."
            );

            // Clear form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");
            setRole("");
            setCompanyId("");

            // Go to login page
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("REGISTRATION ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to register. Please try again."
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
            <Container maxWidth="md">
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
                        {/* Header */}
                        <Stack
                            spacing={1}
                            alignItems="center"
                            mb={4}
                        >
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
                                Create your account
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Join CareerBridge and discover new
                                opportunities.
                            </Typography>
                        </Stack>

                        {/* Error */}
                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3 }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Success */}
                        {success && (
                            <Alert
                                severity="success"
                                sx={{ mb: 3 }}
                            >
                                {success}
                            </Alert>
                        )}

                        {/* Registration Form */}
                        <Box
                            component="form"
                            onSubmit={handleRegister}
                        >
                            <Stack spacing={3}>

                                {/* First and Last Name */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <TextField
                                        label="First Name"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter first name"
                                        fullWidth
                                        required
                                    />

                                    <TextField
                                        label="Last Name"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter last name"
                                        fullWidth
                                        required
                                    />
                                </Box>

                                {/* Email */}
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

                                {/* Phone */}
                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    placeholder="Enter phone number"
                                    fullWidth
                                    required
                                />

                                {/* Passwords */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter password"
                                        fullWidth
                                        required
                                    />

                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm password"
                                        fullWidth
                                        required
                                    />
                                </Box>

                                {/* Account Type */}
                                <FormControl fullWidth required>
                                    <InputLabel>
                                        Account Type
                                    </InputLabel>

                                    <Select
                                        value={role}
                                        label="Account Type"
                                        onChange={(e) => {
                                            setRole(
                                                e.target.value
                                            );
                                            setCompanyId("");
                                        }}
                                    >
                                        <MenuItem value="">
                                            Select account type
                                        </MenuItem>

                                        <MenuItem value="JobSeeker">
                                            Job Seeker
                                        </MenuItem>

                                        <MenuItem value="Employer">
                                            Employer
                                        </MenuItem>

                                    </Select>
                                </FormControl>

                                {/* Company ID */}
                                {role === "Employer" && (
                                    <TextField
                                        label="Company ID"
                                        type="number"
                                        value={companyId}
                                        onChange={(e) =>
                                            setCompanyId(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter company ID"
                                        fullWidth
                                        required
                                    />
                                )}

                                {/* Register Button */}
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
                                            Registering...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>

                            </Stack>
                        </Box>

                        {/* Login Link */}
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ mt: 4 }}
                        >
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                style={{
                                    color: "#2563EB",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Register;