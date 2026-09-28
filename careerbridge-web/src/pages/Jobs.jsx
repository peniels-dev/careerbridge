import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import { ArrowBack } from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

import JobCard from "../components/JobCard";

import JobFilters from "../components/JobFilters";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [categoriesError, setCategoriesError] =
        useState("");

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sort, setSort] = useState("newest");

    const navigate = useNavigate();

    // ======================================================
    // LOAD CATEGORIES
    // ======================================================

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            setCategoriesError("");

            const response = await axiosAPI.get(
                "/categories"
            );

            const returnedCategories =
                response.data?.data ||
                response.data?.categories ||
                [];

            setCategories(returnedCategories);
        } catch (err) {
            console.error(
                "Error loading categories:",
                err
            );

            setCategoriesError(
                err.response?.data?.message ||
                    "Unable to load categories."
            );

            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    // ======================================================
    // LOAD ACTIVE JOBS
    // ======================================================

    const fetchJobs = async (filters = {}) => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (filters.search?.trim()) {
                params.search =
                    filters.search.trim();
            }

            if (filters.location?.trim()) {
                params.location =
                    filters.location.trim();
            }

            if (filters.jobType) {
                params.jobType =
                    filters.jobType;
            }

            if (filters.categoryId) {
                params.categoryId =
                    filters.categoryId;
            }

            if (filters.sort) {
                params.sort =
                    filters.sort;
            }

            // IMPORTANT:
            // Job Seekers use /jobs/active
            // instead of /jobs.
            //
            // The backend sends this request to:
            // getActiveJobs
            //
            // which uses:
            // dbo.uspJobsGetActive
            //
            // The stored procedure contains:
            // WHERE j.Status = 1
            //
            // Therefore closed jobs are not returned.

            const response = await axiosAPI.get(
                "/jobs/active",
                {
                    params,
                }
            );

            const returnedJobs =
                response.data?.data ||
                response.data?.jobs ||
                [];

            setJobs(returnedJobs);
        } catch (err) {
            console.error(
                "Error loading active jobs:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load jobs. Please try again."
            );

            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        fetchJobs({
            sort: "newest",
        });

        fetchCategories();
    }, []);

    // ======================================================
    // SEARCH
    // ======================================================

    const handleSearch = () => {
        fetchJobs({
            search,
            location,
            jobType,
            categoryId,
            sort,
        });
    };

    // ======================================================
    // CLEAR FILTERS
    // ======================================================

    const handleClear = () => {
        setSearch("");
        setLocation("");
        setJobType("");
        setCategoryId("");
        setSort("newest");

        fetchJobs({
            sort: "newest",
        });
    };

    // ======================================================
    // VIEW JOB DETAILS
    // ======================================================

    const handleViewDetails = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    // ======================================================
    // BACK TO DASHBOARD
    // ======================================================

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 3,
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
                    onClick={handleBackToDashboard}
                    sx={{
                        mb: {
                            xs: 2.5,
                            sm: 3,
                        },
                        px: 1,
                        color: "#475467",
                        fontWeight: 600,
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor:
                                "#eef2f6",
                            color: "#1d4ed8",
                        },
                    }}
                >
                    Back to Dashboard
                </Button>

                {/* PAGE HEADER */}

                <Box
                    sx={{
                        mb: {
                            xs: 2.5,
                            sm: 3.5,
                            md: 4,
                        },
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: 28,
                                sm: 34,
                                md: 40,
                            },
                            lineHeight: 1.15,
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing:
                                "-0.7px",
                            mb: 1,
                        }}
                    >
                        Find Jobs
                    </Typography>

                    <Typography
                        sx={{
                            color: "#667085",
                            fontSize: {
                                xs: 13,
                                sm: 15,
                            },
                            lineHeight: 1.6,
                            maxWidth: 700,
                        }}
                    >
                        Browse, search and filter
                        available job and internship
                        opportunities on CareerBridge.
                    </Typography>
                </Box>

                {/* CATEGORY ERROR */}

                {categoriesError && (
                    <Alert
                        severity="warning"
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                        }}
                    >
                        {categoriesError}
                    </Alert>
                )}

                {/* FILTERS */}

                <Box
                    sx={{
                        mb: {
                            xs: 3,
                            sm: 4,
                        },
                    }}
                >
                    <JobFilters
                        search={search}
                        location={location}
                        jobType={jobType}
                        categoryId={categoryId}
                        sort={sort}
                        categories={categories}
                        categoriesLoading={
                            categoriesLoading
                        }
                        onSearchChange={setSearch}
                        onLocationChange={
                            setLocation
                        }
                        onJobTypeChange={
                            setJobType
                        }
                        onCategoryChange={
                            setCategoryId
                        }
                        onSortChange={(newSort) => {
                            setSort(newSort);

                            fetchJobs({
                                search,
                                location,
                                jobType,
                                categoryId,
                                sort: newSort,
                            });
                        }}
                        onSearch={handleSearch}
                        onClear={handleClear}
                    />
                </Box>

                {/* RESULTS HEADER */}

                {!loading && !error && (
                    <Box
                        sx={{
                            mb: 2.5,
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            justifyContent:
                                "space-between",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 16,
                                    sm: 18,
                                },
                                fontWeight: 700,
                                color: "#172033",
                            }}
                        >
                            {jobs.length}{" "}
                            {jobs.length === 1
                                ? "opportunity"
                                : "opportunities"}{" "}
                            found
                        </Typography>

                        {jobs.length > 0 && (
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#667085",
                                }}
                            >
                                Showing available
                                opportunities
                            </Typography>
                        )}
                    </Box>
                )}

                {/* LOADING */}

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            py: {
                                xs: 7,
                                sm: 9,
                            },
                        }}
                    >
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
                            Loading opportunities...
                        </Typography>
                    </Box>
                )}

                {/* ERROR */}

                {error && !loading && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            alignItems: "center",
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    jobs.length === 0 && (
                        <Box
                            sx={{
                                backgroundColor:
                                    "white",
                                border:
                                    "1px solid #e5e7eb",
                                borderRadius: 3,
                                px: {
                                    xs: 2.5,
                                    sm: 4,
                                },
                                py: {
                                    xs: 4,
                                    sm: 5,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 18,
                                        sm: 20,
                                    },
                                    fontWeight: 800,
                                    color: "#172033",
                                    mb: 1,
                                }}
                            >
                                No opportunities
                                found
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#667085",
                                    fontSize: {
                                        xs: 13,
                                        sm: 14,
                                    },
                                    lineHeight: 1.6,
                                    maxWidth: 500,
                                    mx: "auto",
                                }}
                            >
                                We couldn't find any
                                active jobs matching
                                your current search
                                or filters. Try
                                changing your search
                                criteria.
                            </Typography>
                        </Box>
                    )}

                {/* JOBS */}

                {!loading &&
                    !error &&
                    jobs.length > 0 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))",
                                },
                                gap: {
                                    xs: 2,
                                    sm: 2.5,
                                    md: 3,
                                },
                                alignItems: "stretch",
                            }}
                        >
                            {jobs.map((job) => (
                                <Box
                                    key={job.JobID}
                                    sx={{
                                        minWidth: 0,
                                        display: "flex",
                                    }}
                                >
                                    <JobCard
                                        job={job}
                                        onViewDetails={
                                            handleViewDetails
                                        }
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
            </Container>
        </Box>
    );
}

export default Jobs;