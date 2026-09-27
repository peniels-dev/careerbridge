import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    Logout,
    ArrowBack,
    Save,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const EditJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, logout } = useAuth();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        jobTitle: "",
        categoryId: "",
        description: "",
        location: "",
        jobType: "",
        applicationDeadline: "",
    });

    useEffect(() => {
        loadJob();
        loadCategories();
    }, [id]);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get(`/jobs/${id}`);

            const job = response.data.data;

            setFormData({
                jobTitle: job.JobTitle || "",
                categoryId: job.CategoryID || "",
                description: job.Description || "",
                location: job.Location || "",
                jobType: job.JobType || "",
                applicationDeadline: job.ApplicationDeadline
                    ? new Date(job.ApplicationDeadline)
                          .toISOString()
                          .split("T")[0]
                    : "",
            });
        } catch (err) {
            console.error("Unable to load job:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load this job."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await axiosAPI.get("/categories");

            setCategories(response.data?.data || []);
        } catch (err) {
            console.error(
                "Unable to load categories:",
                err
            );
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.jobTitle.trim()) {
            setError("Job title is required.");
            return;
        }

        if (!formData.categoryId) {
            setError("Please select a job category.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Job description is required.");
            return;
        }

        if (!formData.location.trim()) {
            setError("Location is required.");
            return;
        }

        if (!formData.jobType) {
            setError("Please select a job type.");
            return;
        }

        if (!formData.applicationDeadline) {
            setError(
                "Application deadline is required."
            );
            return;
        }

        try {
            setSaving(true);

            const jobData = {
                JobTitle: formData.jobTitle.trim(),
                CategoryID: Number(formData.categoryId),
                Description: formData.description.trim(),
                Location: formData.location.trim(),
                JobType: formData.jobType,
                ApplicationDeadline:
                    formData.applicationDeadline,
            };

            const response = await axiosAPI.put(
                `/jobs/${id}`,
                jobData
            );

            setSuccess(
                response.data?.message ||
                    "Job updated successfully!"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            setTimeout(() => {
                navigate(`/employer/jobs/${id}`);
            }, 1000);
        } catch (err) {
            console.error(
                "Unable to update job:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update job."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f6f8fb",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#667085",
                        }}
                    >
                        Loading job details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f6f8fb",
                display: "flex",
            }}
        >
            {/* SIDEBAR */}
            <Box
                sx={{
                    width: 250,
                    minHeight: "100vh",
                    backgroundColor: "#111827",
                    color: "#fff",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            backgroundColor: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 18,
                        }}
                    >
                        C
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 18,
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#9ca3af",
                            }}
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#273142",
                        mx: 2,
                    }}
                />

                <Box sx={{ px: 2, mt: 3 }}>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: 1,
                            px: 1.5,
                            mb: 1,
                        }}
                    >
                        MAIN MENU
                    </Typography>

                    <SidebarItem
                        icon={<Dashboard />}
                        text="Dashboard"
                        onClick={() =>
                            navigate(
                                "/employer-dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Work />}
                        text="My Job Postings"
                        active
                        onClick={() =>
                            navigate(
                                "/employer/jobs"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Add />}
                        text="Post a Job"
                        onClick={() =>
                            navigate(
                                "/employer/post-job"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<People />}
                        text="Applicants"
                        onClick={() =>
                            navigate(
                                "/employer/jobs"
                            )
                        }
                    />

                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: 1,
                            px: 1.5,
                            mt: 4,
                            mb: 1,
                        }}
                    >
                        COMPANY
                    </Typography>

                    <SidebarItem
                        icon={<Business />}
                        text="Company Profile"
                        onClick={() =>
                            navigate(
                                "/company-profile"
                            )
                        }
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent:
                                "flex-start",
                            color: "#9ca3af",
                            textTransform:
                                "none",
                            borderRadius: 2,
                            px: 1.5,
                            py: 1.2,
                            "&:hover": {
                                backgroundColor:
                                    "#1f2937",
                                color: "#fff",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    marginLeft: "250px",
                    width: "calc(100% - 250px)",
                }}
            >
                {/* TOP BAR */}
                <Box
                    sx={{
                        height: 72,
                        backgroundColor: "#fff",
                        borderBottom:
                            "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        px: { xs: 3, md: 5 },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#667085",
                        }}
                    >
                        Edit Job Posting
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                backgroundColor:
                                    "#2563eb",
                                color: "#fff",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                fontWeight: 700,
                                fontSize: 13,
                            }}
                        >
                            {(
                                (user?.firstName?.charAt(
                                    0
                                ) || "") +
                                (user?.lastName?.charAt(
                                    0
                                ) || "")
                            ).toUpperCase() ||
                                "E"}
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                }}
                            >
                                {user?.firstName ||
                                    "Employer"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#98a2b3",
                                }}
                            >
                                Employer
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* CONTENT */}
                <Box
                    sx={{
                        px: {
                            xs: 3,
                            md: 5,
                        },
                        py: 4,
                        maxWidth: 1000,
                        margin: "0 auto",
                    }}
                >
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                `/employer/jobs/${id}`
                            )
                        }
                        sx={{
                            textTransform:
                                "none",
                            color: "#667085",
                            mb: 3,
                        }}
                    >
                        Back to Job Details
                    </Button>

                    <Typography
                        sx={{
                            fontSize: 30,
                            fontWeight: 800,
                            color: "#101828",
                        }}
                    >
                        Edit Job Posting
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            mb: 4,
                            color: "#667085",
                            fontSize: 14,
                        }}
                    >
                        Update the information for
                        this job posting.
                    </Typography>

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
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            backgroundColor: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ p: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    mb: 1,
                                }}
                            >
                                Job Information
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#667085",
                                    mb: 3,
                                }}
                            >
                                Update the details
                                applicants will see.
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Box
                                component="form"
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    name="jobTitle"
                                    value={
                                        formData.jobTitle
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    select
                                    label="Job Category"
                                    name="categoryId"
                                    value={
                                        formData.categoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    sx={{ mb: 3 }}
                                >
                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <MenuItem
                                                key={
                                                    category.CategoryID
                                                }
                                                value={
                                                    category.CategoryID
                                                }
                                            >
                                                {
                                                    category.CategoryName
                                                }
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>

                                <TextField
                                    fullWidth
                                    select
                                    label="Job Type"
                                    name="jobType"
                                    value={
                                        formData.jobType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    sx={{ mb: 3 }}
                                >
                                    <MenuItem value="Full-Time">
                                        Full-Time
                                    </MenuItem>

                                    <MenuItem value="Part-Time">
                                        Part-Time
                                    </MenuItem>

                                    <MenuItem value="Internship">
                                        Internship
                                    </MenuItem>

                                    <MenuItem value="Contract">
                                        Contract
                                    </MenuItem>

                                    <MenuItem value="Temporary">
                                        Temporary
                                    </MenuItem>
                                </TextField>

                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Application Deadline"
                                    name="applicationDeadline"
                                    value={
                                        formData.applicationDeadline
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={7}
                                    label="Job Description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    sx={{ mb: 4 }}
                                />

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "flex-end",
                                        gap: 2,
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(
                                                `/employer/jobs/${id}`
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                            borderRadius:
                                                2,
                                            px: 3,
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={
                                            saving ? (
                                                <CircularProgress
                                                    size={
                                                        18
                                                    }
                                                    color="inherit"
                                                />
                                            ) : (
                                                <Save />
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                            borderRadius:
                                                2,
                                            px: 3,
                                            fontWeight:
                                                700,
                                        }}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

const SidebarItem = ({
    icon,
    text,
    active = false,
    onClick,
}) => {
    return (
        <Button
            fullWidth
            startIcon={icon}
            onClick={onClick}
            sx={{
                justifyContent:
                    "flex-start",
                textTransform: "none",
                color: active
                    ? "#fff"
                    : "#9ca3af",
                backgroundColor: active
                    ? "#1d4ed8"
                    : "transparent",
                borderRadius: 2,
                px: 1.5,
                py: 1.15,
                mb: 0.5,
                fontSize: 13,
                fontWeight: active
                    ? 700
                    : 500,
                "&:hover": {
                    backgroundColor:
                        active
                            ? "#1d4ed8"
                            : "#1f2937",
                    color: "#fff",
                },
            }}
        >
            {text}
        </Button>
    );
};

export default EditJob;