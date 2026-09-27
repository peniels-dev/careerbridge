import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    Dashboard as DashboardIcon,
    Work,
    Description,
    Person,
    Logout,
    Search,
    ArrowForward,
    BookmarkBorder,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import axiosAPI from "../api/axiosAPI";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [applicationCount, setApplicationCount] = useState(0);
    const [shortlistedCount, setShortlistedCount] = useState(0);
    const [cvCount, setCvCount] = useState(0);

    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const firstName = user?.firstName || "User";

    // =====================================================
    // LOAD DASHBOARD STATISTICS
    // =====================================================

    useEffect(() => {
        const loadDashboardStats = async () => {
            try {
                setLoadingStats(true);
                setStatsError("");

                const [applicationsResponse, cvsResponse] =
                    await Promise.all([
                        axiosAPI.get("/applications/me"),
                        axiosAPI.get("/cvs"),
                    ]);

                // -----------------------------
                // Applications
                // -----------------------------

                const applications =
                    applicationsResponse.data?.data || [];

                setApplicationCount(applications.length);

                // -----------------------------
                // Shortlisted applications
                // -----------------------------

                const shortlisted = applications.filter(
                    (application) =>
                        application.status === "Shortlisted"
                );

                setShortlistedCount(shortlisted.length);

                // -----------------------------
                // CVs
                // -----------------------------

                const cvs = cvsResponse.data?.data || [];

                setCvCount(cvs.length);
            } catch (error) {
                console.error(
                    "Failed to load dashboard statistics:",
                    error
                );

                setStatsError(
                    "Some dashboard information could not be loaded."
                );
            } finally {
                setLoadingStats(false);
            }
        };

        loadDashboardStats();
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                display: "flex",
            }}
        >
            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#111827",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                {/* Logo */}

                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        borderBottom:
                            "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Career<span style={{ color: "#60a5fa" }}>
                            Bridge
                        </span>
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#9ca3af",
                            mt: 0.5,
                        }}
                    >
                        Job Seeker Portal
                    </Typography>
                </Box>

                {/* Navigation */}

                <Box sx={{ px: 2, py: 3 }}>
                    <SidebarItem
                        icon={<DashboardIcon />}
                        label="Dashboard"
                        active
                        onClick={() => navigate("/dashboard")}
                    />

                    <SidebarItem
                        icon={<Search />}
                        label="Find Jobs"
                        onClick={() => navigate("/jobs")}
                    />

                    <SidebarItem
                        icon={<Description />}
                        label="My Applications"
                        onClick={() =>
                            navigate("/my-applications")
                        }
                    />

                    <SidebarItem
                        icon={<Person />}
                        label="My Profile"
                        onClick={() => navigate("/profile")}
                    />

                    <SidebarItem
                        icon={<Description />}
                        label="My CVs"
                        onClick={() => navigate("/my-cvs")}
                    />
                </Box>

                {/* Logout */}

                <Box
                    sx={{
                        mt: "auto",
                        p: 2,
                        borderTop:
                            "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: "flex-start",
                            color: "#d1d5db",
                            textTransform: "none",
                            px: 2,
                            py: 1.2,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor:
                                    "rgba(255,255,255,0.08)",
                                color: "white",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <Box
                sx={{
                    flex: 1,
                    ml: "250px",
                    minWidth: 0,
                }}
            >
                {/* Header */}

                <Box
                    sx={{
                        backgroundColor: "white",
                        borderBottom:
                            "1px solid #e5e7eb",
                        px: { xs: 3, md: 5 },
                        py: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Box sx={{ textAlign: "right" }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                {firstName}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{ color: "#6b7280" }}
                            >
                                Job Seeker
                            </Typography>
                        </Box>

                        <Avatar
                            sx={{
                                width: 42,
                                height: 42,
                                backgroundColor: "#2563eb",
                                fontWeight: 700,
                            }}
                        >
                            {firstName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Stack>
                </Box>

                {/* Page Content */}

                <Box
                    sx={{
                        px: { xs: 3, md: 5 },
                        py: { xs: 4, md: 5 },
                        maxWidth: 1400,
                        mx: "auto",
                    }}
                >
                    {/* Welcome */}

                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#111827",
                                mb: 1,
                            }}
                        >
                            Welcome back, {firstName}! 👋
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#6b7280",
                                maxWidth: 700,
                            }}
                        >
                            Keep track of your applications,
                            discover new opportunities, and
                            build your career with CareerBridge.
                        </Typography>
                    </Box>

                    {/* Search / Browse Jobs */}

                    <Card
                        elevation={0}
                        sx={{
                            mb: 4,
                            borderRadius: 3,
                            background:
                                "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                            color: "white",
                            overflow: "hidden",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: { xs: 3, md: 4 },
                                "&:last-child": {
                                    pb: { xs: 3, md: 4 },
                                },
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    md: "row",
                                }}
                                spacing={3}
                                alignItems={{
                                    xs: "flex-start",
                                    md: "center",
                                }}
                                justifyContent="space-between"
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 1,
                                        }}
                                    >
                                        Find your next opportunity
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,0.82)",
                                        }}
                                    >
                                        Explore available jobs and
                                        internships that match your
                                        career goals.
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForward />}
                                    onClick={() =>
                                        navigate("/jobs")
                                    }
                                    sx={{
                                        backgroundColor: "white",
                                        color: "#1d4ed8",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        px: 3,
                                        py: 1.3,
                                        borderRadius: 2,
                                        whiteSpace: "nowrap",
                                        "&:hover": {
                                            backgroundColor:
                                                "#eff6ff",
                                        },
                                    }}
                                >
                                    Browse Jobs
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Error */}

                    {statsError && (
                        <Paper
                            elevation={0}
                            sx={{
                                mb: 3,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#fff7ed",
                                border:
                                    "1px solid #fed7aa",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#c2410c",
                                }}
                            >
                                {statsError}
                            </Typography>
                        </Paper>
                    )}

                    {/* =====================================================
                        STATISTICS
                    ===================================================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            color: "#111827",
                            mb: 2,
                        }}
                    >
                        Your Activity
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2.5,
                            mb: 5,
                        }}
                    >
                        <StatCard
                            title="Applications"
                            value={
                                loadingStats
                                    ? "..."
                                    : applicationCount
                            }
                            icon={<Description />}
                            subtitle="Jobs you have applied for"
                            onClick={() =>
                                navigate("/my-applications")
                            }
                        />

                        <StatCard
                            title="Shortlisted"
                            value={
                                loadingStats
                                    ? "..."
                                    : shortlistedCount
                            }
                            icon={<BookmarkBorder />}
                            subtitle="Applications progressing"
                            onClick={() =>
                                navigate("/my-applications")
                            }
                        />

                        <StatCard
                            title="CVs"
                            value={
                                loadingStats
                                    ? "..."
                                    : cvCount
                            }
                            icon={<Description />}
                            subtitle="Uploaded CVs"
                            onClick={() =>
                                navigate("/my-cvs")
                            }
                        />
                    </Box>

                    {/* =====================================================
                        QUICK ACTIONS
                    ===================================================== */}

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            color: "#111827",
                            mb: 2,
                        }}
                    >
                        Quick Actions
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2.5,
                            mb: 5,
                        }}
                    >
                        <QuickAction
                            icon={<Work />}
                            title="Find Jobs"
                            description="Browse available jobs and internships."
                            buttonText="Explore Jobs"
                            onClick={() => navigate("/jobs")}
                        />

                        <QuickAction
                            icon={<Description />}
                            title="My Applications"
                            description="Track the progress of your applications."
                            buttonText="View Applications"
                            onClick={() =>
                                navigate("/my-applications")
                            }
                        />

                        <QuickAction
                            icon={<Person />}
                            title="My Profile"
                            description="Keep your professional information up to date."
                            buttonText="View Profile"
                            onClick={() => navigate("/profile")}
                        />
                    </Box>

                    {/* =====================================================
                        CAREER TIP
                    ===================================================== */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            p: { xs: 3, md: 4 },
                            backgroundColor: "white",
                        }}
                    >
                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={3}
                            alignItems={{
                                xs: "flex-start",
                                md: "center",
                            }}
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#111827",
                                        mb: 1,
                                    }}
                                >
                                    💡 Build a stronger profile
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                        maxWidth: 700,
                                    }}
                                >
                                    A complete profile and an up-to-date
                                    CV can help employers understand your
                                    skills and experience more easily.
                                </Typography>
                            </Box>

                        <Button
    variant="contained"
    onClick={() => navigate("/profile")}
    sx={{
        minHeight: 44,
        px: 3,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.95rem",
        backgroundColor: "#2563eb",
        boxShadow: "none",
        "&:hover": {
            backgroundColor: "#1d4ed8",
            boxShadow: "none",
        },
    }}
>
    Complete Profile
</Button>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

// =====================================================
// SIDEBAR ITEM
// =====================================================

const SidebarItem = ({
    icon,
    label,
    active = false,
    onClick,
}) => {
    return (
        <Button
            fullWidth
            startIcon={icon}
            onClick={onClick}
            disableRipple
            sx={{
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",

                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",

                color: active ? "white" : "#9ca3af",
                backgroundColor: active
                    ? "#1d4ed8"
                    : "transparent",

                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: active ? 700 : 500,

                px: 2,
                py: 1.35,
                mb: 0.8,

                borderRadius: 2,

                whiteSpace: "nowrap",

                overflow: "hidden",

                "&:hover": {
                    backgroundColor: active
                        ? "#1d4ed8"
                        : "rgba(255,255,255,0.07)",
                    color: "white",
                },

                "& .MuiButton-startIcon": {
                    marginLeft: 0,
                    marginRight: 1.5,
                    flexShrink: 0,
                },

                "& .MuiButton-startIcon svg": {
                    fontSize: 21,
                },

                "& .MuiButton-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                },
            }}
        >
            {label}
        </Button>
    );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    title,
    value,
    icon,
    subtitle,
    onClick,
}) => {
    return (
        <Card
            elevation={0}
            onClick={onClick}
            sx={{
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.07)",
                    borderColor: "#bfdbfe",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6b7280",
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{
                                color: "#111827",
                                fontWeight: 800,
                                lineHeight: 1,
                                mb: 1,
                            }}
                        >
                            {value}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#9ca3af",
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({
    icon,
    title,
    description,
    buttonText,
    onClick,
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                height: "100%",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: "#bfdbfe",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent
                sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        minWidth: 48,
                        borderRadius: 2,
                        backgroundColor: "#eff6ff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                    }}
                >
                    {icon}
                </Box>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        color: "#111827",
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body2"
                    sx={{
                        color: "#6b7280",
                        lineHeight: 1.6,
                        mb: 3,
                        flex: 1,
                    }}
                >
                    {description}
                </Typography>

                {/* Button */}
                <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={onClick}
                    sx={{
                        width: "100%",
                        minHeight: 44,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        borderRadius: 2,
                        backgroundColor: "#2563eb",
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "#1d4ed8",
                            boxShadow: "none",
                        },
                    }}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
};

export default Dashboard;