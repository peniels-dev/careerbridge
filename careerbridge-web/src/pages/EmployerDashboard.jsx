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
                totalApplications:
                    data?.statistics?.totalApplications || 0,
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
                backgroundColor: "#293241",
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
                    borderBottom:
                        "1px solid rgba(255,255,255,0.08)",
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
                        backgroundColor: "#E76F51",
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
                            color: "#C8C5C0",
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
                            onClick={() =>
                                handleNavigation(item.path)
                            }
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                py: 1.3,
                                color: isActive
                                    ? "#fff"
                                    : "#C8C5C0",
                                backgroundColor: isActive
                                    ? "rgba(231,111,81,0.18)"
                                    : "transparent",
                                borderLeft: isActive
                                    ? "3px solid #E76F51"
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
                                        ? "#F4A261"
                                        : "#C8C5C0",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: "0.92rem",
                                    fontWeight: isActive
                                        ? 700
                                        : 500,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Bottom User Section */}
            <Box
                sx={{
                    mt: "auto",
                    p: 2,
                    borderTop:
                        "1px solid rgba(255,255,255,0.08)",
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
                        backgroundColor:
                            "rgba(255,255,255,0.05)",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            backgroundColor: "#F4A261",
                            color: "#293241",
                            fontWeight: 700,
                        }}
                    >
                        {user?.FirstName
                            ?.charAt(0)
                            ?.toUpperCase() || "E"}
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
                                color: "#C8C5C0",
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
                        color: "#F4B4A8",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor:
                                "rgba(231,111,81,0.12)",
                            color: "#F4A261",
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
                backgroundColor: "#FFF8EF",
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
                        backgroundColor: "#FFFDF9",
                        borderBottom:
                            "1px solid #E9DED0",
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
                            onClick={() =>
                                setMobileOpen(true)
                            }
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },
                                color: "#293241",
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
                                    color: "#293241",
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
                                    color: "#7A7068",
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
                            backgroundColor: "#F4A261",
                            color: "#293241",
                            fontWeight: 700,
                        }}
                    >
                        {user?.FirstName
                            ?.charAt(0)
                            ?.toUpperCase() || "E"}
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
                                    color: "#293241",
                                    mb: 0.5,
                                }}
                            >
                                Welcome back,{" "}
                                {user?.FirstName || "Employer"} 👋
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#7A7068",
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
                                backgroundColor: "#E76F51",
                                boxShadow:
                                    "0 5px 14px rgba(231,111,81,0.18)",
                                "&:hover": {
                                    backgroundColor: "#D85F43",
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
                                borderRadius: 2,
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
                                borderRadius: 2.5,
                                border:
                                    "1px solid #E9DED0",
                                backgroundColor: "#FFFDF9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
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
                                        backgroundColor:
                                            "#FFF1D6",
                                        color: "#E76F51",
                                    }}
                                >
                                    <Business />
                                </Avatar>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: "#7A7068",
                                            mb: 0.3,
                                        }}
                                    >
                                        Your Company
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "1.1rem",
                                            fontWeight: 800,
                                            color: "#293241",
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
                                    navigate(
                                        "/company-profile"
                                    )
                                }
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    color: "#E76F51",
                                    borderColor: "#E9B8AA",
                                    "&:hover": {
                                        borderColor: "#E76F51",
                                        backgroundColor:
                                            "#FFF8EF",
                                    },
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
                            iconBackground="#FFF1D6"
                            iconColor="#E76F51"
                        />

                        <SummaryCard
                            title="Open Jobs"
                            value={statistics.openJobs}
                            icon={<TrendingUp />}
                            loading={loading}
                            description="Currently active"
                            iconBackground="#EDF4E8"
                            iconColor="#6A994E"
                        />

                        <SummaryCard
                            title="Total Applications"
                            value={
                                statistics.totalApplications
                            }
                            icon={<People />}
                            loading={loading}
                            description="Applications received"
                            iconBackground="#FCEBDD"
                            iconColor="#D9822B"
                        />
                    </Box>

                    {/* Recent Jobs */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 2.5,
                            border:
                                "1px solid #E9DED0",
                            overflow: "hidden",
                            backgroundColor: "#FFFDF9",
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
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                gap: 2,
                                borderBottom:
                                    "1px solid #E9DED0",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "1.1rem",
                                        color: "#293241",
                                    }}
                                >
                                    Recent Job Postings
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: "#7A7068",
                                        mt: 0.3,
                                    }}
                                >
                                    Your latest job opportunities
                                </Typography>
                            </Box>

                            <Button
                                endIcon={<ArrowForward />}
                                onClick={() =>
                                    navigate(
                                        "/employer/jobs"
                                    )
                                }
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    color: "#E76F51",
                                    "&:hover": {
                                        backgroundColor:
                                            "#FFF1D6",
                                    },
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
                                                "#FFF1D6",
                                            color: "#E76F51",
                                        }}
                                    >
                                        <Work />
                                    </Avatar>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            mb: 0.5,
                                            color: "#293241",
                                        }}
                                    >
                                        No jobs posted yet
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#7A7068",
                                            fontSize: "0.85rem",
                                            mb: 2,
                                        }}
                                    >
                                        Create your first job
                                        posting to start
                                        receiving
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
                                            textTransform:
                                                "none",
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            backgroundColor:
                                                "#E76F51",
                                            "&:hover": {
                                                backgroundColor:
                                                    "#D85F43",
                                            },
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
                                            borderRadius: 2,
                                            border:
                                                "1px solid #E9DED0",
                                            backgroundColor:
                                                "#FFFDF9",
                                            "&:last-child": {
                                                mb: 0,
                                            },
                                            "&:hover": {
                                                borderColor:
                                                    "#E6B7A8",
                                                boxShadow:
                                                    "0 4px 14px rgba(82,64,52,0.07)",
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
                                                            color: "#293241",
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
                                                                    "#FFF1D6",
                                                                color:
                                                                    "#A65F00",
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
                                                                        ? "#EDF4E8"
                                                                        : "#F1ECE7",
                                                                color:
                                                                    job.Status
                                                                        ? "#477A35"
                                                                        : "#756B63",
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
                                                            sx={{
                                                                backgroundColor:
                                                                    "#F7F1EA",
                                                                color:
                                                                    "#6F655D",
                                                                fontWeight:
                                                                    600,
                                                            }}
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
                                                        color:
                                                            "#E76F51",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "#FFF1D6",
                                                        },
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
    iconBackground,
    iconColor,
}) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 2.5,
                border: "1px solid #E9DED0",
                backgroundColor: "#FFFDF9",
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
                                backgroundColor:
                                    iconBackground,
                                color: iconColor,
                                mb: 2,
                            }}
                        >
                            {icon}
                        </Box>

                        <Typography
                            sx={{
                                color: "#7A7068",
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
                                color: "#293241",
                                lineHeight: 1.2,
                            }}
                        >
                            {value}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#9A9088",
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