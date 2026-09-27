
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

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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

                const response = await axiosAPI.get(
                    `/jobs/${id}`
                );

                setJob(response.data.data);
            } catch (error) {
                console.error(
                    "Error fetching job:",
                    error
                );

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
    // GO TO APPLICATION PAGE
    // =====================================================

    const handleApply = () => {
        navigate(`/jobs/${id}/apply`);
    };

    // =====================================================
    // GO TO COMPANY PROFILE
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

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Container
                maxWidth="lg"
                sx={{
                    py: 10,
                    textAlign: "center",
                }}
            >
                <CircularProgress />

                <Typography
                    sx={{ mt: 2 }}
                    color="text.secondary"
                >
                    Loading job details...
                </Typography>
            </Container>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Container
                maxWidth="lg"
                sx={{ py: 6 }}
            >
                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
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
                    onClick={() => navigate("/jobs")}
                >
                    Back to Jobs
                </Button>
            </Container>
        );
    }

    // =====================================================
    // NO JOB
    // =====================================================

    if (!job) {
        return (
            <Container
                maxWidth="lg"
                sx={{ py: 6 }}
            >
                <Alert severity="warning">
                    Job information could not be found.
                </Alert>
            </Container>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f6f8fb",
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            <Container maxWidth="lg">

                {/* Back button */}

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/jobs")}
                    sx={{
                        mb: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#2563eb",
                    }}
                >
                    Back to Jobs
                </Button>

                {/* =====================================================
                    JOB HEADER
                ===================================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 3,
                            md: 5,
                        },
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        mb: 3,
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
                            gap: 3,
                        }}
                    >
                        <Box>
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
                                    mb: 2,
                                    fontWeight: 600,
                                }}
                            />

                            <Typography
                                variant="h3"
                                fontWeight={800}
                                sx={{
                                    fontSize: {
                                        xs: "2rem",
                                        md: "3rem",
                                    },
                                    lineHeight: 1.15,
                                    mb: 1.5,
                                }}
                            >
                                {job.JobTitle}
                            </Typography>

                            {/* =====================================================
                                COMPANY PROFILE LINK
                            ===================================================== */}

                            <Button
                                startIcon={<Business />}
                                onClick={handleViewCompany}
                                disabled={!job.CompanyID}
                                sx={{
                                    p: 0,
                                    minWidth: 0,
                                    textTransform: "none",
                                    justifyContent: "flex-start",
                                    color: "#2563eb",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor:
                                            "#eff6ff",
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
                                    variant="body2"
                                    sx={{
                                        mt: 0.5,
                                        color: "#6b7280",
                                    }}
                                >
                                    View company profile
                                </Typography>
                            )}
                        </Box>

                        {/* Apply button */}

                        <Button
                            variant="contained"
                            size="large"
                            disabled={!job.Status}
                            onClick={handleApply}
                            sx={{
                                alignSelf: {
                                    xs: "stretch",
                                    md: "center",
                                },
                                px: 4,
                                py: 1.5,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "#2563eb",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor:
                                        "#1d4ed8",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Apply Now
                        </Button>
                    </Box>
                </Paper>

                {/* =====================================================
                    JOB INFORMATION CARDS
                ===================================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    {/* Location */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <LocationOn color="primary" />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Location
                        </Typography>

                        <Typography fontWeight={700}>
                            {job.Location ||
                                "Not specified"}
                        </Typography>
                    </Paper>

                    {/* Job Type */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <Work color="primary" />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Job Type
                        </Typography>

                        <Typography fontWeight={700}>
                            {job.JobType ||
                                "Not specified"}
                        </Typography>
                    </Paper>

                    {/* Category */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <Description color="primary" />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Category
                        </Typography>

                        <Typography fontWeight={700}>
                            {job.CategoryName ||
                                "Not specified"}
                        </Typography>
                    </Paper>

                    {/* Deadline */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <CalendarMonth color="primary" />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Deadline
                        </Typography>

                        <Typography fontWeight={700}>
                            {formatDate(
                                job.ApplicationDeadline
                            )}
                        </Typography>
                    </Paper>
                </Box>

                {/* =====================================================
                    DESCRIPTION + SIDEBAR
                ===================================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "2fr 1fr",
                        },
                        gap: 3,
                    }}
                >
                    {/* Main content */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 4,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            sx={{ mb: 2 }}
                        >
                            About the Role
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                whiteSpace: "pre-line",
                                lineHeight: 1.8,
                            }}
                        >
                            {job.Description ||
                                "No description provided."}
                        </Typography>

                        <Divider
                            sx={{ my: 4 }}
                        />

                        <Typography
                            variant="h5"
                            fontWeight={800}
                            sx={{ mb: 2 }}
                        >
                            Requirements
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                whiteSpace: "pre-line",
                                lineHeight: 1.8,
                            }}
                        >
                            {job.Requirements ||
                                "No requirements provided."}
                        </Typography>
                    </Paper>

                    {/* Sidebar */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            border: "1px solid #e5e7eb",
                            height: "fit-content",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ mb: 2 }}
                        >
                            Interested in this position?
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.7,
                                mb: 3,
                            }}
                        >
                            Select one of your saved CVs
                            and write a cover letter to
                            apply for this opportunity.
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={!job.Status}
                            onClick={handleApply}
                            sx={{
                                py: 1.4,
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "#2563eb",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor:
                                        "#1d4ed8",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Apply for this Job
                        </Button>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default JobDetails;

