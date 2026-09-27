import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Email,
    LocationOn,
    Phone,
    Save,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

const Profile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        skills: "",
        education: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosAPI.get(
                    "/jobseeker/profile"
                );

                const data = response.data?.data;

                if (data) {
                    setProfile({
                        firstName: data.FirstName || "",
                        lastName: data.LastName || "",
                        email: data.Email || "",
                        phone: data.Phone || "",
                        location: data.Location || "",
                        skills: data.Skills || "",
                        education: data.Education || "",
                    });
                }
            } catch (err) {
                console.error("Error fetching profile:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await axiosAPI.put(
                "/jobseeker/profile",
                {
                    phone: profile.phone,
                    location: profile.location,
                    skills: profile.skills,
                    education: profile.education,
                }
            );

            setSuccess(
                "Your profile has been updated successfully."
            );
        } catch (err) {
            console.error("Error updating profile:", err);

            setError(
                err.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const getInitials = () => {
        const first = profile.firstName?.charAt(0) || "";
        const last = profile.lastName?.charAt(0) || "";

        return (
            `${first}${last}`.toUpperCase() || "U"
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f7fb",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                py: 5,
            }}
        >
            <Container maxWidth="md">

                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            color="#172033"
                        >
                            My Profile
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Manage your personal information.
                        </Typography>
                    </Box>

                   <Button
    variant="contained"
    onClick={() => navigate("/dashboard")}
    sx={{
        minHeight: 44,
        px: 3,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.95rem",
        backgroundColor: "#2563eb",
        boxShadow: "none",
        "&:hover": {
            backgroundColor: "#1d4ed8",
            boxShadow: "none",
        },
    }}
>
    Return to Dashboard
</Button>
                </Stack>

                {/* Messages */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                    >
                        {success}
                    </Alert>
                )}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e4e8f0",
                        overflow: "hidden",
                    }}
                >
                    {/* Profile header */}
                    <Box
                        sx={{
                            background:
                                "linear-gradient(135deg, #172033 0%, #263b63 100%)",
                            px: {
                                xs: 3,
                                sm: 5,
                            },
                            py: 4,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={2.5}
                            alignItems="center"
                        >
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    fontSize: 26,
                                    fontWeight: 800,
                                    backgroundColor:
                                        "#ffffff",
                                    color: "#172033",
                                }}
                            >
                                {getInitials()}
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    color="white"
                                >
                                    {profile.firstName}{" "}
                                    {profile.lastName}
                                </Typography>

                                <Typography
                                    sx={{
                                        color:
                                            "rgba(255,255,255,0.75)",
                                        mt: 0.5,
                                    }}
                                >
                                    Job Seeker
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ mb: 1 }}
                        >
                            Personal Information
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Keep your information up to date so
                            employers can get the correct details.
                        </Typography>

                        <Divider sx={{ mb: 4 }} />

                        <Grid container spacing={3}>

                            {/* First Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={
                                        profile.firstName
                                    }
                                    disabled
                                />
                            </Grid>

                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={
                                        profile.lastName
                                    }
                                    disabled
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={profile.email}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <Email
                                                sx={{
                                                    mr: 1,
                                                    color:
                                                        "action.active",
                                                }}
                                            />
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Phone */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={
                                        profile.phone
                                    }
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <Phone
                                                sx={{
                                                    mr: 1,
                                                    color:
                                                        "action.active",
                                                }}
                                            />
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={
                                        profile.location
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. Accra, Ghana"
                                    InputProps={{
                                        startAdornment: (
                                            <LocationOn
                                                sx={{
                                                    mr: 1,
                                                    color:
                                                        "action.active",
                                                }}
                                            />
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Skills */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Skills"
                                    name="skills"
                                    value={
                                        profile.skills
                                    }
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="e.g. Java, React, SQL, Networking"
                                    helperText="Separate multiple skills with commas."
                                />
                            </Grid>

                            {/* Education */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Education"
                                    name="education"
                                    value={
                                        profile.education
                                    }
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="e.g. BSc Computer Science"
                                />
                            </Grid>

                        </Grid>

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            sx={{ mt: 4 }}
                        >
                            <Button
                                variant="contained"
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                onClick={handleSave}
                                disabled={saving}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.3,
                                    textTransform: "none",
                                    fontWeight: 700,
                                }}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Profile;