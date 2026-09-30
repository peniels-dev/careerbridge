import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowForward,
    BusinessCenter,
    LocationOn,
    Search,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import JobCard from "../components/JobCard";

function PublicDashboard() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    const fetchJobs = async (searchValue = "", locationValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/jobs/active", {
                params: {
                    search: searchValue.trim() || undefined,
                    location: locationValue.trim() || undefined,
                },
            });

            const returnedJobs =
                response.data?.data ||
                response.data?.jobs ||
                [];

            setJobs(returnedJobs);
        } catch (err) {
            console.error("Error loading public jobs:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load available jobs."
            );

            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = () => {
        fetchJobs(search, location);
    };

    const handleViewDetails = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    const handleViewAllJobs = () => {
    navigate("/jobs");
};

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                overflowX: "hidden",
            }}
        >
            {/* =========================
                NAVBAR
            ========================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #eaecf0",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
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
                    <Box
                        sx={{
                            minHeight: {
                                xs: 68,
                                sm: 74,
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
                                gap: 1.25,
                                minWidth: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2,
                                    backgroundColor: "#1d4ed8",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 900,
                                    fontSize: 20,
                                    flexShrink: 0,
                                }}
                            >
                                C
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 19,
                                        sm: 21,
                                    },
                                    fontWeight: 800,
                                    color: "#101828",
                                    letterSpacing: "-0.4px",
                                }}
                            >
                                CareerBridge
                            </Typography>
                        </Box>

                        {/* NAV BUTTONS */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: {
                                    xs: 0.75,
                                    sm: 1,
                                },
                            }}
                        >
                            <Button
                                onClick={() => navigate("/login")}
                                sx={{
                                    minHeight: 40,
                                    px: {
                                        xs: 1.25,
                                        sm: 2,
                                    },
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    color: "#344054",
                                }}
                            >
                                Login
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => navigate("/register")}
                                sx={{
                                    minHeight: 40,
                                    px: {
                                        xs: 1.5,
                                        sm: 2.25,
                                    },
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 700,
                                }}
                            >
                                Register
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* =========================
                HERO
            ========================= */}

            <Box
                sx={{
                    background:
                        "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #f8fafc 100%)",
                    borderBottom: "1px solid #e5e7eb",
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
                    <Box
                        sx={{
                            py: {
                                xs: 7,
                                sm: 9,
                                md: 11,
                            },
                            textAlign: "center",
                            maxWidth: 850,
                            mx: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                width: 58,
                                height: 58,
                                borderRadius: 3,
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 3,
                            }}
                        >
                            <BusinessCenter sx={{ fontSize: 30 }} />
                        </Box>

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: 34,
                                    sm: 46,
                                    md: 58,
                                },
                                lineHeight: 1.08,
                                fontWeight: 900,
                                color: "#101828",
                                letterSpacing: {
                                    xs: "-1px",
                                    sm: "-1.8px",
                                },
                                mb: 2,
                            }}
                        >
                            Find your next{" "}
                            <Box
                                component="span"
                                sx={{
                                    color: "#1d4ed8",
                                    display: {
                                        xs: "block",
                                        sm: "inline",
                                    },
                                }}
                            >
                                opportunity
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                fontSize: {
                                    xs: 15,
                                    sm: 17,
                                },
                                lineHeight: 1.7,
                                maxWidth: 650,
                                mx: "auto",
                            }}
                        >
                            Discover jobs and internship
                            opportunities from companies
                            looking for talented people like
                            you.
                        </Typography>

                        {/* SEARCH */}

                        <Paper
                            elevation={0}
                            sx={{
                                mt: {
                                    xs: 4,
                                    sm: 5,
                                },
                                p: {
                                    xs: 1.25,
                                    sm: 1.5,
                                },
                                borderRadius: 3,
                                border: "1px solid #d0d5dd",
                                backgroundColor: "#ffffff",
                                boxShadow:
                                    "0 8px 30px rgba(16, 24, 40, 0.08)",
                                display: "flex",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                                gap: 1.25,
                                textAlign: "left",
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Job title or keyword"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search
                                                sx={{
                                                    color: "#98a2b3",
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Location"
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn
                                                sx={{
                                                    color: "#98a2b3",
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                endIcon={<ArrowForward />}
                                sx={{
                                    minHeight: 56,
                                    px: 3,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Search Jobs
                            </Button>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* =========================
                JOBS SECTION
            ========================= */}

            <Container
                maxWidth="lg"
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                    py: {
                        xs: 5,
                        sm: 6,
                        md: 7,
                    },
                }}
            >
                {/* SECTION HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 24,
                                    sm: 30,
                                },
                                fontWeight: 800,
                                color: "#101828",
                                letterSpacing: "-0.5px",
                                mb: 0.75,
                            }}
                        >
                            Latest Opportunities
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                fontSize: 14,
                                lineHeight: 1.6,
                            }}
                        >
                            Explore some of the latest active
                            opportunities on CareerBridge.
                        </Typography>
                    </Box>

                    {!loading &&
                        !error &&
                        jobs.length > 0 && (
                            <Button
                                endIcon={<ArrowForward />}
                                onClick={handleViewAllJobs}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    color: "#1d4ed8",
                                }}
                            >
                                View All Jobs
                            </Button>
                        )}
                </Box>

                {/* LOADING */}

                {loading && (
                    <Box
                        sx={{
                            py: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <CircularProgress size={40} />

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
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    jobs.length === 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: {
                                    xs: 4,
                                    sm: 6,
                                },
                                textAlign: "center",
                                borderRadius: 3,
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <BusinessCenter
                                sx={{
                                    fontSize: 42,
                                    color: "#98a2b3",
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 19,
                                    fontWeight: 800,
                                    color: "#172033",
                                    mb: 1,
                                }}
                            >
                                No active jobs yet
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#667085",
                                    fontSize: 14,
                                }}
                            >
                                Check back soon for new
                                opportunities.
                            </Typography>
                        </Paper>
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
                            {jobs.slice(0, 6).map((job) => (
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

            {/* =========================
                CALL TO ACTION
            ========================= */}

            <Box
                sx={{
                    backgroundColor: "#101828",
                    mt: 2,
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
                    <Box
                        sx={{
                            py: {
                                xs: 6,
                                sm: 8,
                            },
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#ffffff",
                                fontSize: {
                                    xs: 25,
                                    sm: 32,
                                },
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                                mb: 1.5,
                            }}
                        >
                            Ready to take the next step?
                        </Typography>

                        <Typography
                            sx={{
                                color: "#98a2b3",
                                fontSize: 14,
                                lineHeight: 1.7,
                                maxWidth: 550,
                                mx: "auto",
                                mb: 3,
                            }}
                        >
                            Create your CareerBridge
                            account and start exploring
                            opportunities that match your
                            goals.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/register")}
                            endIcon={<ArrowForward />}
                            sx={{
                                minHeight: 46,
                                px: 3,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* =========================
                FOOTER
            ========================= */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    borderTop: "1px solid #eaecf0",
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
                    <Box
                        sx={{
                            minHeight: 70,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            gap: 1,
                            py: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#667085",
                            }}
                        >
                            © {new Date().getFullYear()} CareerBridge.
                            All rights reserved.
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#98a2b3",
                            }}
                        >
                            Connecting talent with opportunity.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default PublicDashboard;