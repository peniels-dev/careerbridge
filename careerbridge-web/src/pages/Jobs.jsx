import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";

import axiosAPI from "../api/axiosAPI";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sort, setSort] = useState("newest");

    const navigate = useNavigate();

    // ==========================================
    // GET JOBS
    // ==========================================

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

            const response = await axiosAPI.get("/jobs", {
                params,
            });

            const returnedJobs =
                response.data.data ||
                response.data.jobs ||
                [];

            setJobs(returnedJobs);

            // Create unique category list
            const uniqueCategories = [];

            returnedJobs.forEach((job) => {
                if (
                    job.CategoryID &&
                    job.CategoryName &&
                    !uniqueCategories.some(
                        (category) =>
                            category.CategoryID === job.CategoryID
                    )
                ) {
                    uniqueCategories.push({
                        CategoryID: job.CategoryID,
                        CategoryName: job.CategoryName,
                    });
                }
            });

            setCategories(uniqueCategories);
        } catch (err) {
            console.error("Error loading jobs:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load jobs. Please try again."
            );

            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD JOBS WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {
        fetchJobs({
            sort: "newest",
        });
    }, []);

    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = () => {
        fetchJobs({
            search,
            location,
            jobType,
            categoryId,
            sort,
        });
    };

    // ==========================================
    // APPLY FILTERS
    // ==========================================

    const handleFilterChange = () => {
        fetchJobs({
            search,
            location,
            jobType,
            categoryId,
            sort,
        });
    };

    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const handleClear = () => {
        setSearch("");
        setLocation("");
        setJobType("");
        setCategoryId("");
        setSort("newest");

        // Directly request all jobs.
        // This avoids React state update timing issues.
        fetchJobs({
            sort: "newest",
        });
    };

    // ==========================================
    // VIEW JOB DETAILS
    // ==========================================

    const handleViewDetails = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                py: 5,
            }}
        >
            <Container maxWidth="lg">

                {/* PAGE HEADER */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Find Jobs
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Browse, search and filter available job and
                        internship opportunities on CareerBridge.
                    </Typography>
                </Box>

                {/* FILTERS */}
              <JobFilters
    search={search}
    location={location}
    jobType={jobType}
    categoryId={categoryId}
    sort={sort}
    categories={categories}
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

                {/* NUMBER OF JOBS */}
                {!loading && !error && (
                    <Typography
                        variant="h6"
                        sx={{ mb: 3 }}
                    >
                        {jobs.length}{" "}
                        {jobs.length === 1
                            ? "opportunity"
                            : "opportunities"}{" "}
                        found
                    </Typography>
                )}

                {/* LOADING */}
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 6,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {/* ERROR */}
                {error && !loading && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* NO JOBS */}
                {!loading &&
                    !error &&
                    jobs.length === 0 && (
                        <Alert severity="info">
                            No matching job opportunities were found.
                            Try changing your search or filters.
                        </Alert>
                    )}

                {/* JOB CARDS */}
                {!loading &&
                    !error &&
                    jobs.length > 0 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.JobID}
                                    job={job}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </Box>
                    )}
            </Container>
        </Box>
    );
}

export default Jobs;