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
import { useAuth } from "../context/AuthContext";

function EmployerDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [company, setCompany] = useState(null);
    const [statistics, setStatistics] = useState({
        totalJobs: 0,
        openJobs: 0,
        totalApplications: 0,
    });

    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/jobs/employer");

            const data = response.data?.data;

            setCompany(data?.company || null);

            setStatistics({
    totalJobs: data?.statistics?.totalJobs || 0,
    openJobs: data?.statistics?.openJobs || 0,
    totalApplications: data?.statistics?.totalApplications || 0,
});

            setRecentJobs((data?.jobs || []).slice(0, 5));
        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load your employer dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileOpen(false);
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
            path: "/employer/applicants",
        },
    ];

    const SidebarContent = () => (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#111827",
                color: "#fff",
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    px: 3,
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, #2563eb, #7c3aed)",
                        fontWeight: 800,
                        fontSize: "1.25rem",
                    }}
                >
                    C
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            lineHeight: 1.2,
                        }}
                    >
                        CareerBridge
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.72rem",
                            color: "#9ca3af",
                            mt: 0.3,
                        }}
                    >
                        Employer Portal
                    </Typography>
                </Box>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 2, py: 3 }}>
                {sidebarItems.map((item) => {
                    const isActive =
                        window.location.pathname === item.path;

                    return (
                        <ListItemButton
                            key={item.label}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                py: 1.3,
                                color: isActive ? "#fff" : "#9ca3af",
                                backgroundColor: isActive
                                    ? "rgba(37, 99, 235, 0.18)"
                                    : "transparent",
                                borderLeft: isActive
                                    ? "3px solid #3b82f6"
                                    : "3px solid transparent",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.06)",
                                    color: "#fff",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 42,
                                    color: isActive
                                        ? "#60a5fa"
                                        : "#9ca3af",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: "0.92rem",
                                    fontWeight: isActive ? 700 : 500,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Bottom user section */}
            <Box
                sx={{
                    mt: "auto",
                    p: 2,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            background:
                                "linear-gradient(135deg, #2563eb, #7c3aed)",
                            fontWeight: 700,
                        }}
                    >
                        {user?.FirstName?.charAt(0)?.toUpperCase() || "E"}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            noWrap
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "#fff",
                            }}
                        >
                            {user?.FirstName || "Employer"}
                        </Typography>

                        <Typography
                            noWrap
                            sx={{
                                fontSize: "0.72rem",
                                color: "#9ca3af",
                            }}
                        >
                            Employer
                        </Typography>
                    </Box>
                </Box>

                <Button
                    fullWidth
                    startIcon={<ExitToApp />}
                    onClick={handleLogout}
                    sx={{
                        justifyContent: "flex-start",
                        px: 1.5,
                        py: 1,
                        color: "#fca5a5",
                        textTransform: "none",
                        borderRadius: 2,

                        "&:hover": {
                            backgroundColor: "rgba(239,68,68,0.1)",
                            color: "#f87171",
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
            }}
        >
            {/* Desktop Sidebar */}
            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 250,
                    zIndex: 1200,
                }}
            >
                <SidebarContent />
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },
                    "& .MuiDrawer-paper": {
                        width: 250,
                    },
                }}
            >
                <SidebarContent />
            </Drawer>

            {/* Main Content */}
            <Box
                sx={{
                    ml: {
                        xs: 0,
                        md: "250px",
                    },
                    minHeight: "100vh",
                }}
            >
                {/* Top Bar */}
                <Box
                    sx={{
                        height: 72,
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <IconButton
                            onClick={() => setMobileOpen(true)}
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },
                            }}
                        >
                            <Menu />
                        </IconButton>

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: {
                                        xs: "1.05rem",
                                        sm: "1.2rem",
                                    },
                                    color: "#111827",
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
                                    color: "#6b7280",
                                    fontSize: "0.8rem",
                                }}
                            >
                                Manage your jobs and applicants
                            </Typography>
                        </Box>
                    </Box>

                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            background:
                                "linear-gradient(135deg, #2563eb, #7c3aed)",
                            fontWeight: 700,
                        }}
                    >
                        {user?.FirstName?.charAt(0)?.toUpperCase() || "E"}
                    </Avatar>
                </Box>

                {/* Page Content */}
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
                    {/* Error */}
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

                    {/* Welcome */}
                    <Box
                        sx={{
                            mb: 4,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.5rem",
                                        sm: "1.8rem",
                                    },
                                    fontWeight: 800,
                                    color: "#111827",
                                    mb: 0.5,
                                }}
                            >
                                Welcome back,{" "}
                                {user?.FirstName || "Employer"} 👋
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#6b7280",
                                    fontSize: "0.95rem",
                                }}
                            >
                                Here is what's happening with your
                                recruitment activity.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() =>
                                navigate("/employer/post-job")
                            }
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 1.2,
                                textTransform: "none",
                                fontWeight: 700,
                                background:
                                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                                boxShadow:
                                    "0 6px 18px rgba(37,99,235,0.22)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg, #1d4ed8, #4338ca)",
                                },
                            }}
                        >
                            Post a Job
                        </Button>
                    </Box>

                    {/* Company */}
                    {loading ? (
                        <Skeleton
                            variant="rounded"
                            height={105}
                            sx={{
                                mb: 4,
                                borderRadius: 3,
                            }}
                        />
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 2.5,
                                },
                                mb: 4,
                                borderRadius: 3,
                                border: "1px solid #e5e7eb",
                                background:
                                    "linear-gradient(135deg, #ffffff, #f8faff)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        backgroundColor: "#eff6ff",
                                        color: "#2563eb",
                                    }}
                                >
                                    <Business />
                                </Avatar>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: "#6b7280",
                                            mb: 0.3,
                                        }}
                                    >
                                        Your Company
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "1.1rem",
                                            fontWeight: 800,
                                            color: "#111827",
                                        }}
                                    >
                                        {company?.CompanyName ||
                                            "Company Profile"}
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate("/company-profile")
                                }
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    fontWeight: 600,
                                }}
                            >
                                View Company
                            </Button>
                        </Paper>
                    )}

                    {/* Statistics */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            },
                            gap: 2.5,
                            mb: 4,
                        }}
                    >
                        <SummaryCard
                            title="Total Jobs"
                            value={statistics.totalJobs}
                            icon={<Work />}
                            loading={loading}
                            description="Jobs posted"
                        />

                        <SummaryCard
                            title="Open Jobs"
                            value={statistics.openJobs}
                            icon={<TrendingUp />}
                            loading={loading}
                            description="Currently active"
                        />

                        <SummaryCard
                            title="Total Applications"
                            value={statistics.totalApplications}
                            icon={<People />}
                            loading={loading}
                            description="Applications received"
                        />
                    </Box>

                    {/* Recent Jobs */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                px: {
                                    xs: 2,
                                    sm: 3,
                                },
                                py: 2.5,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                                borderBottom: "1px solid #e5e7eb",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        color: "#111827",
                                    }}
                                >
                                    Recent Job Postings
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: "#6b7280",
                                        mt: 0.3,
                                    }}
                                >
                                    Your latest job opportunities
                                </Typography>
                            </Box>

                            <Button
                                endIcon={<ArrowForward />}
                                onClick={() =>
                                    navigate("/employer/jobs")
                                }
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                }}
                            >
                                View All
                            </Button>
                        </Box>

                        <Box sx={{ p: 2 }}>
                            {loading ? (
                                <Box>
                                    <Skeleton
                                        height={80}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton
                                        height={80}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton height={80} />
                                </Box>
                            ) : recentJobs.length === 0 ? (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 7,
                                        px: 2,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            mx: "auto",
                                            mb: 2,
                                            backgroundColor:
                                                "#eff6ff",
                                            color: "#2563eb",
                                        }}
                                    >
                                        <Work />
                                    </Avatar>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            mb: 0.5,
                                        }}
                                    >
                                        No jobs posted yet
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#6b7280",
                                            fontSize: "0.85rem",
                                            mb: 2,
                                        }}
                                    >
                                        Create your first job
                                        posting to start receiving
                                        applications.
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() =>
                                            navigate(
                                                "/employer/post-job"
                                            )
                                        }
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 2,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Post Your First Job
                                    </Button>
                                </Box>
                            ) : (
                                recentJobs.map((job) => (
                                    <Card
                                        key={job.JobID}
                                        elevation={0}
                                        sx={{
                                            mb: 1.5,
                                            borderRadius: 2.5,
                                            border:
                                                "1px solid #e5e7eb",
                                            "&:last-child": {
                                                mb: 0,
                                            },
                                            "&:hover": {
                                                borderColor:
                                                    "#bfdbfe",
                                                boxShadow:
                                                    "0 4px 14px rgba(0,0,0,0.05)",
                                            },
                                            transition:
                                                "all 0.2s ease",
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                p: {
                                                    xs: 2,
                                                    sm: 2.5,
                                                },
                                                "&:last-child": {
                                                    pb: {
                                                        xs: 2,
                                                        sm: 2.5,
                                                    },
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: {
                                                        xs: "flex-start",
                                                        sm: "center",
                                                    },
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                    flexDirection: {
                                                        xs: "column",
                                                        sm: "row",
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
                                                            fontWeight: 800,
                                                            color: "#111827",
                                                            mb: 1,
                                                            fontSize:
                                                                "0.98rem",
                                                        }}
                                                    >
                                                        {
                                                            job.JobTitle
                                                        }
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            gap: 1,
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >
                                                        <Chip
                                                            label={
                                                                job.JobType ||
                                                                "Job"
                                                            }
                                                            size="small"
                                                            sx={{
                                                                backgroundColor:
                                                                    "#eff6ff",
                                                                color: "#2563eb",
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        />

                                                        <Chip
                                                            label={
                                                                job.Status
                                                                    ? "Open"
                                                                    : "Closed"
                                                            }
                                                            size="small"
                                                            sx={{
                                                                backgroundColor:
                                                                    job.Status
                                                                        ? "#ecfdf5"
                                                                        : "#f3f4f6",
                                                                color: job.Status
                                                                    ? "#059669"
                                                                    : "#6b7280",
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        />

                                                        <Chip
                                                            label={`${job.applicationCount || 0} ${
                                                                job.applicationCount ===
                                                                1
                                                                    ? "application"
                                                                    : "applications"
                                                            }`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>

                                                <Button
                                                    endIcon={
                                                        <ArrowForward />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/employer/jobs/${job.JobID}`
                                                        )
                                                    }
                                                    sx={{
                                                        textTransform:
                                                            "none",
                                                        fontWeight: 700,
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    View Job
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}

function SummaryCard({
    title,
    value,
    icon,
    loading,
    description,
}) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                height: "100%",
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                {loading ? (
                    <>
                        <Skeleton
                            variant="rounded"
                            width={46}
                            height={46}
                            sx={{ mb: 2 }}
                        />

                        <Skeleton
                            width="45%"
                            height={25}
                        />

                        <Skeleton
                            width="65%"
                            height={18}
                        />
                    </>
                ) : (
                    <>
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                                mb: 2,
                            }}
                        >
                            {icon}
                        </Box>

                        <Typography
                            sx={{
                                color: "#6b7280",
                                fontSize: "0.82rem",
                                mb: 0.5,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.8rem",
                                fontWeight: 800,
                                color: "#111827",
                                lineHeight: 1.2,
                            }}
                        >
                            {value}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#9ca3af",
                                fontSize: "0.75rem",
                            }}
                        >
                            {description}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default EmployerDashboard;