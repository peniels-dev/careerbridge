import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import { ArrowBack, BusinessCenter } from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";

function Jobs() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const [error, setError] = useState("");
    const [categoriesError, setCategoriesError] = useState("");

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sort, setSort] = useState("newest");

    const userRole = user?.Role || user?.role;

    // ======================================================
    // LOAD CATEGORIES
    // ======================================================

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            setCategoriesError("");

            const response = await axiosAPI.get("/categories");

            const returnedCategories =
                response.data?.data ||
                response.data?.categories ||
                [];

            setCategories(returnedCategories);
        } catch (err) {
            console.error("Error loading categories:", err);

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
                params.search = filters.search.trim();
            }

            if (filters.location?.trim()) {
                params.location = filters.location.trim();
            }

            if (filters.jobType) {
                params.jobType = filters.jobType;
            }

            if (filters.categoryId) {
                params.categoryId = filters.categoryId;
            }

            if (filters.sort) {
                params.sort = filters.sort;
            }

            const response = await axiosAPI.get("/jobs/active", {
                params,
            });

            const returnedJobs =
                response.data?.data ||
                response.data?.jobs ||
                [];

            setJobs(returnedJobs);
        } catch (err) {
            console.error("Error loading active jobs:", err);

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
    // BACK BUTTON
    // ======================================================

    const handleBack = () => {
        if (userRole === "JobSeeker") {
            navigate("/dashboard");
            return;
        }

        if (userRole === "Employer") {
            navigate("/employer-dashboard");
            return;
        }

        if (userRole === "Admin") {
            navigate("/admin");
            return;
        }

        navigate("/");
    };

    const backButtonText =
        userRole === "JobSeeker" ||
        userRole === "Employer" ||
        userRole === "Admin"
            ? "Back to Dashboard"
            : "Back to Home";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                overflowX: "hidden",
            }}
        >
            {/* ==================================================
                TOP HEADER
            ================================================== */}

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
                        {/* LOGO */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/")}
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
                            onClick={handleBack}
                            startIcon={<ArrowBack />}
                            sx={{
                                color: "#5F554D",
                                fontWeight: 700,
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: "#FFF1D6",
                                    color: "#E76F51",
                                },
                            }}
                        >
                            {backButtonText}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ==================================================
                PAGE INTRO
            ================================================== */}

            <Box
                sx={{
                    backgroundColor: "#FFF8EF",
                    pt: {
                        xs: 5,
                        sm: 6,
                        md: 7,
                    },
                    pb: {
                        xs: 3,
                        sm: 4,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                md: "center",
                            },
                            justifyContent: "space-between",
                            gap: 3,
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: "#E76F51",
                                    fontSize: {
                                        xs: 15,
                                        sm: 17,
                                    },
                                    fontWeight: 900,
                                    letterSpacing: 1.2,
                                    mb: 1,
                                }}
                            >
                                CAREERBRIDGE JOBS
                            </Typography>

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: 34,
                                        sm: 44,
                                        md: 52,
                                    },
                                    lineHeight: 1.08,
                                    fontWeight: 900,
                                    color: "#293241",
                                    letterSpacing: "-1.5px",
                                    mb: 1.5,
                                }}
                            >
                                Find your next opportunity
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#6F6258",
                                    fontSize: {
                                        xs: 14,
                                        sm: 16,
                                    },
                                    lineHeight: 1.7,
                                    maxWidth: 650,
                                }}
                            >
                                Search through available jobs and
                                internships and use the filters to
                                narrow down your results.
                            </Typography>
                        </Box>

                        {/* SMALL VISUAL */}
                    <Box
    sx={{
        display: {
            xs: "none",
            md: "flex",
        },
        width: 150,
        height: 150,
        borderRadius: "50%",
        backgroundColor: "#FFE5CC",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
    }}
>
    <Box
        sx={{
            width: 105,
            height: 105,
            borderRadius: "50%",
            backgroundColor: "#FFF1D6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <BusinessCenter
            sx={{
                fontSize: 58,
                color: "#E76F51",
            }}
        />
    </Box>
</Box>
                    </Box>
                </Container>
            </Box>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <Box
                sx={{
                    backgroundColor: "#FFF8EF",
                    pb: {
                        xs: 7,
                        md: 10,
                    },
                }}
            >
                <Container maxWidth="lg">
                    {/* CATEGORY ERROR */}
                    {categoriesError && (
                        <Alert
                            severity="warning"
                            sx={{
                                mb: 2.5,
                                borderRadius: 2,
                            }}
                        >
                            {categoriesError}
                        </Alert>
                    )}

                    {/* FILTER AREA */}
                    <Box
                        sx={{
                            mb: {
                                xs: 4,
                                sm: 5,
                            },
                            p: {
                                xs: 1,
                                sm: 1.5,
                                md: 2,
                            },
                            backgroundColor: "#FFFDF9",
                            border: "1px solid #E9DED0",
                            borderRadius: 3,
                            boxShadow:
                                "0 8px 25px rgba(94, 69, 50, 0.06)",
                        }}
                    >
                        <JobFilters
                            search={search}
                            location={location}
                            jobType={jobType}
                            categoryId={categoryId}
                            sort={sort}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                            onSearchChange={setSearch}
                            onLocationChange={setLocation}
                            onJobTypeChange={setJobType}
                            onCategoryChange={setCategoryId}
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
                                display: "flex",
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                },
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 3,
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 22,
                                            sm: 26,
                                        },
                                        fontWeight: 900,
                                        color: "#293241",
                                    }}
                                >
                                    {jobs.length}{" "}
                                    {jobs.length === 1
                                        ? "opportunity"
                                        : "opportunities"}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#7A7068",
                                        fontSize: 13,
                                        mt: 0.3,
                                    }}
                                >
                                    Available on CareerBridge
                                </Typography>
                            </Box>

                            {jobs.length > 0 && (
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#7A7068",
                                    }}
                                >
                                    Showing the latest results
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* LOADING */}
                    {loading && (
                        <Box
                            sx={{
                                minHeight: 300,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress
                                size={42}
                                thickness={4}
                                sx={{
                                    color: "#E76F51",
                                }}
                            />

                            <Typography
                                sx={{
                                    mt: 2,
                                    color: "#766B62",
                                    fontSize: 14,
                                }}
                            >
                                Loading jobs...
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
                                    backgroundColor: "#FFFDF9",
                                    border: "1px solid #E9DED0",
                                    borderRadius: 3,
                                    px: {
                                        xs: 2.5,
                                        sm: 5,
                                    },
                                    py: {
                                        xs: 5,
                                        sm: 6,
                                    },
                                    textAlign: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: "50%",
                                        backgroundColor: "#FFF1D6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <BusinessCenter
                                        sx={{
                                            fontSize: 34,
                                            color: "#E76F51",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 19,
                                            sm: 22,
                                        },
                                        fontWeight: 900,
                                        color: "#293241",
                                        mb: 1,
                                    }}
                                >
                                    No opportunities found
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#766B62",
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                        lineHeight: 1.7,
                                        maxWidth: 520,
                                        mx: "auto",
                                    }}
                                >
                                    We couldn't find any active jobs
                                    matching your current search or
                                    filters. Try changing your search
                                    criteria.
                                </Typography>

                                <Button
                                    onClick={handleClear}
                                    sx={{
                                        mt: 2.5,
                                        color: "#E76F51",
                                        fontWeight: 800,
                                        textTransform: "none",
                                    }}
                                >
                                    Clear filters
                                </Button>
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

            {/* ==================================================
                BOTTOM SECTION
            ================================================== */}

            <Box
                sx={{
                    backgroundColor: "#293241",
                    py: {
                        xs: 5,
                        md: 6,
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
                                    fontSize: 21,
                                    mb: 0.5,
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
                                Find jobs and internship opportunities.
                            </Typography>
                        </Box>

                        <Button
                            onClick={() => navigate("/")}
                            sx={{
                                color: "#FFFDF9",
                                textTransform: "none",
                                fontWeight: 700,
                                border: "1px solid #756C64",
                                borderRadius: 2,
                                px: 2.5,
                                "&:hover": {
                                    backgroundColor: "#3A4555",
                                    borderColor: "#9B9188",
                                },
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default Jobs;