import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    Skeleton,
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
    Menu as MenuIcon,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import axiosAPI from "../api/axiosAPI";
import SummaryCard from "../components/SummaryCard";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [applicationCount, setApplicationCount] = useState(0);
    const [shortlistedCount, setShortlistedCount] = useState(0);
    const [cvCount, setCvCount] = useState(0);

    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState("");

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

    const firstName =
        user?.firstName ||
        user?.FirstName ||
        "User";

    const firstLetter = firstName
        .charAt(0)
        .toUpperCase();

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        setProfileMenuAnchor(null);
        setMobileMenuOpen(false);

        logout();
        navigate("/login");
    };

    // =====================================================
    // LOAD DASHBOARD STATISTICS
    // =====================================================

    useEffect(() => {
        let isMounted = true;

        const loadDashboardStats = async () => {
            try {
                setLoadingStats(true);
                setStatsError("");

                const results = await Promise.allSettled([
                    axiosAPI.get("/applications/me"),
                    axiosAPI.get("/cvs"),
                ]);

                if (!isMounted) {
                    return;
                }

                const applicationsResult = results[0];
                const cvsResult = results[1];

                let hasError = false;

                // =================================================
                // APPLICATIONS
                // =================================================

                if (
                    applicationsResult.status ===
                    "fulfilled"
                ) {
                    const applications =
                        applicationsResult.value.data?.data ||
                        [];

                    setApplicationCount(
                        Array.isArray(applications)
                            ? applications.length
                            : 0
                    );

                    const shortlisted =
                        Array.isArray(applications)
                            ? applications.filter(
                                  (application) =>
                                      application.status ===
                                          "Shortlisted" ||
                                      application.Status ===
                                          "Shortlisted"
                              )
                            : [];

                    setShortlistedCount(
                        shortlisted.length
                    );
                } else {
                    console.error(
                        "Failed to load applications:",
                        applicationsResult.reason
                    );

                    hasError = true;
                }

                // =================================================
                // CVS
                // =================================================

                if (
                    cvsResult.status ===
                    "fulfilled"
                ) {
                    const cvs =
                        cvsResult.value.data?.data ||
                        [];

                    setCvCount(
                        Array.isArray(cvs)
                            ? cvs.length
                            : 0
                    );
                } else {
                    console.error(
                        "Failed to load CVs:",
                        cvsResult.reason
                    );

                    hasError = true;
                }

                if (hasError) {
                    setStatsError(
                        "Some dashboard information could not be loaded. Please try again."
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load dashboard statistics:",
                    error
                );

                if (isMounted) {
                    setStatsError(
                        "Dashboard information could not be loaded. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoadingStats(false);
                }
            }
        };

        loadDashboardStats();

        return () => {
            isMounted = false;
        };
    }, []);

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleNavigation = (path) => {
        setMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                display: "flex",
                overflowX: "hidden",
            }}
        >
            {/* =====================================================
                DESKTOP SIDEBAR
            ===================================================== */}

            <Box
                sx={{
                    width: 250,
                    flexShrink: 0,
                    backgroundColor: "#111827",
                    color: "white",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    flexDirection: "column",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                {/* LOGO */}

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
                        Career
                        <span
                            style={{
                                color: "#60a5fa",
                            }}
                        >
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

                {/* NAVIGATION */}

                <Box
                    sx={{
                        px: 2,
                        py: 3,
                    }}
                >
                    <SidebarItem
                        icon={<DashboardIcon />}
                        label="Dashboard"
                        active
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    />

                    <SidebarItem
                        icon={<Search />}
                        label="Find Jobs"
                        onClick={() =>
                            navigate("/jobs")
                        }
                    />

                    <SidebarItem
                        icon={<Description />}
                        label="My Applications"
                        onClick={() =>
                            navigate(
                                "/my-applications"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Person />}
                        label="My Profile"
                        onClick={() =>
                            navigate("/profile")
                        }
                    />

                    <SidebarItem
                        icon={<Description />}
                        label="My CVs"
                        onClick={() =>
                            navigate("/my-cvs")
                        }
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* USER AREA */}

                <Box
                    sx={{
                        mx: 2,
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor:
                            "rgba(255,255,255,0.05)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                backgroundColor:
                                    "#2563eb",
                                fontWeight: 700,
                                fontSize: 15,
                                flexShrink: 0,
                            }}
                        >
                            {firstLetter}
                        </Avatar>

                        <Box
                            sx={{
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    overflow: "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                {firstName}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#9ca3af",
                                    fontSize: 11,
                                }}
                            >
                                Job Seeker
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* LOGOUT */}

                <Box
                    sx={{
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
                            justifyContent:
                                "flex-start",
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
                MOBILE DRAWER
            ===================================================== */}

            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={() =>
                    setMobileMenuOpen(false)
                }
                slotProps={{
                    paper: {
                        sx: {
                            width: 260,
                            backgroundColor:
                                "#111827",
                            color: "white",
                        },
                    },
                }}
            >
                {/* MOBILE LOGO */}

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
                        }}
                    >
                        Career
                        <span
                            style={{
                                color: "#60a5fa",
                            }}
                        >
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

                {/* MOBILE NAVIGATION */}

                <Box
                    sx={{
                        px: 2,
                        py: 3,
                    }}
                >
                    <SidebarItem
                        icon={<DashboardIcon />}
                        label="Dashboard"
                        active
                        onClick={() =>
                            handleNavigation(
                                "/dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Search />}
                        label="Find Jobs"
                        onClick={() =>
                            handleNavigation(
                                "/jobs"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Description />}
                        label="My Applications"
                        onClick={() =>
                            handleNavigation(
                                "/my-applications"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Person />}
                        label="My Profile"
                        onClick={() =>
                            handleNavigation(
                                "/profile"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Description />}
                        label="My CVs"
                        onClick={() =>
                            handleNavigation(
                                "/my-cvs"
                            )
                        }
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* MOBILE LOGOUT */}

                <Box
                    sx={{
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
                            justifyContent:
                                "flex-start",
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
            </Drawer>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    ml: {
                        xs: 0,
                        md: "250px",
                    },
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        backgroundColor: "white",
                        borderBottom:
                            "1px solid #e5e7eb",
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 5,
                        },
                        py: 1.8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: 2,
                        position: "sticky",
                        top: 0,
                        zIndex: 900,
                    }}
                >
                    {/* MOBILE MENU BUTTON */}

                    <IconButton
                        onClick={() =>
                            setMobileMenuOpen(true)
                        }
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },
                            color: "#111827",
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* DESKTOP SPACER */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                md: "block",
                            },
                        }}
                    />

                    {/* PROFILE */}

                    <Box>
                        <Button
                            onClick={(event) =>
                                setProfileMenuAnchor(
                                    event.currentTarget
                                )
                            }
                            sx={{
                                textTransform: "none",
                                color: "#111827",
                                p: 0.5,
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor:
                                        "#f3f4f6",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 1.2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "block",
                                        },
                                        textAlign:
                                            "right",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: 13,
                                        }}
                                    >
                                        {firstName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "#6b7280",
                                            fontSize: 11,
                                        }}
                                    >
                                        Job Seeker
                                    </Typography>
                                </Box>

                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor:
                                            "#2563eb",
                                        fontWeight: 700,
                                    }}
                                >
                                    {firstLetter}
                                </Avatar>
                            </Box>
                        </Button>

                        <Menu
                            anchorEl={
                                profileMenuAnchor
                            }
                            open={Boolean(
                                profileMenuAnchor
                            )}
                            onClose={() =>
                                setProfileMenuAnchor(
                                    null
                                )
                            }
                        >
                            <MenuItem
                                onClick={() => {
                                    setProfileMenuAnchor(
                                        null
                                    );
                                    navigate(
                                        "/profile"
                                    );
                                }}
                            >
                                My Profile
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    setProfileMenuAnchor(
                                        null
                                    );
                                    navigate(
                                        "/my-cvs"
                                    );
                                }}
                            >
                                My CVs
                            </MenuItem>

                            <Divider />

                            <MenuItem
                                onClick={
                                    handleLogout
                                }
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* PAGE CONTENT */}

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 1400,
                        mx: "auto",
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 5,
                        },
                        py: {
                            xs: 3,
                            sm: 4,
                            md: 5,
                        },
                    }}
                >
                    {/* WELCOME */}

                    <Box sx={{ mb: 3.5 }}>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 25,
                                    sm: 30,
                                    md: 34,
                                },
                                fontWeight: 800,
                                color: "#111827",
                                letterSpacing:
                                    "-0.6px",
                            }}
                        >
                            Welcome back, {firstName}! 👋
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6b7280",
                                mt: 1,
                                maxWidth: 700,
                                fontSize: {
                                    xs: 13,
                                    sm: 15,
                                },
                                lineHeight: 1.6,
                            }}
                        >
                            Keep track of your
                            applications, discover
                            new opportunities, and
                            build your career with
                            CareerBridge.
                        </Typography>
                    </Box>

                    {/* FIND JOBS BANNER */}

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
                                p: {
                                    xs: 2.5,
                                    sm: 3,
                                    md: 4,
                                },
                                "&:last-child": {
                                    pb: {
                                        xs: 2.5,
                                        sm: 3,
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
                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 20,
                                                sm: 24,
                                            },
                                            fontWeight: 800,
                                            mb: 1,
                                        }}
                                    >
                                        Find your next
                                        opportunity
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "rgba(255,255,255,0.82)",
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                            lineHeight: 1.6,
                                            maxWidth: 650,
                                        }}
                                    >
                                        Explore available
                                        jobs and
                                        internships that
                                        match your career
                                        goals.
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    endIcon={
                                        <ArrowForward />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/jobs"
                                        )
                                    }
                                    sx={{
                                        backgroundColor:
                                            "white",
                                        color: "#1d4ed8",
                                        fontWeight: 700,
                                        textTransform:
                                            "none",
                                        px: 3,
                                        py: 1.3,
                                        borderRadius: 2,
                                        minHeight: 44,
                                        whiteSpace:
                                            "nowrap",
                                        "&:hover": {
                                            backgroundColor:
                                                "#eff6ff",
                                        },
                                    }}
                                >
                                    Browse Jobs
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* ERROR */}

                    {statsError && (
                        <Alert
                            severity="warning"
                            onClose={() =>
                                setStatsError("")
                            }
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                            }}
                        >
                            {statsError}
                        </Alert>
                    )}

                    {/* STATISTICS */}

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 18,
                                sm: 20,
                            },
                            fontWeight: 800,
                            color: "#111827",
                            mb: 2,
                        }}
                    >
                        Your Activity
                    </Typography>

                    {loadingStats ? (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)",
                                },
                                gap: 2,
                                mb: 5,
                            }}
                        >
                            {[1, 2, 3].map(
                                (item) => (
                                    <Card
                                        key={item}
                                        elevation={0}
                                        sx={{
                                            borderRadius: 3,
                                            border:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                p: {
                                                    xs: 2.5,
                                                    sm: 3,
                                                },
                                            }}
                                        >
                                            <Skeleton
                                                variant="text"
                                                width="40%"
                                                height={20}
                                            />

                                            <Skeleton
                                                variant="text"
                                                width="25%"
                                                height={45}
                                            />

                                            <Skeleton
                                                variant="text"
                                                width="75%"
                                                height={20}
                                            />
                                        </CardContent>
                                    </Card>
                                )
                            )}
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
                                mb: 5,
                            }}
                        >
                            <SummaryCard
                                title="Applications"
                                value={
                                    applicationCount
                                }
                                description="Jobs you have applied for"
                                icon={
                                    <Description />
                                }
                                iconBackground="#eef4ff"
                                iconColor="#4f8cff"
                            />

                            <SummaryCard
                                title="Shortlisted"
                                value={
                                    shortlistedCount
                                }
                                description="Applications progressing"
                                icon={
                                    <BookmarkBorder />
                                }
                                iconBackground="#ecfdf3"
                                iconColor="#12b76a"
                            />

                            <SummaryCard
                                title="CVs"
                                value={cvCount}
                                description="Uploaded CVs"
                                icon={
                                    <Description />
                                }
                                iconBackground="#f4f3ff"
                                iconColor="#7f56d9"
                            />
                        </Box>
                    )}

                    {/* QUICK ACTIONS */}

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 18,
                                sm: 20,
                            },
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
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
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
                            onClick={() =>
                                navigate("/jobs")
                            }
                        />

                        <QuickAction
                            icon={<Description />}
                            title="My Applications"
                            description="Track the progress of your applications."
                            buttonText="View Applications"
                            onClick={() =>
                                navigate(
                                    "/my-applications"
                                )
                            }
                        />

                        <QuickAction
                            icon={<Person />}
                            title="My Profile"
                            description="Keep your professional information up to date."
                            buttonText="View Profile"
                            onClick={() =>
                                navigate("/profile")
                            }
                        />
                    </Box>

                    {/* CAREER TIP */}

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            backgroundColor:
                                "white",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 2.5,
                                    sm: 3,
                                    md: 4,
                                },
                                "&:last-child": {
                                    pb: {
                                        xs: 2.5,
                                        sm: 3,
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
                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 18,
                                                sm: 20,
                                            },
                                            fontWeight: 800,
                                            color: "#111827",
                                            mb: 1,
                                        }}
                                    >
                                        💡 Build a stronger
                                        profile
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "#6b7280",
                                            maxWidth: 700,
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        A complete profile
                                        and an up-to-date
                                        CV can help
                                        employers
                                        understand your
                                        skills and
                                        experience more
                                        easily.
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        navigate(
                                            "/profile"
                                        )
                                    }
                                    sx={{
                                        minHeight: 44,
                                        px: 3,
                                        borderRadius: 2,
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        fontSize:
                                            "0.95rem",
                                        backgroundColor:
                                            "#2563eb",
                                        boxShadow:
                                            "none",
                                        whiteSpace:
                                            "nowrap",
                                        "&:hover": {
                                            backgroundColor:
                                                "#1d4ed8",
                                            boxShadow:
                                                "none",
                                        },
                                    }}
                                >
                                    Complete Profile
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
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
                color: active
                    ? "white"
                    : "#9ca3af",
                backgroundColor: active
                    ? "#1d4ed8"
                    : "transparent",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: active
                    ? 700
                    : 500,
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
            }}
        >
            {label}
        </Button>
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
                transition:
                    "all 0.2s ease",
                "&:hover": {
                    borderColor: "#bfdbfe",
                    boxShadow:
                        "0 8px 24px rgba(0,0,0,0.06)",
                    transform:
                        "translateY(-2px)",
                },
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection:
                        "column",
                    boxSizing:
                        "border-box",
                    "&:last-child": {
                        pb: {
                            xs: 2.5,
                            sm: 3,
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        minWidth: 48,
                        borderRadius: 2,
                        backgroundColor:
                            "#eff6ff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        mb: 2,
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        fontSize: {
                            xs: 17,
                            sm: 18,
                        },
                        fontWeight: 800,
                        color: "#111827",
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#6b7280",
                        lineHeight: 1.6,
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        mb: 3,
                        flex: 1,
                    }}
                >
                    {description}
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    endIcon={
                        <ArrowForward />
                    }
                    onClick={onClick}
                    sx={{
                        width: "100%",
                        minHeight: 44,
                        textTransform:
                            "none",
                        fontWeight: 700,
                        fontSize:
                            "0.95rem",
                        borderRadius: 2,
                        backgroundColor:
                            "#2563eb",
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor:
                                "#1d4ed8",
                            boxShadow:
                                "none",
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