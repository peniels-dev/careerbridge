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
import { useAuth } from "../context/AuthContext";

function PublicDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userRole = user?.Role || user?.role;

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/jobs/active", {
                params: {
                    search: search.trim(),
                    location: location.trim(),
                },
            });

            setJobs(response.data.data || []);
        } catch (err) {
            console.error("Error loading jobs:", err);
            setError("Unable to load jobs right now.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = () => {
        fetchJobs();
    };

    const handleDashboard = () => {
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

        navigate("/login");
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
                backgroundColor: "#FFF8EF",
                color: "#293241",
            }}
        >
            {/* NAVBAR */}
            <Box
                sx={{
                    backgroundColor: "#FFFDF9",
                    borderBottom: "1px solid #E9DED0",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            minHeight: 72,
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
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2,
                                    backgroundColor: "#E76F51",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 900,
                                    fontSize: 20,
                                }}
                            >
                                C
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: 22,
                                    color: "#293241",
                                }}
                            >
                                CareerBridge
                            </Typography>
                        </Box>

                        {/* NAVIGATION */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 1, sm: 2 },
                            }}
                        >
                            <Button
                                onClick={handleViewAllJobs}
                                sx={{
                                    color: "#5F554D",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    "&:hover": {
                                        backgroundColor: "#FFF1D6",
                                    },
                                }}
                            >
                                Find Jobs
                            </Button>

                            {user ? (
                                <Button
                                    variant="contained"
                                    onClick={handleDashboard}
                                    sx={{
                                        backgroundColor: "#E76F51",
                                        color: "#fff",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 2.5,
                                        "&:hover": {
                                            backgroundColor: "#D85F43",
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/login")}
                                    sx={{
                                        backgroundColor: "#E76F51",
                                        color: "#fff",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 2.5,
                                        "&:hover": {
                                            backgroundColor: "#D85F43",
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* HERO */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    py: { xs: 8, md: 11 },
                    backgroundColor: "#FFF8EF",
                }}
            >
                {/* DECORATIVE SHAPES */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        backgroundColor: "#FFE2C4",
                        top: -90,
                        right: -70,
                        opacity: 0.8,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        backgroundColor: "#DCECCF",
                        bottom: -60,
                        left: -40,
                        opacity: 0.8,
                    }}
                />

                <Container maxWidth="lg">
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            maxWidth: 850,
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#E76F51",
                                fontWeight: 900,
                                fontSize: { xs: 18, md: 22 },
                                letterSpacing: 1.5,
                                mb: 2,
                            }}
                        >
                            JOBS & INTERNSHIPS
                        </Typography>

                        <Typography
    component="h1"
    sx={{
        fontSize: {
            xs: 38,
            sm: 52,
            md: 68,
        },
        lineHeight: 1.1,
        fontWeight: 900,
        letterSpacing: "-2px",
        color: "#293241",
        mb: 2.5,
        whiteSpace: {
            xs: "normal",
            md: "nowrap",
        },
    }}
>
    Find a job that{" "}
    <Box
        component="span"
        sx={{
            color: "#E76F51",
        }}
    >
        fits you.
    </Box>
</Typography>

                        <Typography
                            sx={{
                                color: "#6F6258",
                                fontSize: { xs: 16, md: 18 },
                                lineHeight: 1.7,
                                maxWidth: 650,
                                mb: 4,
                            }}
                        >
                            Search for jobs and internship opportunities,
                            check the details, and apply for the ones that
                            interest you.
                        </Typography>

                        {/* SEARCH */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1,
                                maxWidth: 850,
                                borderRadius: 3,
                                border: "1px solid #E9DED0",
                                backgroundColor: "#FFFDF9",
                                boxShadow:
                                    "0 10px 30px rgba(94, 69, 50, 0.08)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexDirection: {
                                        xs: "column",
                                        md: "row",
                                    },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Job title or keyword"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search
                                                    sx={{
                                                        color: "#E76F51",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            backgroundColor: "#FFFDF9",
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn
                                                    sx={{
                                                        color: "#6A994E",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            backgroundColor: "#FFFDF9",
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    sx={{
                                        minWidth: {
                                            xs: "100%",
                                            md: 130,
                                        },
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 800,
                                        backgroundColor: "#E76F51",
                                        "&:hover": {
                                            backgroundColor: "#D85F43",
                                        },
                                    }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* QUICK INFO */}
            <Box
                sx={{
                    backgroundColor: "#FFFDF9",
                    borderTop: "1px solid #E9DED0",
                    borderBottom: "1px solid #E9DED0",
                    py: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                borderLeft: "4px solid #E76F51",
                                backgroundColor: "#FFF8EF",
                            }}
                        >
                            <BusinessCenter
                                sx={{
                                    color: "#E76F51",
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: 17,
                                    mb: 0.5,
                                }}
                            >
                                Find opportunities
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#766B62",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                }}
                            >
                                Browse available jobs and internships in
                                different fields.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                p: 2.5,
                                borderLeft: "4px solid #6A994E",
                                backgroundColor: "#F7FAF3",
                            }}
                        >
                            <Search
                                sx={{
                                    color: "#6A994E",
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: 17,
                                    mb: 0.5,
                                }}
                            >
                                Search easily
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#766B62",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                }}
                            >
                                Use the search bar to find opportunities by
                                title or location.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                p: 2.5,
                                borderLeft: "4px solid #F4A261",
                                backgroundColor: "#FFF8EF",
                            }}
                        >
                            <LocationOn
                                sx={{
                                    color: "#F4A261",
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: 17,
                                    mb: 0.5,
                                }}
                            >
                                Explore jobs
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#766B62",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                }}
                            >
                                Check job details and see where each
                                opportunity is located.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* LATEST JOBS */}
            <Box
                sx={{
                    py: { xs: 7, md: 9 },
                    backgroundColor: "#FFF8EF",
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
                            gap: 2,
                            mb: 4,
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
                                    fontWeight: 800,
                                    fontSize: 14,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    mb: 1,
                                }}
                            >
                                Latest opportunities
                            </Typography>

                            <Typography
                                component="h2"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: {
                                        xs: 30,
                                        md: 40,
                                    },
                                    color: "#293241",
                                }}
                            >
                                Recent job openings
                            </Typography>
                        </Box>

                        <Button
                            onClick={handleViewAllJobs}
                            endIcon={<ArrowForward />}
                            sx={{
                                color: "#E76F51",
                                fontWeight: 800,
                                textTransform: "none",
                            }}
                        >
                            View all jobs
                        </Button>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                minHeight: 250,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress
                                sx={{
                                    color: "#E76F51",
                                }}
                            />
                        </Box>
                    ) : error ? (
                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 2,
                                backgroundColor: "#FFF1F0",
                            }}
                        >
                            {error}
                        </Alert>
                    ) : jobs.length === 0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 5,
                                textAlign: "center",
                                backgroundColor: "#FFFDF9",
                                border: "1px solid #E9DED0",
                                borderRadius: 3,
                            }}
                        >
                            <BusinessCenter
                                sx={{
                                    fontSize: 48,
                                    color: "#E76F51",
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: 20,
                                    mb: 1,
                                }}
                            >
                                No jobs found
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#766B62",
                                }}
                            >
                                Try another search or check back later.
                            </Typography>
                        </Paper>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            {jobs.slice(0, 6).map((job) => (
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

            {/* CTA */}
            <Box
                sx={{
                    py: { xs: 7, md: 9 },
                    backgroundColor: "#293241",
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            component="h2"
                            sx={{
                                color: "#FFFDF9",
                                fontWeight: 900,
                                fontSize: {
                                    xs: 30,
                                    md: 42,
                                },
                                mb: 2,
                            }}
                        >
                            Looking for your next opportunity?
                        </Typography>

                        <Typography
                            sx={{
                                color: "#E8DED5",
                                fontSize: 16,
                                lineHeight: 1.7,
                                maxWidth: 620,
                                mx: "auto",
                                mb: 3.5,
                            }}
                        >
                            Create an account and start exploring the jobs
                            available on CareerBridge.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    user
                                        ? "/jobs"
                                        : "/register"
                                )
                            }
                            endIcon={<ArrowForward />}
                            sx={{
                                backgroundColor: "#E76F51",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 800,
                                borderRadius: 2,
                                px: 3.5,
                                py: 1.4,
                                "&:hover": {
                                    backgroundColor: "#D85F43",
                                },
                            }}
                        >
                            {user ? "Browse Jobs" : "Create Account"}
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box
                sx={{
                    backgroundColor: "#FFFDF9",
                    borderTop: "1px solid #E9DED0",
                    py: 3,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                color: "#82776E",
                                fontSize: 13,
                            }}
                        >
                            Find jobs. Explore opportunities.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default PublicDashboard;