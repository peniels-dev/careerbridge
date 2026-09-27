import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Avatar,
    Divider,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    ExitToApp,
    ArrowForward,
    TrendingUp,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

function EmployerDashboard() {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [profileAnchor, setProfileAnchor] = useState(null);

    const [company, setCompany] = useState(null);

    const [statistics, setStatistics] = useState({
        totalJobs: 0,
        openJobs: 0,
        totalApplications: 0,
    });

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ==========================================
    // LOAD EMPLOYER DASHBOARD DATA
    // ==========================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosAPI.get(
                    "/jobs/employer"
                );

                const data = response.data.data;

                setCompany(data.company);

                setStatistics(
                    data.statistics || {
                        totalJobs: 0,
                        openJobs: 0,
                        totalApplications: 0,
                    }
                );

                setJobs(data.jobs || []);

            } catch (err) {
                console.error(
                    "Unable to load employer dashboard:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load your employer dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ==========================================
    // PROFILE MENU
    // ==========================================

    const handleProfileMenu = (event) => {
        setProfileAnchor(event.currentTarget);
    };

    const closeProfileMenu = () => {
        setProfileAnchor(null);
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ==========================================
    // COMPANY NAME
    // ==========================================

    const companyName =
        company?.CompanyName ||
        "Your Company";

    // ==========================================
    // USER INITIAL
    // ==========================================

    const userInitial =
        user?.firstName?.charAt(0)?.toUpperCase() ||
        user?.FirstName?.charAt(0)?.toUpperCase() ||
        "E";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f7f9fc",
                display: "flex",
                color: "#172033",
            }}
        >

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <Box
                sx={{
                    width: 260,
                    backgroundColor: "#101828",
                    color: "white",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 10,
                }}
            >

                {/* LOGO */}

                <Box
                    sx={{
                        px: 3,
                        py: 3,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 24,
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Career<span style={{ color: "#4f8cff" }}>
                            Bridge
                        </span>
                    </Typography>

                    <Typography
                        sx={{
                            color: "#98a2b3",
                            fontSize: 12,
                            mt: 0.5,
                        }}
                    >
                        Employer Portal
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        borderColor: "rgba(255,255,255,0.08)",
                    }}
                />

                {/* NAVIGATION */}

                <Box
                    sx={{
                        px: 2,
                        py: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >

                    {/* Dashboard */}

                    <Button
                        startIcon={<Dashboard />}
                        onClick={() =>
                            navigate("/employer-dashboard")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "white",
                            backgroundColor:
                                "rgba(79,140,255,0.16)",
                            borderRadius: 2,
                            px: 2,
                            py: 1.3,
                            fontWeight: 600,
                            "&:hover": {
                                backgroundColor:
                                    "rgba(79,140,255,0.24)",
                            },
                        }}
                    >
                        Dashboard
                    </Button>

                    {/* My Jobs */}

                    <Button
                        startIcon={<Work />}
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "#cbd5e1",
                            borderRadius: 2,
                            px: 2,
                            py: 1.3,
                            "&:hover": {
                                color: "white",
                                backgroundColor:
                                    "rgba(255,255,255,0.06)",
                            },
                        }}
                    >
                        My Job Postings
                    </Button>

                    {/* Post Job */}

                    <Button
                        startIcon={<Add />}
                        onClick={() =>
                            navigate("/employer/post-job")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "#cbd5e1",
                            borderRadius: 2,
                            px: 2,
                            py: 1.3,
                            "&:hover": {
                                color: "white",
                                backgroundColor:
                                    "rgba(255,255,255,0.06)",
                            },
                        }}
                    >
                        Post a Job
                    </Button>

                    {/* Applicants */}

                    <Button
                        startIcon={<People />}
                        onClick={() =>
                            navigate("/employer/applicants")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "#cbd5e1",
                            borderRadius: 2,
                            px: 2,
                            py: 1.3,
                            "&:hover": {
                                color: "white",
                                backgroundColor:
                                    "rgba(255,255,255,0.06)",
                            },
                        }}
                    >
                        Applicants
                    </Button>

                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* BOTTOM NAVIGATION */}

                <Box
                    sx={{
                        px: 2,
                        pb: 3,
                    }}
                >

                    <Button
                        fullWidth
                        startIcon={<Business />}
                        onClick={() =>
                            navigate("/company-profile")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "#cbd5e1",
                            borderRadius: 2,
                            px: 2,
                            py: 1.3,
                            mb: 1,
                            "&:hover": {
                                color: "white",
                                backgroundColor:
                                    "rgba(255,255,255,0.06)",
                            },
                        }}
                    >
                        Company Profile
                    </Button>

                    <Button
                        fullWidth
                        startIcon={<ExitToApp />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "#fca5a5",
                            borderRadius: 2,
                            px: 2,
                            py: 1.3,
                            "&:hover": {
                                backgroundColor:
                                    "rgba(239,68,68,0.10)",
                            },
                        }}
                    >
                        Logout
                    </Button>

                </Box>
            </Box>

            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <Box
                sx={{
                    flex: 1,
                    ml: {
                        xs: 0,
                        md: "260px",
                    },
                    minWidth: 0,
                }}
            >

                {/* ==========================================
                    TOP BAR
                ========================================== */}

                <Box
                    sx={{
                        height: 72,
                        backgroundColor: "white",
                        borderBottom:
                            "1px solid #eaecf0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        px: {
                            xs: 2,
                            md: 4,
                        },
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        <Tooltip title="Profile">

                            <IconButton
                                onClick={handleProfileMenu}
                            >
                                <Avatar
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        backgroundColor:
                                            "#4f8cff",
                                        fontWeight: 700,
                                    }}
                                >
                                    {userInitial}
                                </Avatar>
                            </IconButton>

                        </Tooltip>

                        <Menu
                            anchorEl={profileAnchor}
                            open={Boolean(profileAnchor)}
                            onClose={closeProfileMenu}
                        >

                            <MenuItem
                                onClick={() => {
                                    closeProfileMenu();
                                    navigate(
                                        "/company-profile"
                                    );
                                }}
                            >
                                <Business
                                    sx={{
                                        mr: 1,
                                        fontSize: 20,
                                    }}
                                />
                                Company Profile
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    closeProfileMenu();
                                    handleLogout();
                                }}
                            >
                                <ExitToApp
                                    sx={{
                                        mr: 1,
                                        fontSize: 20,
                                    }}
                                />
                                Logout
                            </MenuItem>

                        </Menu>

                    </Box>
                </Box>

                {/* ==========================================
                    PAGE CONTENT
                ========================================== */}

                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        maxWidth: 1500,
                        mx: "auto",
                    }}
                >

                    {/* PAGE HEADER */}

                    <Box
                        sx={{
                            mb: 3,
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 25,
                                    md: 32,
                                },
                                fontWeight: 800,
                                letterSpacing: "-0.8px",
                            }}
                        >
                            Good to see you,
                            {" "}
                            {user?.firstName ||
                                user?.FirstName ||
                                "Employer"} 👋
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                mt: 0.5,
                                fontSize: 15,
                            }}
                        >
                            Here's what's happening with
                            your recruitment activity.
                        </Typography>

                    </Box>

                    {/* ERROR */}

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

                    {/* ==========================================
                        HERO
                    ========================================== */}

                    <Card
                        sx={{
                            borderRadius: 4,
                            border: "1px solid #eaecf0",
                            boxShadow:
                                "0 8px 30px rgba(16,24,40,0.06)",
                            mb: 3,
                            overflow: "hidden",
                            background:
                                "linear-gradient(135deg, #101828 0%, #1d2939 100%)",
                            color: "white",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    md: 4,
                                },
                                "&:last-child": {
                                    pb: {
                                        xs: 3,
                                        md: 4,
                                    },
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
                                    alignItems: {
                                        xs: "flex-start",
                                        md: "center",
                                    },
                                    justifyContent:
                                        "space-between",
                                    gap: 3,
                                }}
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            color: "#98a2b3",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            textTransform:
                                                "uppercase",
                                            letterSpacing: 1,
                                            mb: 1,
                                        }}
                                    >
                                        Employer Dashboard
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 25,
                                                md: 31,
                                            },
                                            fontWeight: 800,
                                            maxWidth: 600,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Build your team with
                                        better opportunities.
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#cbd5e1",
                                            mt: 1.5,
                                            maxWidth: 560,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Manage your job
                                        postings, discover
                                        applicants and grow
                                        your team from one
                                        place.
                                    </Typography>

                                </Box>

                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() =>
                                        navigate(
                                            "/employer/post-job"
                                        )
                                    }
                                    sx={{
                                        backgroundColor:
                                            "#4f8cff",
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 2.5,
                                        py: 1.3,
                                        whiteSpace:
                                            "nowrap",
                                        "&:hover": {
                                            backgroundColor:
                                                "#3978ed",
                                        },
                                    }}
                                >
                                    Post a Job
                                </Button>

                            </Box>

                        </CardContent>
                    </Card>

                    {/* ==========================================
                        COMPANY CARD
                    ========================================== */}

                    <Card
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #eaecf0",
                            boxShadow:
                                "0 3px 12px rgba(16,24,40,0.04)",
                            mb: 3,
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 2.5,
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    gap: 2,
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 2,
                                    }}
                                >

                                    <Avatar
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            backgroundColor:
                                                "#eef4ff",
                                            color:
                                                "#4f8cff",
                                        }}
                                    >
                                        <Business />
                                    </Avatar>

                                    <Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 18,
                                            }}
                                        >
                                            {loading
                                                ? "Loading..."
                                                : companyName}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color:
                                                    "#667085",
                                                fontSize: 13,
                                                mt: 0.3,
                                            }}
                                        >
                                            Employer company
                                            profile
                                        </Typography>

                                    </Box>

                                </Box>

                                <Button
                                    endIcon={
                                        <ArrowForward />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/company-profile"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    View Profile
                                </Button>

                            </Box>

                        </CardContent>
                    </Card>

                    {/* ==========================================
                        STATISTICS
                    ========================================== */}

                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "center",
                                py: 6,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)",
                                },
                                gap: 2,
                                mb: 3,
                            }}
                        >

                            {/* TOTAL JOBS */}

                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border:
                                        "1px solid #eaecf0",
                                    boxShadow:
                                        "0 3px 12px rgba(16,24,40,0.04)",
                                }}
                            >
                                <CardContent sx={{ p: 2.5 }}>

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-start",
                                        }}
                                    >

                                        <Box>

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#667085",
                                                    fontSize:
                                                        13,
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                Total Jobs
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        30,
                                                    fontWeight:
                                                        800,
                                                    mt: 0.5,
                                                }}
                                            >
                                                {
                                                    statistics.totalJobs
                                                }
                                            </Typography>

                                        </Box>

                                        <Avatar
                                            sx={{
                                                backgroundColor:
                                                    "#eef4ff",
                                                color:
                                                    "#4f8cff",
                                            }}
                                        >
                                            <Work />
                                        </Avatar>

                                    </Box>

                                    <Typography
                                        sx={{
                                            color:
                                                "#667085",
                                            fontSize: 12,
                                            mt: 2,
                                        }}
                                    >
                                        All jobs posted by
                                        your company
                                    </Typography>

                                </CardContent>
                            </Card>

                            {/* OPEN JOBS */}

                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border:
                                        "1px solid #eaecf0",
                                    boxShadow:
                                        "0 3px 12px rgba(16,24,40,0.04)",
                                }}
                            >
                                <CardContent sx={{ p: 2.5 }}>

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-start",
                                        }}
                                    >

                                        <Box>

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#667085",
                                                    fontSize:
                                                        13,
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                Open Jobs
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        30,
                                                    fontWeight:
                                                        800,
                                                    mt: 0.5,
                                                }}
                                            >
                                                {
                                                    statistics.openJobs
                                                }
                                            </Typography>

                                        </Box>

                                        <Avatar
                                            sx={{
                                                backgroundColor:
                                                    "#ecfdf3",
                                                color:
                                                    "#12b76a",
                                            }}
                                        >
                                            <TrendingUp />
                                        </Avatar>

                                    </Box>

                                    <Typography
                                        sx={{
                                            color:
                                                "#667085",
                                            fontSize: 12,
                                            mt: 2,
                                        }}
                                    >
                                        Currently accepting
                                        applications
                                    </Typography>

                                </CardContent>
                            </Card>

                            {/* APPLICATIONS */}

                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border:
                                        "1px solid #eaecf0",
                                    boxShadow:
                                        "0 3px 12px rgba(16,24,40,0.04)",
                                }}
                            >
                                <CardContent sx={{ p: 2.5 }}>

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-start",
                                        }}
                                    >

                                        <Box>

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#667085",
                                                    fontSize:
                                                        13,
                                                    fontWeight:
                                                        600,
                                                }}
                                            >
                                                Applications
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        30,
                                                    fontWeight:
                                                        800,
                                                    mt: 0.5,
                                                }}
                                            >
                                                {
                                                    statistics.totalApplications
                                                }
                                            </Typography>

                                        </Box>

                                        <Avatar
                                            sx={{
                                                backgroundColor:
                                                    "#f4f3ff",
                                                color:
                                                    "#7f56d9",
                                            }}
                                        >
                                            <People />
                                        </Avatar>

                                    </Box>

                                    <Typography
                                        sx={{
                                            color:
                                                "#667085",
                                            fontSize: 12,
                                            mt: 2,
                                        }}
                                    >
                                        Applications received
                                        across your jobs
                                    </Typography>

                                </CardContent>
                            </Card>

                        </Box>
                    )}

                    {/* ==========================================
                        RECENT JOBS
                    ========================================== */}

                    <Card
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #eaecf0",
                            boxShadow:
                                "0 3px 12px rgba(16,24,40,0.04)",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 0,
                            }}
                        >

                            <Box
                                sx={{
                                    p: 2.5,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    gap: 2,
                                }}
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 800,
                                        }}
                                    >
                                        Recent Job Postings
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "#667085",
                                            fontSize: 13,
                                            mt: 0.5,
                                        }}
                                    >
                                        Your latest
                                        recruitment activity
                                    </Typography>

                                </Box>

                                <Button
                                    endIcon={
                                        <ArrowForward />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/employer/jobs"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    View All
                                </Button>

                            </Box>

                            <Divider />

                            {jobs.length === 0 ? (

                                <Box
                                    sx={{
                                        textAlign:
                                            "center",
                                        py: 7,
                                        px: 3,
                                    }}
                                >

                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            mx: "auto",
                                            mb: 2,
                                            backgroundColor:
                                                "#eef4ff",
                                            color:
                                                "#4f8cff",
                                        }}
                                    >
                                        <Work />
                                    </Avatar>

                                    <Typography
                                        sx={{
                                            fontWeight:
                                                800,
                                            fontSize: 17,
                                        }}
                                    >
                                        No job postings yet
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "#667085",
                                            fontSize: 14,
                                            mt: 0.7,
                                            mb: 2.5,
                                        }}
                                    >
                                        Create your first
                                        job posting and start
                                        finding candidates.
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={
                                            <Add />
                                        }
                                        onClick={() =>
                                            navigate(
                                                "/employer/post-job"
                                            )
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                            fontWeight:
                                                700,
                                            borderRadius:
                                                2,
                                        }}
                                    >
                                        Post Your First Job
                                    </Button>

                                </Box>

                            ) : (

                                <Box>

                                    {jobs
                                        .slice(0, 5)
                                        .map((job) => (

                                            <Box
                                                key={
                                                    job.JobID
                                                }
                                                sx={{
                                                    px: 2.5,
                                                    py: 2,
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                    borderBottom:
                                                        "1px solid #f2f4f7",
                                                    transition:
                                                        "background-color 0.2s",
                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "#f9fafb",
                                                        },
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        minWidth: 0,
                                                        flex: 1,
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontWeight:
                                                                700,
                                                            fontSize:
                                                                15,
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            job.JobTitle
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                "#667085",
                                                            fontSize:
                                                                12,
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {
                                                            job.Location
                                                        }
                                                        {" • "}
                                                        {
                                                            job.JobType
                                                        }
                                                    </Typography>

                                                </Box>

                                                <Box
                                                    sx={{
                                                        display:
                                                            {
                                                                xs: "none",
                                                                sm: "block",
                                                            },
                                                        textAlign:
                                                            "right",
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                12,
                                                            color:
                                                                "#667085",
                                                        }}
                                                    >
                                                        Posted
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                13,
                                                            fontWeight:
                                                                600,
                                                        }}
                                                    >
                                                        {formatDate(
                                                            job.PostedDate
                                                        )}
                                                    </Typography>

                                                </Box>

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            {
                                                                xs: "column",
                                                                sm: "row",
                                                            },
                                                        alignItems:
                                                            "center",
                                                        gap: 1.5,
                                                    }}
                                                >

                                                    <Chip
                                                        label={
                                                            job.Status ===
                                                                true ||
                                                            job.Status ===
                                                                1
                                                                ? "Open"
                                                                : "Closed"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight:
                                                                700,
                                                            backgroundColor:
                                                                job.Status ===
                                                                    true ||
                                                                job.Status ===
                                                                    1
                                                                    ? "#ecfdf3"
                                                                    : "#f2f4f7",
                                                            color:
                                                                job.Status ===
                                                                    true ||
                                                                job.Status ===
                                                                    1
                                                                    ? "#027a48"
                                                                    : "#667085",
                                                        }}
                                                    />

                                                    <Box
                                                        sx={{
                                                            textAlign:
                                                                "center",
                                                        }}
                                                    >

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    16,
                                                                fontWeight:
                                                                    800,
                                                            }}
                                                        >
                                                            {
                                                                job.applicationCount
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    10,
                                                                color:
                                                                    "#667085",
                                                            }}
                                                        >
                                                            Applicants
                                                        </Typography>

                                                    </Box>

                                                </Box>

                                            </Box>

                                        ))}

                                </Box>

                            )}

                        </CardContent>
                    </Card>

                </Box>
            </Box>
        </Box>
    );
}

export default EmployerDashboard;

