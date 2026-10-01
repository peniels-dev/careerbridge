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

                const response = await axiosAPI.get("/categories");

                setCategories(response.data?.data || []);
            } catch (err) {
                console.error("Category loading error:", err);

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
            setError("Please select an application deadline.");
            return;
        }

        // -------------------------------
        // SEND TO BACKEND
        // -------------------------------
        try {
            setSubmitting(true);

            const jobData = {
                JobTitle: formData.jobTitle.trim(),
                CategoryID: Number(formData.categoryId),
                Description: formData.description.trim(),
                Location: formData.location.trim(),
                JobType: formData.jobType,
                ApplicationDeadline: formData.applicationDeadline,
            };

            const response = await axiosAPI.post("/jobs", jobData);

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
            console.error("POST JOB ERROR:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to post the job. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const firstName =
        user?.firstName ||
        user?.FirstName ||
        "Employer";

    const lastName =
        user?.lastName ||
        user?.LastName ||
        "";

    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`
            .trim()
            .toUpperCase() || "E";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                display: "flex",
            }}
        >
            {/* ==========================================
                SIDEBAR
            ========================================== */}
            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#293241",
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
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                backgroundColor: "#E76F51",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: 20,
                            }}
                        >
                            C
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    lineHeight: 1,
                                }}
                            >
                                CareerBridge
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#AEB7C4",
                                }}
                            >
                                Employer Portal
                            </Typography>
                        </Box>
                    </Box>
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
                            color: "#8D98A8",
                            px: 2,
                            mb: 1,
                            display: "block",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontWeight: 700,
                        }}
                    >
                        Workspace
                    </Typography>

                    <SidebarItem
                        icon={<Dashboard />}
                        label="Dashboard"
                        onClick={() =>
                            navigate("/employer-dashboard")
                        }
                    />

                    <SidebarItem
                        icon={<Work />}
                        label="My Job Postings"
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                    />

                    <SidebarItem
                        icon={<Add />}
                        label="Post a Job"
                        active
                        onClick={() =>
                            navigate("/employer/post-job")
                        }
                    />

                    <SidebarItem
                        icon={<People />}
                        label="Applicants"
                        onClick={() =>
                            navigate("/employer/applicants")
                        }
                    />

                    <SidebarItem
                        icon={<Business />}
                        label="Company Profile"
                        onClick={() =>
                            navigate("/company-profile")
                        }
                    />
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
                            color: "#B8C0CB",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor:
                                    "rgba(255,255,255,0.06)",
                                color: "white",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* ==========================================
                MAIN CONTENT
            ========================================== */}
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
                        backgroundColor: "#FFFDF9",
                        borderBottom:
                            "1px solid #E9DED0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: {
                            xs: 2,
                            md: 4,
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#293241",
                                fontSize: 16,
                            }}
                        >
                            Post a Job
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#7A7068",
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
                                width: 40,
                                height: 40,
                                backgroundColor: "#F4A261",
                                color: "#293241",
                                fontWeight: 800,
                                fontSize: 14,
                            }}
                        >
                            {initials}
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
                                    color: "#293241",
                                }}
                            >
                                {firstName} {lastName}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#7A7068",
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
                            color: "#6F665F",
                            textTransform: "none",
                            fontWeight: 700,
                            px: 0,
                            "&:hover": {
                                backgroundColor: "transparent",
                                color: "#E76F51",
                            },
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
                                color: "#293241",
                                fontSize: {
                                    xs: 30,
                                    md: 36,
                                },
                            }}
                        >
                            Create a new job
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7A7068",
                                mt: 1,
                                maxWidth: 650,
                                lineHeight: 1.7,
                            }}
                        >
                            Share an opportunity and connect
                            with qualified candidates.
                        </Typography>
                    </Box>

                    {/* ERROR */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError("")}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                border: "1px solid #E8C7C0",
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* SUCCESS */}
                    {success && (
                        <Alert
                            severity="success"
                            onClose={() => setSuccess("")}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                border: "1px solid #C9DDBE",
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* FORM */}
                    <Paper
                        elevation={0}
                        sx={{
                            backgroundColor: "#FFFDF9",
                            border:
                                "1px solid #E9DED0",
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
                                    backgroundColor: "#FFF1D6",
                                    borderBottom:
                                        "1px solid #E9DED0",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "#E76F51",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent:
                                                "center",
                                            color: "white",
                                        }}
                                    >
                                        <Work />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#293241",
                                            }}
                                        >
                                            Job Information
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#7A7068",
                                                mt: 0.3,
                                            }}
                                        >
                                            Provide the details
                                            candidates need.
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
                                <FormLabel>
                                    Job Title
                                </FormLabel>

                                <TextField
                                    fullWidth
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineering Intern"
                                    disabled={submitting}
                                    sx={fieldStyles}
                                />

                                {/* CATEGORY + TYPE */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "1fr 1fr",
                                        },
                                        gap: 3,
                                        mt: 3,
                                    }}
                                >
                                    <Box>
                                        <FormLabel>
                                            Job Category
                                        </FormLabel>

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
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="">
                                                Select a category
                                            </MenuItem>

                                            {categories.map(
                                                (category) => (
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

                                    <Box>
                                        <FormLabel>
                                            Job Type
                                        </FormLabel>

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
                                            disabled={submitting}
                                            sx={fieldStyles}
                                        >
                                            <MenuItem value="">
                                                Select job type
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
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "1fr 1fr",
                                        },
                                        gap: 3,
                                        mt: 3,
                                    }}
                                >
                                    <Box>
                                        <FormLabel>
                                            Location
                                        </FormLabel>

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
                                            disabled={submitting}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <LocationOn
                                                            sx={{
                                                                mr: 1,
                                                                color: "#E76F51",
                                                            }}
                                                        />
                                                    ),
                                                },
                                            }}
                                            sx={fieldStyles}
                                        />
                                    </Box>

                                    <Box>
                                        <FormLabel>
                                            Application Deadline
                                        </FormLabel>

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
                                            disabled={submitting}
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: true,
                                                },
                                                input: {
                                                    startAdornment: (
                                                        <CalendarToday
                                                            sx={{
                                                                mr: 1,
                                                                color: "#E76F51",
                                                                fontSize: 19,
                                                            }}
                                                        />
                                                    ),
                                                },
                                            }}
                                            sx={fieldStyles}
                                        />
                                    </Box>
                                </Box>

                                {/* DESCRIPTION */}
                                <Box sx={{ mt: 3, mb: 4 }}>
                                    <FormLabel>
                                        Job Description
                                    </FormLabel>

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
                                        disabled={submitting}
                                        sx={fieldStyles}
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mt: 1,
                                            color: "#8A817A",
                                        }}
                                    >
                                        <Description
                                            sx={{
                                                fontSize: 17,
                                                color: "#E76F51",
                                            }}
                                        />

                                        <Typography
                                            variant="caption"
                                        >
                                            Give candidates enough
                                            information to understand
                                            the opportunity.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider
                                    sx={{
                                        mb: 3,
                                        borderColor:
                                            "#E9DED0",
                                    }}
                                />

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
                                        disabled={submitting}
                                        sx={{
                                            px: 3,
                                            py: 1.3,
                                            borderRadius: 2,
                                            textTransform:
                                                "none",
                                            fontWeight: 700,
                                            color: "#6F665F",
                                            borderColor:
                                                "#D8CBBE",
                                            "&:hover": {
                                                borderColor:
                                                    "#B9A99A",
                                                backgroundColor:
                                                    "#FFF8EF",
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={submitting}
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
                                            fontWeight: 800,
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

// ==========================================
// SIDEBAR ITEM
// ==========================================
const SidebarItem = ({
    icon,
    label,
    active = false,
    onClick,
}) => {
    return (
        <Button
            fullWidth
            startIcon={icon}
            onClick={onClick}
            sx={{
                justifyContent: "flex-start",
                color: active ? "white" : "#C1C9D3",
                backgroundColor: active
                    ? "#E76F51"
                    : "transparent",
                px: 2,
                py: 1.3,
                mb: 0.6,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: active ? 700 : 500,
                "&:hover": {
                    backgroundColor: active
                        ? "#E76F51"
                        : "#374354",
                    color: "white",
                },
            }}
        >
            {label}
        </Button>
    );
};

// ==========================================
// FORM LABEL
// ==========================================
const FormLabel = ({ children }) => {
    return (
        <Typography
            sx={{
                fontWeight: 700,
                mb: 1,
                color: "#3B454F",
                display: "block",
            }}
        >
            {children}
        </Typography>
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

    "& .MuiFormHelperText-root": {
        color: "#8A817A",
        marginLeft: 0,
    },
};

export default PostJob;