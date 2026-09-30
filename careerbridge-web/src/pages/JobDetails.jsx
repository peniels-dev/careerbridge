import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Business,
    CalendarMonth,
    Description,
    LocationOn,
    Work,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH JOB
    // =====================================================

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosAPI.get(`/jobs/${id}`);

                setJob(response.data.data);
            } catch (error) {
                console.error("Error fetching job:", error);

                if (error.response?.status === 404) {
                    setError("Job not found.");
                } else {
                    setError(
                        "Unable to load job details. Please try again."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    // =====================================================
    // APPLY
    // =====================================================

    const handleApply = () => {
        // Public visitor
        if (!user) {
            navigate(`/login?redirect=/jobs/${id}/apply`);
            return;
        }

        // Only JobSeekers can apply
        if (user.Role !== "JobSeeker") {
            return;
        }

        navigate(`/jobs/${id}/apply`);
    };

    // =====================================================
    // COMPANY PROFILE
    // =====================================================

    const handleViewCompany = () => {
        if (job?.CompanyID) {
            navigate(`/companies/${job.CompanyID}`);
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "Not specified";
        }

        return new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress
                        size={42}
                        thickness={4}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#667085",
                            fontSize: 14,
                        }}
                    >
                        Loading job details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
                    py: {
                        xs: 4,
                        sm: 6,
                    },
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 4,
                            },
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            {error}
                        </Alert>

                        <Button
                            variant="contained"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/jobs")}
                            sx={{
                                mt: 3,
                                minHeight: 44,
                                px: 3,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "#2563eb",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#1d4ed8",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Back to Jobs
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // =====================================================
    // NO JOB
    // =====================================================

    if (!job) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
                    py: {
                        xs: 4,
                        sm: 6,
                    },
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 4,
                            },
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <Alert
                            severity="warning"
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            Job information could not be found.
                        </Alert>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/jobs")}
                            sx={{
                                mt: 3,
                                minHeight: 44,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Back to Jobs
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 2.5,
                    sm: 4,
                    md: 5,
                },
                overflowX: "hidden",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* BACK BUTTON */}

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/jobs")}
                    sx={{
                        mb: {
                            xs: 2,
                            sm: 3,
                        },
                        minHeight: 40,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#2563eb",
                        px: 1,
                        "&:hover": {
                            backgroundColor: "#eff6ff",
                        },
                    }}
                >
                    Back to Jobs
                </Button>

                {/* =================================================
                    JOB HEADER
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 3.5,
                            md: 5,
                        },
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        border: "1px solid #e5e7eb",
                        mb: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "stretch",
                                md: "center",
                            },
                            gap: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >
                        {/* JOB TITLE / COMPANY */}

                        <Box
                            sx={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            <Chip
                                label={
                                    job.Status
                                        ? "Active"
                                        : "Closed"
                                }
                                color={
                                    job.Status
                                        ? "success"
                                        : "default"
                                }
                                size="small"
                                sx={{
                                    mb: 1.8,
                                    fontWeight: 700,
                                }}
                            />

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: 28,
                                        sm: 34,
                                        md: 42,
                                    },
                                    lineHeight: 1.15,
                                    fontWeight: 800,
                                    letterSpacing: "-0.7px",
                                    color: "#111827",
                                    mb: 1.5,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {job.JobTitle}
                            </Typography>

                            <Button
                                startIcon={<Business />}
                                onClick={handleViewCompany}
                                disabled={!job.CompanyID}
                                sx={{
                                    p: 0.5,
                                    ml: -0.5,
                                    minWidth: 0,
                                    maxWidth: "100%",
                                    textTransform: "none",
                                    justifyContent: "flex-start",
                                    color: "#2563eb",
                                    fontSize: {
                                        xs: "0.95rem",
                                        sm: "1.05rem",
                                    },
                                    fontWeight: 700,
                                    borderRadius: 1,
                                    textAlign: "left",
                                    overflowWrap: "anywhere",
                                    "&:hover": {
                                        backgroundColor: "#eff6ff",
                                        color: "#1d4ed8",
                                    },
                                    "&.Mui-disabled": {
                                        color: "#6b7280",
                                    },
                                }}
                            >
                                {job.CompanyName ||
                                    "Company not specified"}
                            </Button>

                            {job.CompanyID && (
                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        color: "#667085",
                                        fontSize: 12,
                                    }}
                                >
                                    View company profile
                                </Typography>
                            )}
                        </Box>

                        {/* =================================================
                            HEADER APPLY BUTTON
                        ================================================= */}

                        {!user ? (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleApply}
                                fullWidth
                                sx={{
                                    width: {
                                        xs: "100%",
                                        md: "auto",
                                    },
                                    minWidth: {
                                        md: 170,
                                    },
                                    minHeight: 48,
                                    alignSelf: {
                                        xs: "stretch",
                                        md: "center",
                                    },
                                    px: 4,
                                    py: 1.4,
                                    borderRadius: 2.5,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    backgroundColor: "#2563eb",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "#1d4ed8",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Login to Apply
                            </Button>
                        ) : user.Role === "JobSeeker" ? (
                            <Button
                                variant="contained"
                                size="large"
                                disabled={!job.Status}
                                onClick={handleApply}
                                fullWidth
                                sx={{
                                    width: {
                                        xs: "100%",
                                        md: "auto",
                                    },
                                    minWidth: {
                                        md: 170,
                                    },
                                    minHeight: 48,
                                    alignSelf: {
                                        xs: "stretch",
                                        md: "center",
                                    },
                                    px: 4,
                                    py: 1.4,
                                    borderRadius: 2.5,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    backgroundColor: "#2563eb",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "#1d4ed8",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                {job.Status
                                    ? "Apply Now"
                                    : "Job Closed"}
                            </Button>
                        ) : null}
                    </Box>
                </Paper>

                {/* =================================================
                    JOB INFORMATION
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(4, minmax(0, 1fr))",
                        },
                        gap: {
                            xs: 1.5,
                            sm: 2,
                        },
                        mb: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <JobInfoCard
                        icon={<LocationOn />}
                        label="Location"
                        value={
                            job.Location ||
                            "Not specified"
                        }
                    />

                    <JobInfoCard
                        icon={<Work />}
                        label="Job Type"
                        value={
                            job.JobType ||
                            "Not specified"
                        }
                    />

                    <JobInfoCard
                        icon={<Description />}
                        label="Category"
                        value={
                            job.CategoryName ||
                            "Not specified"
                        }
                    />

                    <JobInfoCard
                        icon={<CalendarMonth />}
                        label="Deadline"
                        value={formatDate(
                            job.ApplicationDeadline
                        )}
                    />
                </Box>

                {/* =================================================
                    DESCRIPTION + SIDEBAR
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "minmax(0, 2fr) minmax(280px, 1fr)",
                        },
                        gap: {
                            xs: 2,
                            md: 3,
                        },
                        alignItems: "start",
                    }}
                >
                    {/* MAIN CONTENT */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 3,
                                md: 4,
                            },
                            borderRadius: {
                                xs: 3,
                                md: 4,
                            },
                            border: "1px solid #e5e7eb",
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 20,
                                    sm: 22,
                                    md: 24,
                                },
                                fontWeight: 800,
                                color: "#111827",
                                mb: 2,
                            }}
                        >
                            About the Role
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                whiteSpace: "pre-line",
                                lineHeight: 1.8,
                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                                overflowWrap: "anywhere",
                            }}
                        >
                            {job.Description ||
                                "No description provided."}
                        </Typography>

                        <Divider
                            sx={{
                                my: {
                                    xs: 3,
                                    sm: 4,
                                },
                            }}
                        />

                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 20,
                                    sm: 22,
                                    md: 24,
                                },
                                fontWeight: 800,
                                color: "#111827",
                                mb: 2,
                            }}
                        >
                            Requirements
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                whiteSpace: "pre-line",
                                lineHeight: 1.8,
                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                                overflowWrap: "anywhere",
                            }}
                        >
                            {job.Requirements ||
                                "No requirements provided."}
                        </Typography>
                    </Paper>

                    {/* =================================================
                        APPLICATION SIDEBAR
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 3,
                            },
                            borderRadius: {
                                xs: 3,
                                md: 4,
                            },
                            border: "1px solid #e5e7eb",
                            height: "fit-content",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 18,
                                    sm: 20,
                                },
                                fontWeight: 800,
                                color: "#111827",
                                mb: 1.5,
                            }}
                        >
                            Interested in this position?
                        </Typography>

                        {/* PUBLIC USER */}

                        {!user && (
                            <>
                                <Typography
                                    sx={{
                                        color: "#667085",
                                        lineHeight: 1.7,
                                        mb: 3,
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                    }}
                                >
                                    Sign in as a job seeker
                                    to apply for this
                                    opportunity and submit
                                    your application.
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleApply}
                                    sx={{
                                        minHeight: 46,
                                        py: 1.3,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        backgroundColor: "#2563eb",
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#1d4ed8",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Login to Apply
                                </Button>
                            </>
                        )}

                        {/* JOB SEEKER */}

                        {user?.Role === "JobSeeker" && (
                            <>
                                <Typography
                                    sx={{
                                        color: "#667085",
                                        lineHeight: 1.7,
                                        mb: 3,
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                    }}
                                >
                                    Select one of your
                                    saved CVs and submit
                                    your application for
                                    this opportunity.
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={!job.Status}
                                    onClick={handleApply}
                                    sx={{
                                        minHeight: 46,
                                        py: 1.3,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        backgroundColor: "#2563eb",
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#1d4ed8",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    {job.Status
                                        ? "Apply for this Job"
                                        : "Job Closed"}
                                </Button>
                            </>
                        )}

                        {/* EMPLOYER / ADMIN */}

                        {user &&
                            user.Role !== "JobSeeker" && (
                                <Typography
                                    sx={{
                                        color: "#667085",
                                        lineHeight: 1.7,
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                    }}
                                >
                                    Applications for this
                                    position are available
                                    to registered job
                                    seekers.
                                </Typography>
                            )}
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

// =====================================================
// JOB INFORMATION CARD
// =====================================================

const JobInfoCard = ({
    icon,
    label,
    value,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2,
                    sm: 2.5,
                },
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                minWidth: 0,
                height: "100%",
            }}
        >
            <Box
                sx={{
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                }}
            >
                {icon}
            </Box>

            <Typography
                sx={{
                    color: "#667085",
                    fontSize: 12,
                    mb: 0.5,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontWeight: 700,
                    color: "#172033",
                    fontSize: {
                        xs: 14,
                        sm: 15,
                    },
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </Typography>
        </Paper>
    );
};

export default JobDetails;