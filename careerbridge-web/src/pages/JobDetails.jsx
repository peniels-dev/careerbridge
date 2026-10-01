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
        if (!user) {
            navigate(`/login?redirect=/jobs/${id}/apply`);
            return;
        }

        if ((user.Role || user.role) !== "JobSeeker") {
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

    const userRole = user?.Role || user?.role;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#FFF8EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress
                        size={42}
                        thickness={4}
                        sx={{ color: "#E76F51" }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#766B62",
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
                    backgroundColor: "#FFF8EF",
                    py: 6,
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "#FFFDF9",
                            border: "1px solid #E9DED0",
                        }}
                    >
                        <Alert severity="error">{error}</Alert>

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
                                fontWeight: 800,
                                backgroundColor: "#E76F51",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#D85F43",
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
                    backgroundColor: "#FFF8EF",
                    py: 6,
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: "#FFFDF9",
                            border: "1px solid #E9DED0",
                        }}
                    >
                        <Alert severity="warning">
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
                                fontWeight: 800,
                                color: "#E76F51",
                                borderColor: "#E76F51",
                                "&:hover": {
                                    borderColor: "#D85F43",
                                    backgroundColor: "#FFF1D6",
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
    // PAGE
    // =====================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                overflowX: "hidden",
            }}
        >
            {/* =================================================
                NAVIGATION
            ================================================= */}

            <Box
                sx={{
                    backgroundColor: "#FFFDF9",
                    borderBottom: "1px solid #E9DED0",
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            minHeight: {
                                xs: 64,
                                sm: 72,
                            },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Box
                            onClick={() => navigate("/")}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                                cursor: "pointer",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    backgroundColor: "#E76F51",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 900,
                                    fontSize: 19,
                                }}
                            >
                                C
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: {
                                        xs: 18,
                                        sm: 21,
                                    },
                                    color: "#293241",
                                }}
                            >
                                CareerBridge
                            </Typography>
                        </Box>

                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/jobs")}
                            sx={{
                                color: "#5F554D",
                                fontWeight: 800,
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: "#FFF1D6",
                                    color: "#E76F51",
                                },
                            }}
                        >
                            Back to Jobs
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Container
                maxWidth="lg"
                sx={{
                    py: {
                        xs: 3,
                        sm: 4,
                        md: 5,
                    },
                }}
            >
                {/* =================================================
                    JOB HEADER
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 4,
                            md: 5,
                        },
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        boxShadow:
                            "0 10px 30px rgba(94, 69, 50, 0.06)",
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
                            gap: 4,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Chip
                                label={
                                    job.Status
                                        ? "Active position"
                                        : "Position closed"
                                }
                                size="small"
                                sx={{
                                    mb: 2,
                                    fontWeight: 800,
                                    backgroundColor: job.Status
                                        ? "#EDF4E8"
                                        : "#EEEAE6",
                                    color: job.Status
                                        ? "#527D3C"
                                        : "#6F665F",
                                }}
                            />

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: 30,
                                        sm: 38,
                                        md: 48,
                                    },
                                    lineHeight: 1.1,
                                    fontWeight: 900,
                                    letterSpacing: "-1.5px",
                                    color: "#293241",
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
                                    mt: 1.5,
                                    p: 0.5,
                                    ml: -0.5,
                                    minWidth: 0,
                                    maxWidth: "100%",
                                    textTransform: "none",
                                    justifyContent: "flex-start",
                                    color: "#E76F51",
                                    fontSize: {
                                        xs: "0.95rem",
                                        sm: "1.05rem",
                                    },
                                    fontWeight: 800,
                                    textAlign: "left",
                                    overflowWrap: "anywhere",
                                    "&:hover": {
                                        backgroundColor: "#FFF1D6",
                                        color: "#D85F43",
                                    },
                                    "&.Mui-disabled": {
                                        color: "#7A7068",
                                    },
                                }}
                            >
                                {job.CompanyName ||
                                    "Company not specified"}
                            </Button>

                            {job.CompanyID && (
                                <Typography
                                    sx={{
                                        color: "#8A7D73",
                                        fontSize: 12,
                                        mt: 0.5,
                                    }}
                                >
                                    View company profile
                                </Typography>
                            )}
                        </Box>

                        {/* APPLY BUTTON */}

                        {(!user || userRole === "JobSeeker") && (
                            <Button
                                variant="contained"
                                size="large"
                                disabled={userRole === "JobSeeker" && !job.Status}
                                onClick={handleApply}
                                sx={{
                                    minWidth: {
                                        md: 180,
                                    },
                                    minHeight: 52,
                                    px: 4,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 900,
                                    backgroundColor: "#E76F51",
                                    boxShadow: "none",
                                    flexShrink: 0,
                                    "&:hover": {
                                        backgroundColor: "#D85F43",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                {!user
                                    ? "Login to Apply"
                                    : job.Status
                                    ? "Apply Now"
                                    : "Job Closed"}
                            </Button>
                        )}
                    </Box>
                </Paper>

                {/* =================================================
                    QUICK INFORMATION
                ================================================= */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <JobInfoCard
                        icon={<LocationOn />}
                        label="Location"
                        value={job.Location || "Not specified"}
                        iconColor="#6A994E"
                    />

                    <JobInfoCard
                        icon={<Work />}
                        label="Job Type"
                        value={job.JobType || "Not specified"}
                        iconColor="#E76F51"
                    />

                    <JobInfoCard
                        icon={<Description />}
                        label="Category"
                        value={job.CategoryName || "Not specified"}
                        iconColor="#F4A261"
                    />

                    <JobInfoCard
                        icon={<CalendarMonth />}
                        label="Application Deadline"
                        value={formatDate(job.ApplicationDeadline)}
                        iconColor="#6A994E"
                    />
                </Box>

                {/* =================================================
                    JOB DESCRIPTION
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        p: {
                            xs: 2.5,
                            sm: 3.5,
                            md: 4.5,
                        },
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        boxShadow:
                            "0 8px 25px rgba(94, 69, 50, 0.05)",
                    }}
                >
                    <SectionHeading>
                        About the Role
                    </SectionHeading>

                    <Typography
                        sx={{
                            color: "#665C54",
                            whiteSpace: "pre-line",
                            lineHeight: 1.9,
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
                            borderColor: "#E9DED0",
                        }}
                    />

                    <SectionHeading>
                        Requirements
                    </SectionHeading>

                    <Typography
                        sx={{
                            color: "#665C54",
                            whiteSpace: "pre-line",
                            lineHeight: 1.9,
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
                    APPLICATION SECTION
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        p: {
                            xs: 2.5,
                            sm: 3.5,
                            md: 4,
                        },
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        backgroundColor: "#293241",
                        border: "1px solid #293241",
                        boxShadow:
                            "0 10px 30px rgba(41, 50, 65, 0.12)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },
                            justifyContent: "space-between",
                            gap: 3,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    mb: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 2,
                                        backgroundColor: "#E76F51",
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Business />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 19,
                                            sm: 22,
                                        },
                                        fontWeight: 900,
                                        color: "#FFFDF9",
                                    }}
                                >
                                    Ready to apply?
                                </Typography>
                            </Box>

                            {!user && (
                                <Typography
                                    sx={{
                                        color: "#D8CEC5",
                                        lineHeight: 1.7,
                                        fontSize: 14,
                                        maxWidth: 650,
                                    }}
                                >
                                    Sign in as a job seeker to
                                    apply for this opportunity
                                    and submit your CV.
                                </Typography>
                            )}

                            {userRole === "JobSeeker" && (
                                <Typography
                                    sx={{
                                        color: "#D8CEC5",
                                        lineHeight: 1.7,
                                        fontSize: 14,
                                        maxWidth: 650,
                                    }}
                                >
                                    Choose one of your saved
                                    CVs and submit your
                                    application for this
                                    opportunity.
                                </Typography>
                            )}

                            {user && userRole !== "JobSeeker" && (
                                <Typography
                                    sx={{
                                        color: "#D8CEC5",
                                        lineHeight: 1.7,
                                        fontSize: 14,
                                        maxWidth: 650,
                                    }}
                                >
                                    Applications for this
                                    position are available
                                    to registered job seekers.
                                </Typography>
                            )}
                        </Box>

                        {(!user || userRole === "JobSeeker") && (
                            <Button
                                variant="contained"
                                size="large"
                                disabled={
                                    userRole === "JobSeeker" &&
                                    !job.Status
                                }
                                onClick={handleApply}
                                sx={{
                                    minWidth: {
                                        sm: 190,
                                    },
                                    minHeight: 48,
                                    px: 3,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 900,
                                    backgroundColor: "#E76F51",
                                    boxShadow: "none",
                                    flexShrink: 0,
                                    "&:hover": {
                                        backgroundColor: "#D85F43",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                {!user
                                    ? "Login to Apply"
                                    : job.Status
                                    ? "Apply for this Job"
                                    : "Job Closed"}
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* =================================================
                FOOTER
            ================================================= */}

            <Box
                sx={{
                    backgroundColor: "#293241",
                    py: {
                        xs: 4,
                        md: 5,
                    },
                    mt: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "flex-start",
                                md: "center",
                            },
                            gap: 2,
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: "#FFFDF9",
                                    fontWeight: 900,
                                    fontSize: 20,
                                    mb: 0.4,
                                }}
                            >
                                CareerBridge
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#D8CEC5",
                                    fontSize: 13,
                                }}
                            >
                                Find jobs and internship
                                opportunities.
                            </Typography>
                        </Box>

                        <Button
                            onClick={() => navigate("/jobs")}
                            sx={{
                                color: "#FFFDF9",
                                textTransform: "none",
                                fontWeight: 800,
                                border: "1px solid #756C64",
                                borderRadius: 2,
                                px: 2.5,
                                "&:hover": {
                                    backgroundColor: "#3A4555",
                                    borderColor: "#9B9188",
                                },
                            }}
                        >
                            Browse Jobs
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

// =====================================================
// SECTION HEADING
// =====================================================

const SectionHeading = ({ children }) => {
    return (
        <Typography
            component="h2"
            sx={{
                fontSize: {
                    xs: 20,
                    sm: 22,
                    md: 24,
                },
                fontWeight: 900,
                color: "#293241",
                mb: 2,
            }}
        >
            {children}
        </Typography>
    );
};

// =====================================================
// JOB INFORMATION CARD
// =====================================================

const JobInfoCard = ({
    icon,
    label,
    value,
    iconColor,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2,
                    sm: 2.3,
                },
                borderRadius: 2.5,
                backgroundColor: "#FFFDF9",
                border: "1px solid #E9DED0",
                minWidth: 0,
                boxShadow:
                    "0 5px 15px rgba(94, 69, 50, 0.035)",
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
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        backgroundColor: "#FFF1D6",
                        color: iconColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: "#8A7D73",
                            fontSize: 11,
                            fontWeight: 700,
                            mb: 0.3,
                        }}
                    >
                        {label}
                    </Typography>

                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "#293241",
                            fontSize: {
                                xs: 13,
                                sm: 14,
                            },
                            overflowWrap: "anywhere",
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default JobDetails;