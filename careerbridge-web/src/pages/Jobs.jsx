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
    // Stores the jobs returned by the backend
    const [jobs, setJobs] = useState([]);

    // Stores the categories found inside the jobs returned by the backend
    const [categories, setCategories] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Filter values
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sort, setSort] = useState("newest");

    // Used to move from Jobs page to Job Details page
    const navigate = useNavigate();

    // Get jobs from the backend
    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            // Axios will convert these into query parameters
            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (location.trim()) {
                params.location = location.trim();
            }

            if (jobType) {
                params.jobType = jobType;
            }

            if (categoryId) {
                params.categoryId = categoryId;
            }

            if (sort) {
                params.sort = sort;
            }

            const response = await axiosAPI.get("/jobs", {
                params: params,
            });

            // Store the jobs returned by the API
            const returnedJobs =
                response.data.jobs ||
                response.data.data ||
                [];

            setJobs(returnedJobs);

            // Create the category list from the jobs returned
            // by the backend. This means we do not need
            // a separate /categories endpoint.
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
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // Run when the Jobs page first opens
    useEffect(() => {
        fetchJobs();
    }, []);

    // Search button
    const handleSearch = () => {
        fetchJobs();
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearch("");
        setLocation("");
        setJobType("");
        setCategoryId("");
        setSort("newest");

        // Reload all available jobs
        setTimeout(() => {
            fetchJobs();
        }, 0);
    };

    // Open the selected job's details page
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

                {/* Page heading */}
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

                {/* Search and filters */}
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
                    onSortChange={setSort}
                    onSearch={handleSearch}
                    onClear={handleClearFilters}
                />

                {/* Number of jobs */}
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

                {/* Loading */}
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

                {/* API error */}
                {error && !loading && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* No jobs found */}
                {!loading &&
                    !error &&
                    jobs.length === 0 && (
                        <Alert severity="info">
                            No matching job opportunities were found.
                            Try changing your search or filters.
                        </Alert>
                    )}

                {/* Job cards */}
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

