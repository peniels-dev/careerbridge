import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

import {
    Add,
    ArrowForward,
    Business,
    Dashboard as DashboardIcon,
    ExitToApp,
    Menu,
    People,
    TrendingUp,
    Work,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [company, setCompany] = useState(null);

    const [statistics, setStatistics] = useState({
        totalJobs: 0,
        openJobs: 0,
        totalApplications: 0,
    });

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadDashboardData = async () => {
            try {
                const response =
                    await axiosAPI.get("/jobs/employer");

                if (!isMounted) return;

                const data = response.data?.data;

                if (!data) {
                    throw new Error(
                        "Invalid dashboard response."
                    );
                }

                setCompany(data.company || null);

                setStatistics({
                    totalJobs: Number(
                        data.statistics?.totalJobs || 0
                    ),
                    openJobs: Number(
                        data.statistics?.openJobs || 0
                    ),
                    totalApplications: Number(
                        data.statistics
                            ?.totalApplications || 0
                    ),
                });

                setJobs(
                    Array.isArray(data.jobs)
                        ? data.jobs
                        : []
                );
            } catch (err) {
                if (!isMounted) return;

                console.error(
                    "Employer dashboard error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Unable to load dashboard data."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const formatDate = (date) => {
        if (!date) return "No deadline";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "No deadline";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const sidebarItems = [
        {
            label: "Dashboard",
            icon: <DashboardIcon />,
            path: "/employer-dashboard",
        },
        {
            label: "My Job Postings",
            icon: <Work />,
            path: "/employer/jobs",
        },
        {
            label: "Post a Job",
            icon: <Add />,
            path: "/employer/post-job",
        },
        {
            label: "Applicants",
            icon: <People />,
            path: "/employer/jobs",
        },
    ];

    const SidebarContent = () => (
        <Box
            sx={{
                width: 250,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#172033",
                color: "#fff",
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    px: 2.5,
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Avatar
                    sx={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#4f46e5",
                        fontWeight: 800,
                    }}
                >
                    C
                </Avatar>

                <Box>
                    <Typography
                        sx={{
                            fontSize: 20,
                            fontWeight: 800,
                            lineHeight: 1,
                        }}
                    >
                        CareerBridge
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "#98a2b3",
                            mt: 0.5,
                        }}
                    >
                        Employer Portal
                    </Typography>
                </Box>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 1.5, flex: 1 }}>
                {sidebarItems.map((item) => (
                    <ListItemButton
                        key={item.label}
                        onClick={() =>
                            handleNavigation(item.path)
                        }
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            py: 1.2,
                            color: "#d0d5dd",
                            "&:hover": {
                                backgroundColor:
                                    "rgba(255,255,255,0.08)",
                                color: "#fff",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 42,
                                color: "inherit",
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.label}
                            slotProps={{
                                primary: {
                                    style: {
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    },
                                },
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>

            {/* Logout */}
            <Box sx={{ p: 1.5 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        color: "#d0d5dd",
                        "&:hover": {
                            backgroundColor:
                                "rgba(255,255,255,0.08)",
                            color: "#fff",
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 42,
                            color: "inherit",
                        }}
                    >
                        <ExitToApp />
                    </ListItemIcon>

                    <ListItemText
                        primary="Logout"
                        slotProps={{
                            primary: {
                                style: {
                                    fontSize: "14px",
                                    fontWeight: 600,
                                },
                            },
                        }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#f8fafc",
                display: "flex",
                overflowX: "hidden",
            }}
        >
            {/* DESKTOP SIDEBAR */}
            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },
                    width: 250,
                    minWidth: 250,
                }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: 250,
                    }}
                >
                    <SidebarContent />
                </Box>
            </Box>

            {/* MOBILE SIDEBAR */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() =>
                    setMobileMenuOpen(false)
                }
                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },
                    "& .MuiDrawer-paper": {
                        width: 250,
                        border: "none",
                    },
                }}
            >
                <SidebarContent />
            </Drawer>

            {/* MAIN AREA */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    width: "100%",
                }}
            >
                {/* HEADER */}
                <Box
                    sx={{
                        minHeight: 76,
                        px: {
                            xs: 2,
                            sm: 3,
                            lg: 4,
                        },
                        py: 1.5,
                        backgroundColor: "#ffffff",
                        borderBottom:
                            "1px solid #eaecf0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <IconButton
                            onClick={() =>
                                setMobileMenuOpen(true)
                            }
                            sx={{
                                display: {
                                    xs: "inline-flex",
                                    md: "none",
                                },
                            }}
                        >
                            <Menu />
                        </IconButton>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 18,
                                        sm: 21,
                                    },
                                    fontWeight: 800,
                                    color: "#172033",
                                }}
                            >
                                Employer Dashboard
                            </Typography>

                            <Typography
                                sx={{
                                    display: {
                                        xs: "none",
                                        sm: "block",
                                    },
                                    fontSize: 13,
                                    color: "#667085",
                                }}
                            >
                                Manage your jobs and
                                applications
                            </Typography>
                        </Box>
                    </Box>

                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#e0e7ff",
                            color: "#4338ca",
                            fontWeight: 800,
                        }}
                    >
                        {user?.FirstName?.charAt(0) ||
                            "E"}
                    </Avatar>
                </Box>

                {/* CONTENT */}
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 1500,
                        mx: "auto",
                        p: {
                            xs: 2,
                            sm: 3,
                            lg: 4,
                        },
                        boxSizing: "border-box",
                    }}
                >
                    {/* WELCOME */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 24,
                                    sm: 30,
                                },
                                fontWeight: 800,
                                color: "#172033",
                            }}
                        >
                            Welcome back
                            {user?.FirstName
                                ? `, ${user.FirstName}`
                                : ""}
                            ! 👋
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                color: "#667085",
                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                            }}
                        >
                            Here's what's happening
                            with your recruitment
                            activity.
                        </Typography>
                    </Box>

                    {/* ERROR */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() =>
                                setError("")
                            }
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* COMPANY */}
                    {loading ? (
                        <Paper
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 2.5,
                                },
                                mb: 3,
                                borderRadius: 3,
                                border:
                                    "1px solid #eaecf0",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Skeleton
                                    variant="circular"
                                    width={52}
                                    height={52}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Skeleton
                                        variant="text"
                                        width="35%"
                                        height={28}
                                    />

                                    <Skeleton
                                        variant="text"
                                        width="50%"
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    ) : company ? (
                        <Paper
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 2.5,
                                },
                                mb: 3,
                                borderRadius: 3,
                                border:
                                    "1px solid #eaecf0",
                                boxShadow:
                                    "0 2px 8px rgba(16,24,40,0.04)",
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
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        backgroundColor:
                                            "#eef2ff",
                                        color: "#4f46e5",
                                    }}
                                >
                                    <Business />
                                </Avatar>

                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 800,
                                            color: "#172033",
                                        }}
                                    >
                                        {company.CompanyName ||
                                            "Your Company"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#667085",
                                        }}
                                    >
                                        Company profile
                                        and recruitment
                                        overview
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    endIcon={
                                        <ArrowForward />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/company-profile"
                                        )
                                    }
                                    sx={{
                                        width: {
                                            xs: "100%",
                                            sm: "auto",
                                        },
                                        borderRadius: 2,
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    View Company
                                </Button>
                            </Box>
                        </Paper>
                    ) : null}

                    {/* STATISTICS */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            },
                            gap: {
                                xs: 2,
                                sm: 2.5,
                            },
                            mb: 4,
                        }}
                    >
                        {loading ? (
                            <>
                                {[1, 2, 3].map(
                                    (item) => (
                                        <Card
                                            key={item}
                                            sx={{
                                                borderRadius: 3,
                                                border:
                                                    "1px solid #eaecf0",
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    p: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Skeleton
                                                            variant="text"
                                                            width="55%"
                                                            height={
                                                                24
                                                            }
                                                        />

                                                        <Skeleton
                                                            variant="text"
                                                            width="35%"
                                                            height={
                                                                48
                                                            }
                                                        />
                                                    </Box>

                                                    <Skeleton
                                                        variant="circular"
                                                        width={
                                                            48
                                                        }
                                                        height={
                                                            48
                                                        }
                                                    />
                                                </Box>

                                                <Skeleton
                                                    variant="text"
                                                    width="70%"
                                                />
                                            </CardContent>
                                        </Card>
                                    )
                                )}
                            </>
                        ) : (
                            <>
                                <SummaryCard
                                    title="Total Jobs"
                                    value={
                                        statistics.totalJobs
                                    }
                                    description="Total jobs posted by your company"
                                    icon={<Work />}
                                    iconBackground="#eef2ff"
                                    iconColor="#4f46e5"
                                />

                                <SummaryCard
                                    title="Open Jobs"
                                    value={
                                        statistics.openJobs
                                    }
                                    description="Jobs currently accepting applications"
                                    icon={
                                        <TrendingUp />
                                    }
                                    iconBackground="#ecfdf3"
                                    iconColor="#039855"
                                />

                                <SummaryCard
                                    title="Applications"
                                    value={
                                        statistics.totalApplications
                                    }
                                    description="Applications received across your jobs"
                                    icon={
                                        <People />
                                    }
                                    iconBackground="#fff7ed"
                                    iconColor="#ea580c"
                                />
                            </>
                        )}
                    </Box>

                    {/* RECENT JOBS */}
                    <Paper
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #eaecf0",
                            overflow: "hidden",
                        }}
                    >
                        {/* Section Header */}
                        <Box
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 3,
                                },
                                borderBottom:
                                    "1px solid #eaecf0",
                                display: "flex",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                },
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
                                        color: "#172033",
                                    }}
                                >
                                    Recent Job Postings
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#667085",
                                        mt: 0.3,
                                    }}
                                >
                                    Overview of your latest
                                    job postings
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                endIcon={
                                    <ArrowForward />
                                }
                                onClick={() =>
                                    navigate(
                                        "/employer/jobs"
                                    )
                                }
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "auto",
                                    },
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                }}
                            >
                                View All Jobs
                            </Button>
                        </Box>

                        {/* Recent Jobs Body */}
                        <Box
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 3,
                                },
                            }}
                        >
                            {loading ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        gap: 2,
                                    }}
                                >
                                    {[1, 2, 3].map(
                                        (item) => (
                                            <Box
                                                key={item}
                                                sx={{
                                                    p: 2,
                                                    border:
                                                        "1px solid #eaecf0",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Skeleton
                                                    variant="text"
                                                    width="55%"
                                                    height={
                                                        30
                                                    }
                                                />

                                                <Skeleton
                                                    variant="text"
                                                    width="35%"
                                                />

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        flexWrap:
                                                            "wrap",
                                                        gap: 1,
                                                        mt: 1,
                                                    }}
                                                >
                                                    <Skeleton
                                                        variant="rounded"
                                                        width={
                                                            100
                                                        }
                                                        height={
                                                            28
                                                        }
                                                    />

                                                    <Skeleton
                                                        variant="rounded"
                                                        width={
                                                            120
                                                        }
                                                        height={
                                                            28
                                                        }
                                                    />
                                                </Box>
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ) : jobs.length === 0 ? (
                                <Box
                                    sx={{
                                        py: {
                                            xs: 5,
                                            sm: 7,
                                        },
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            mx: "auto",
                                            mb: 2,
                                            backgroundColor:
                                                "#f2f4f7",
                                            color: "#667085",
                                        }}
                                    >
                                        <Work />
                                    </Avatar>

                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 800,
                                            color: "#172033",
                                        }}
                                    >
                                        No job postings yet
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            mb: 2.5,
                                            color: "#667085",
                                            fontSize: 14,
                                        }}
                                    >
                                        Create your first
                                        job posting to start
                                        receiving
                                        applications.
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
                                            borderRadius: 2,
                                            textTransform:
                                                "none",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Post a Job
                                    </Button>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        gap: 2,
                                    }}
                                >
                                    {jobs
                                        .slice(0, 5)
                                        .map((job) => (
                                            <Card
                                                key={
                                                    job.JobID
                                                }
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2.5,
                                                    boxShadow:
                                                        "none",
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        p: {
                                                            xs: 2,
                                                            sm: 2.5,
                                                        },
                                                    }}
                                                >
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
                                                                {
                                                                    xs: "flex-start",
                                                                    sm: "center",
                                                                },
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 16,
                                                                    fontWeight: 800,
                                                                    color: "#172033",
                                                                    overflowWrap:
                                                                        "anywhere",
                                                                }}
                                                            >
                                                                {job.JobTitle ||
                                                                    "Untitled Job"}
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: 13,
                                                                    color: "#667085",
                                                                    mt: 0.5,
                                                                }}
                                                            >
                                                                {job.Location ||
                                                                    "Location not specified"}
                                                            </Typography>
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Chip
                                                                label={
                                                                    job.Status
                                                                        ? "Open"
                                                                        : "Closed"
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    backgroundColor:
                                                                        job.Status
                                                                            ? "#ecfdf3"
                                                                            : "#f2f4f7",
                                                                    color:
                                                                        job.Status
                                                                            ? "#027a48"
                                                                            : "#667085",
                                                                }}
                                                            />

                                                            <Chip
                                                                label={`${Number(
                                                                    job.applicationCount ||
                                                                        0
                                                                )} applications`}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                }}
                                                            />
                                                        </Box>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                color: "#667085",
                                                            }}
                                                        >
                                                            Deadline:{" "}
                                                            {formatDate(
                                                                job.ApplicationDeadline
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default EmployerDashboard;