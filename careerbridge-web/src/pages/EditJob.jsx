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


const fieldStyles = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFDF9",
        borderRadius: 2,
        "& fieldset": {
            borderColor: "#E9DED0",
        },
        "&:hover fieldset": {
            borderColor: "#F4A261",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#E76F51",
        },
    },
    "& .MuiInputLabel-root": {
        color: "#7A7068",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#E76F51",
    },
};


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
                    backgroundColor: "#FFF8EF",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#7A7068",
                        }}
                    >
                        Loading job details...
                    </Typography>
                </Box>
            </Box>
        );
    }


    const firstName =
        user?.firstName ||
        user?.FirstName ||
        "";

    const lastName =
        user?.lastName ||
        user?.LastName ||
        "";

    const initials =
        (
            (firstName.charAt(0) || "") +
            (lastName.charAt(0) || "")
        ).toUpperCase() || "E";


    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                display: "flex",
            }}
        >
            {/* SIDEBAR */}

            <Box
                sx={{
                    width: 250,
                    minHeight: "100vh",
                    backgroundColor: "#293241",
                    color: "#fff",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,

                    "@media (max-width: 900px)": {
                        width: 78,
                    },

                    "@media (max-width: 600px)": {
                        display: "none",
                    },
                }}
            >
                {/* LOGO */}

                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,

                        "@media (max-width: 900px)": {
                            justifyContent: "center",
                            px: 1,
                        },
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
                            fontSize: 18,
                            flexShrink: 0,
                        }}
                    >
                        C
                    </Box>

                    <Box
                        sx={{
                            "@media (max-width: 900px)": {
                                display: "none",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 18,
                                color: "#fff",
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#B9C0C9",
                            }}
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#3A4658",
                        mx: 2,
                    }}
                />

                {/* MENU */}

                <Box
                    sx={{
                        px: 2,
                        mt: 3,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#8993A1",
                            letterSpacing: 1,
                            px: 1.5,
                            mb: 1,

                            "@media (max-width: 900px)": {
                                display: "none",
                            },
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
                                "/employer/applicants"
                            )
                        }
                    />

                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#8993A1",
                            letterSpacing: 1,
                            px: 1.5,
                            mt: 4,
                            mb: 1,

                            "@media (max-width: 900px)": {
                                display: "none",
                            },
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

                {/* LOGOUT */}

                <Box
                    sx={{
                        px: 2,
                        pb: 2,
                    }}
                >
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent:
                                "flex-start",
                            color: "#B9C0C9",
                            textTransform: "none",
                            borderRadius: 2,
                            px: 1.5,
                            py: 1.2,

                            "@media (max-width: 900px)": {
                                minWidth: 0,
                                justifyContent: "center",

                                "& .MuiButton-startIcon": {
                                    margin: 0,
                                },

                                fontSize: 0,
                            },

                            "&:hover": {
                                backgroundColor:
                                    "#3A4658",
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

                    "@media (max-width: 900px)": {
                        marginLeft: "78px",
                        width: "calc(100% - 78px)",
                    },

                    "@media (max-width: 600px)": {
                        marginLeft: 0,
                        width: "100%",
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
                        justifyContent:
                            "space-between",
                        px: {
                            xs: 3,
                            md: 5,
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#7A7068",
                            }}
                        >
                            Employer Portal
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#293241",
                            }}
                        >
                            Edit Job Posting
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                backgroundColor:
                                    "#F4A261",
                                color: "#293241",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                                fontWeight: 800,
                                fontSize: 13,
                            }}
                        >
                            {initials}
                        </Box>

                        <Box
                            sx={{
                                "@media (max-width: 600px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#293241",
                                }}
                            >
                                {firstName ||
                                    "Employer"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#8B8178",
                                }}
                            >
                                Employer
                            </Typography>
                        </Box>
                    </Box>
                </Box>


                {/* PAGE CONTENT */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 5,
                        },
                        py: 4,
                        maxWidth: 1050,
                        margin: "0 auto",
                    }}
                >
                    {/* BACK BUTTON */}

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                `/employer/jobs/${id}`
                            )
                        }
                        sx={{
                            textTransform: "none",
                            color: "#7A7068",
                            mb: 2.5,
                            fontWeight: 600,

                            "&:hover": {
                                backgroundColor:
                                    "#FFF1D6",
                                color: "#E76F51",
                            },
                        }}
                    >
                        Back to Job Details
                    </Button>


                    {/* TITLE */}

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 26,
                                md: 32,
                            },
                            fontWeight: 800,
                            color: "#293241",
                        }}
                    >
                        Edit Job Posting
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            mb: 4,
                            color: "#7A7068",
                            fontSize: 14,
                        }}
                    >
                        Update the information
                        applicants will see.
                    </Typography>


                    {/* ALERTS */}

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


                    {/* FORM */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
                            overflow: "hidden",
                        }}
                    >
                        {/* FORM HEADER */}

                        <Box
                            sx={{
                                p: {
                                    xs: 2.5,
                                    sm: 4,
                                },
                                backgroundColor:
                                    "#FFF1D6",
                                borderBottom:
                                    "1px solid #E9DED0",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 19,
                                    fontWeight: 800,
                                    color: "#293241",
                                }}
                            >
                                Job Information
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#7A7068",
                                    mt: 0.5,
                                }}
                            >
                                Update the details
                                applicants will see.
                            </Typography>
                        </Box>


                        <Box
                            sx={{
                                p: {
                                    xs: 2.5,
                                    sm: 4,
                                },
                            }}
                        >
                            <Box
                                component="form"
                                onSubmit={
                                    handleSubmit
                                }
                            >
                                {/* JOB TITLE */}

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
                                    sx={{
                                        ...fieldStyles,
                                        mb: 3,
                                    }}
                                />


                                {/* CATEGORY */}

                                <TextField
                                    fullWidth
                                    select
                                    label="Job Category"
                                    name="categoryId"
                                    value={
                                        categories.some(
                                            (category) =>
                                                Number(
                                                    category.CategoryID
                                                ) ===
                                                Number(
                                                    formData.categoryId
                                                )
                                        )
                                            ? formData.categoryId
                                            : ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving ||
                                        categories.length ===
                                            0
                                    }
                                    sx={{
                                        ...fieldStyles,
                                        mb: 3,
                                    }}
                                >
                                    <MenuItem value="">
                                        {categories.length ===
                                        0
                                            ? "Loading categories..."
                                            : "Select a category"}
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


                                {/* JOB TYPE */}

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
                                    sx={{
                                        ...fieldStyles,
                                        mb: 3,
                                    }}
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


                                {/* LOCATION */}

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
                                    sx={{
                                        ...fieldStyles,
                                        mb: 3,
                                    }}
                                />


                                {/* DEADLINE */}

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
                                    sx={{
                                        ...fieldStyles,
                                        mb: 3,
                                    }}
                                />


                                {/* DESCRIPTION */}

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
                                    sx={{
                                        ...fieldStyles,
                                        mb: 4,
                                    }}
                                />


                                {/* BUTTONS */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "flex-end",
                                        gap: 2,
                                        flexWrap: "wrap",
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
                                            borderRadius: 2,
                                            px: 3,
                                            color: "#7A7068",
                                            borderColor:
                                                "#D8CABC",

                                            "&:hover": {
                                                borderColor:
                                                    "#E76F51",
                                                backgroundColor:
                                                    "#FFF1D6",
                                            },
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
                                                    size={18}
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
                                            borderRadius: 2,
                                            px: 3,
                                            fontWeight: 700,
                                            backgroundColor:
                                                "#E76F51",

                                            "&:hover": {
                                                backgroundColor:
                                                    "#D95F42",
                                            },
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
                justifyContent: "flex-start",
                textTransform: "none",
                color: active
                    ? "#fff"
                    : "#B9C0C9",
                backgroundColor: active
                    ? "#E76F51"
                    : "transparent",
                borderRadius: 2,
                px: 1.5,
                py: 1.15,
                mb: 0.5,
                fontSize: 13,
                fontWeight: active
                    ? 700
                    : 500,

                "@media (max-width: 900px)": {
                    minWidth: 0,
                    justifyContent: "center",

                    "& .MuiButton-startIcon": {
                        margin: 0,
                    },

                    fontSize: 0,
                },

                "&:hover": {
                    backgroundColor: active
                        ? "#E76F51"
                        : "#3A4658",
                    color: "#fff",
                },
            }}
        >
            {text}
        </Button>
    );
};


export default EditJob;