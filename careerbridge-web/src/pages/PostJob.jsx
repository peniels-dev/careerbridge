import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Alert,
    CircularProgress,
    Divider,
    Avatar,
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    Logout,
    ArrowBack,
    LocationOn,
    CalendarToday,
    Description,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const PostJob = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

    // ==========================================
    // LOAD CATEGORIES
    // ==========================================
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                setError("");

                console.log("Loading job categories...");

                const response = await axiosAPI.get("/categories");

                console.log(
                    "Categories response:",
                    response.data
                );

                setCategories(response.data?.data || []);
            } catch (err) {
                console.error(
                    "Category loading error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load job categories."
                );
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ==========================================
    // SUBMIT JOB
    // ==========================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("================================");
        console.log("POST JOB STARTED");
        console.log("FORM DATA:", formData);
        console.log("================================");

        setError("");
        setSuccess("");

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!formData.jobTitle.trim()) {
            setError("Please enter a job title.");
            return;
        }

        if (!formData.categoryId) {
            setError("Please select a job category.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Please enter a job description.");
            return;
        }

        if (!formData.location.trim()) {
            setError("Please enter the job location.");
            return;
        }

        if (!formData.jobType) {
            setError("Please select a job type.");
            return;
        }

        if (!formData.applicationDeadline) {
            setError(
                "Please select an application deadline."
            );
            return;
        }

        // -------------------------------
        // SEND TO BACKEND
        // -------------------------------

        try {
            setSubmitting(true);

            console.log("Sending job to backend...");

            const jobData = {
                JobTitle: formData.jobTitle.trim(),
                CategoryID: Number(formData.categoryId),
                Description: formData.description.trim(),
                Location: formData.location.trim(),
                JobType: formData.jobType,
                ApplicationDeadline:
                    formData.applicationDeadline,
            };

            console.log("DATA BEING SENT:", jobData);

            const response = await axiosAPI.post(
                "/jobs",
                jobData
            );

            console.log("================================");
            console.log("JOB POST RESPONSE:");
            console.log(response.data);
            console.log("================================");

            setSuccess(
                response.data?.message ||
                "Job posted successfully!"
            );

            setFormData({
                jobTitle: "",
                categoryId: "",
                description: "",
                location: "",
                jobType: "",
                applicationDeadline: "",
            });
        } catch (err) {
            console.error("================================");
            console.error("POST JOB ERROR");
            console.error(
                "STATUS:",
                err.response?.status
            );
            console.error(
                "DATA:",
                err.response?.data
            );
            console.error("ERROR:", err);
            console.error("================================");

            setError(
                err.response?.data?.message ||
                "Unable to post the job. Please try again."
            );
        } finally {
            setSubmitting(false);

            console.log("================================");
            console.log("POST JOB FINISHED");
            console.log("================================");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                display: "flex",
            }}
        >
            {/* SIDEBAR */}
            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#0f172a",
                    color: "white",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 10,
                }}
            >
                {/* LOGO */}
                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        borderBottom:
                            "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        Career
                        <span style={{ color: "#60a5fa" }}>
                            Bridge
                        </span>
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color: "#94a3b8",
                            display: "block",
                            mt: 0.5,
                        }}
                    >
                        Employer Portal
                    </Typography>
                </Box>

                {/* NAVIGATION */}
                <Box
                    sx={{
                        px: 2,
                        py: 3,
                        flex: 1,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#64748b",
                            px: 2,
                            mb: 1,
                            display: "block",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Workspace
                    </Typography>

                    <Button
                        fullWidth
                        startIcon={<Dashboard />}
                        onClick={() =>
                            navigate(
                                "/employer-dashboard"
                            )
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#cbd5e1",
                            px: 2,
                            py: 1.3,
                            mb: 0.5,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        Dashboard
                    </Button>

                    <Button
                        fullWidth
                        startIcon={<Work />}
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#cbd5e1",
                            px: 2,
                            py: 1.3,
                            mb: 0.5,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        My Job Postings
                    </Button>

                    <Button
                        fullWidth
                        startIcon={<Add />}
                        onClick={() =>
                            navigate(
                                "/employer/post-job"
                            )
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "white",
                            backgroundColor:
                                "rgba(96,165,250,0.15)",
                            px: 2,
                            py: 1.3,
                            mb: 0.5,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        Post a Job
                    </Button>

                    <Button
                        fullWidth
                        startIcon={<People />}
                        onClick={() =>
                            navigate(
                                "/employer/applicants"
                            )
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#cbd5e1",
                            px: 2,
                            py: 1.3,
                            mb: 0.5,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        Applicants
                    </Button>

                    <Button
                        fullWidth
                        startIcon={<Business />}
                        onClick={() =>
                            navigate("/company-profile")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#cbd5e1",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        Company Profile
                    </Button>
                </Box>

                {/* LOGOUT */}
                <Box
                    sx={{
                        px: 2,
                        py: 2,
                        borderTop:
                            "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: "flex-start",
                            color: "#94a3b8",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    flex: 1,
                    ml: {
                        xs: 0,
                        md: "250px",
                    },
                }}
            >
                {/* TOP BAR */}
                <Box
                    sx={{
                        height: 72,
                        backgroundColor: "white",
                        borderBottom:
                            "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        px: {
                            xs: 2,
                            md: 4,
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                            }}
                        >
                            Post a Job
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#64748b",
                            }}
                        >
                            Create a new opportunity
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                backgroundColor:
                                    "#dbeafe",
                                color: "#2563eb",
                                fontWeight: 700,
                            }}
                        >
                            {user?.firstName
                                ?.charAt(0)
                                ?.toUpperCase() || "E"}
                        </Avatar>

                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                }}
                            >
                                {user?.firstName || "Employer"}{" "}
                                {user?.lastName || ""}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#64748b",
                                }}
                            >
                                Employer
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* PAGE CONTENT */}
                <Container
                    maxWidth="lg"
                    sx={{
                        py: {
                            xs: 3,
                            md: 5,
                        },
                    }}
                >
                    {/* BACK BUTTON */}
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                        sx={{
                            mb: 3,
                            color: "#475569",
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Back to My Job Postings
                    </Button>

                    {/* PAGE TITLE */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                            }}
                        >
                            Create a new job
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                mt: 1,
                            }}
                        >
                            Share an opportunity and
                            connect with qualified
                            candidates.
                        </Typography>
                    </Box>

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
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* SUCCESS */}
                    {success && (
                        <Alert
                            severity="success"
                            onClose={() =>
                                setSuccess("")
                            }
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* FORM */}
                    <Paper
                        elevation={0}
                        sx={{
                            border:
                                "1px solid #e2e8f0",
                            borderRadius: 3,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {/* FORM HEADER */}
                            <Box
                                sx={{
                                    px: {
                                        xs: 2.5,
                                        md: 4,
                                    },
                                    py: 3,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "#dbeafe",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            color: "#2563eb",
                                        }}
                                    >
                                        <Work />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Job Information
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    "#64748b",
                                            }}
                                        >
                                            Provide the
                                            details
                                            candidates
                                            need.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* FORM BODY */}
                            <Box
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        md: 4,
                                    },
                                }}
                            >
                                {/* JOB TITLE */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color:
                                                "#334155",
                                        }}
                                    >
                                        Job Title
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        name="jobTitle"
                                        value={
                                            formData.jobTitle
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Software Engineering Intern"
                                        disabled={
                                            submitting
                                        }
                                    />
                                </Box>

                                {/* CATEGORY + TYPE */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            {
                                                xs: "1fr",
                                                md: "1fr 1fr",
                                            },
                                        gap: 3,
                                        mb: 3,
                                    }}
                                >
                                    {/* CATEGORY */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color:
                                                    "#334155",
                                            }}
                                        >
                                            Job Category
                                        </Typography>

                                        <TextField
                                            select
                                            fullWidth
                                            name="categoryId"
                                            value={
                                                formData.categoryId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                loadingCategories ||
                                                submitting
                                            }
                                            helperText={
                                                loadingCategories
                                                    ? "Loading categories..."
                                                    : "Select a category"
                                            }
                                        >
                                            <MenuItem value="">
                                                Select a
                                                category
                                            </MenuItem>

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
                                    </Box>

                                    {/* JOB TYPE */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color:
                                                    "#334155",
                                            }}
                                        >
                                            Job Type
                                        </Typography>

                                        <TextField
                                            select
                                            fullWidth
                                            name="jobType"
                                            value={
                                                formData.jobType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                submitting
                                            }
                                        >
                                            <MenuItem value="">
                                                Select job
                                                type
                                            </MenuItem>

                                            <MenuItem value="Full-time">
                                                Full-time
                                            </MenuItem>

                                            <MenuItem value="Part-time">
                                                Part-time
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
                                    </Box>
                                </Box>

                                {/* LOCATION + DEADLINE */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            {
                                                xs: "1fr",
                                                md: "1fr 1fr",
                                            },
                                        gap: 3,
                                        mb: 3,
                                    }}
                                >
                                    {/* LOCATION */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color:
                                                    "#334155",
                                            }}
                                        >
                                            Location
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            name="location"
                                            value={
                                                formData.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Accra, Ghana"
                                            disabled={
                                                submitting
                                            }
                                            InputProps={{
                                                startAdornment:
                                                    (
                                                        <LocationOn
                                                            sx={{
                                                                mr: 1,
                                                                color:
                                                                    "#94a3b8",
                                                            }}
                                                        />
                                                    ),
                                            }}
                                        />
                                    </Box>

                                    {/* DEADLINE */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                color:
                                                    "#334155",
                                            }}
                                        >
                                            Application
                                            Deadline
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            type="date"
                                            name="applicationDeadline"
                                            value={
                                                formData.applicationDeadline
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                submitting
                                            }
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                startAdornment:
                                                    (
                                                        <CalendarToday
                                                            sx={{
                                                                mr: 1,
                                                                color:
                                                                    "#94a3b8",
                                                            }}
                                                        />
                                                    ),
                                            }}
                                        />
                                    </Box>
                                </Box>

                                {/* DESCRIPTION */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color:
                                                "#334155",
                                        }}
                                    >
                                        Job Description
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={7}
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe the role, responsibilities, requirements, skills, and what candidates can expect..."
                                        disabled={
                                            submitting
                                        }
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: 1,
                                            mt: 1,
                                            color:
                                                "#64748b",
                                        }}
                                    >
                                        <Description
                                            sx={{
                                                fontSize: 16,
                                            }}
                                        />

                                        <Typography
                                            variant="caption"
                                        >
                                            Give candidates
                                            enough
                                            information to
                                            understand the
                                            opportunity.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* BUTTONS */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "flex-end",
                                        gap: 2,
                                        flexDirection: {
                                            xs: "column-reverse",
                                            sm: "row",
                                        },
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(
                                                "/employer/jobs"
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        sx={{
                                            px: 3,
                                            py: 1.3,
                                            borderRadius: 2,
                                            textTransform:
                                                "none",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={
                                            submitting
                                        }
                                        startIcon={
                                            submitting ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            ) : (
                                                <Add />
                                            )
                                        }
                                        sx={{
                                            px: 4,
                                            py: 1.3,
                                            borderRadius: 2,
                                            textTransform:
                                                "none",
                                            fontWeight: 700,
                                            backgroundColor:
                                                "#2563eb",
                                        }}
                                    >
                                        {submitting
                                            ? "Posting Job..."
                                            : "Post Job"}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default PostJob;

