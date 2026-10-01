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
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Email,
    LocationOn,
    Phone,
    Save,
    ArrowBack,
    Person,
    School,
    Build,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

const Profile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: "",
        middleName: "",
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
                        middleName: data.MiddleName || "",
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

            await axiosAPI.put("/jobseeker/profile", {
                firstName: profile.firstName,
                middleName: profile.middleName,
                lastName: profile.lastName,
                phone: profile.phone,
                location: profile.location,
                skills: profile.skills,
                education: profile.education,
            });

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
        const first =
            profile.firstName?.charAt(0) || "";

        const last =
            profile.lastName?.charAt(0) || "";

        const initials =
            `${first}${last}`.toUpperCase();

        return initials || "U";
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFF8EF",
                }}
            >
                <CircularProgress
                    sx={{
                        color: "#E76F51",
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                py: {
                    xs: 3,
                    sm: 5,
                },
            }}
        >
            <Container maxWidth="md">
                {/* Header */}
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
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
                            sx={{
                                fontSize: {
                                    xs: 12,
                                    sm: 13,
                                },
                                fontWeight: 800,
                                letterSpacing: "1.5px",
                                color: "#E76F51",
                                mb: 0.8,
                            }}
                        >
                            CAREERBRIDGE
                        </Typography>

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: 30,
                                    sm: 38,
                                },
                                lineHeight: 1.15,
                                fontWeight: 900,
                                color: "#293241",
                                letterSpacing: "-0.8px",
                            }}
                        >
                            My Profile
                        </Typography>

                        <Typography
                            sx={{
                                color: "#746B63",
                                mt: 0.8,
                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                            }}
                        >
                            Keep your information up to date.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        sx={{
                            minHeight: 44,
                            px: 2.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#293241",
                            borderColor: "#DCCFC2",
                            backgroundColor: "#FFFDF9",
                            "&:hover": {
                                borderColor: "#E76F51",
                                backgroundColor: "#FFF1D6",
                            },
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Stack>

                {/* Messages */}
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

                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            border: "1px solid #C9DFC0",
                        }}
                    >
                        {success}
                    </Alert>
                )}

                {/* Profile Card */}
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: {
                            xs: 3,
                            sm: 4,
                        },
                        overflow: "hidden",
                        boxShadow:
                            "0 12px 35px rgba(95, 75, 55, 0.08)",
                    }}
                >
                    {/* Profile Header */}
                    <Box
                        sx={{
                            position: "relative",
                            backgroundColor: "#293241",
                            px: {
                                xs: 3,
                                sm: 5,
                            },
                            py: {
                                xs: 3.5,
                                sm: 4.5,
                            },
                            overflow: "hidden",
                        }}
                    >
                        {/* Decorative shapes */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: 150,
                                height: 150,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(244, 162, 97, 0.12)",
                                right: -50,
                                top: -70,
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                width: 90,
                                height: 90,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(231, 111, 81, 0.16)",
                                right: 55,
                                bottom: -50,
                            }}
                        />

                        <Stack
                            direction="row"
                            spacing={2.5}
                            alignItems="center"
                            sx={{
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: {
                                        xs: 64,
                                        sm: 76,
                                    },
                                    height: {
                                        xs: 64,
                                        sm: 76,
                                    },
                                    fontSize: {
                                        xs: 22,
                                        sm: 27,
                                    },
                                    fontWeight: 900,
                                    backgroundColor: "#FFF1D6",
                                    color: "#E76F51",
                                    border:
                                        "3px solid rgba(255,255,255,0.15)",
                                }}
                            >
                                {getInitials()}
                            </Avatar>

                            <Box>
                                <Typography
                                    sx={{
                                        color: "#FFFDF9",
                                        fontSize: {
                                            xs: 20,
                                            sm: 25,
                                        },
                                        fontWeight: 900,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {profile.firstName}{" "}
                                    {profile.middleName
                                        ? `${profile.middleName} `
                                        : ""}
                                    {profile.lastName}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mt: 0.8 }}
                                >
                                    <Person
                                        sx={{
                                            fontSize: 17,
                                            color: "#F4A261",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            color: "#E8DED5",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Job Seeker
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    <CardContent
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 5,
                            },
                        }}
                    >
                        {/* Section heading */}
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 2,
                                    backgroundColor: "#FFF1D6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Person
                                    sx={{
                                        color: "#E76F51",
                                        fontSize: 21,
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 21,
                                    fontWeight: 900,
                                    color: "#293241",
                                }}
                            >
                                Personal Information
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                color: "#746B63",
                                fontSize: 14,
                                mb: 3,
                            }}
                        >
                            Add details that help employers
                            understand who you are.
                        </Typography>

                        <Divider
                            sx={{
                                borderColor: "#E9DED0",
                                mb: 4,
                            }}
                        />

                        <Grid container spacing={3}>
                            {/* First Name */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={profile.firstName}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>

                            {/* Middle Name */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    name="middleName"
                                    value={profile.middleName}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>

                            {/* Last Name */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={profile.lastName}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={profile.email}
                                    disabled
                                    helperText="Email is used for login and cannot be changed."
                                    sx={textFieldStyle}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email
                                                    sx={{
                                                        color: "#E76F51",
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Phone */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone
                                                    sx={{
                                                        color: "#6A994E",
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Location */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={profile.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Accra, Ghana"
                                    sx={textFieldStyle}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn
                                                    sx={{
                                                        color: "#F4A261",
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Skills */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Skills"
                                    name="skills"
                                    value={profile.skills}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="e.g. Java, React, SQL, Networking"
                                    helperText="Separate multiple skills with commas."
                                    sx={textFieldStyle}
                                />
                            </Grid>

                            {/* Education */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Education"
                                    name="education"
                                    value={profile.education}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="e.g. BSc Computer Science"
                                    sx={textFieldStyle}
                                />
                            </Grid>
                        </Grid>

                        {/* Extra section hint */}
                        <Box
                            sx={{
                                mt: 4,
                                p: 2.5,
                                backgroundColor: "#FFF8EF",
                                border: "1px solid #E9DED0",
                                borderRadius: 2.5,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="flex-start"
                            >
                                <Build
                                    sx={{
                                        color: "#6A994E",
                                        fontSize: 21,
                                        mt: 0.2,
                                    }}
                                />

                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            color: "#293241",
                                            fontSize: 14,
                                            mb: 0.3,
                                        }}
                                    >
                                        Keep your profile useful
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#746B63",
                                            fontSize: 13,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Adding your skills and
                                        education makes it easier
                                        for employers to understand
                                        your background.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        {/* Save Button */}
                        <Stack
                            direction={{
                                xs: "column-reverse",
                                sm: "row",
                            }}
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{ mt: 4 }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                sx={{
                                    minHeight: 46,
                                    px: 3,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    color: "#5F554D",
                                    borderColor: "#DCCFC2",
                                    "&:hover": {
                                        borderColor: "#E76F51",
                                        backgroundColor:
                                            "#FFF8EF",
                                    },
                                }}
                            >
                                Cancel
                            </Button>

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
                                    minHeight: 46,
                                    px: 3.5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 800,
                                    backgroundColor: "#E76F51",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor:
                                            "#D85F43",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Bottom note */}
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 3 }}
                >
                    <School
                        sx={{
                            fontSize: 17,
                            color: "#6A994E",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#81776E",
                        }}
                    >
                        Your profile information is only
                        editable by you.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFDF9",
        borderRadius: 2,
        "& fieldset": {
            borderColor: "#DCCFC2",
        },
        "&:hover fieldset": {
            borderColor: "#C8B8A8",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#E76F51",
            borderWidth: 2,
        },
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: "#E76F51",
    },

    "& .MuiFormHelperText-root": {
        color: "#81776E",
    },
};

export default Profile;