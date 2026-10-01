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
    LocationOn,
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
                        applicationsResult.value.data?.data || [];

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
                        cvsResult.value.data?.data || [];

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
                backgroundColor: "#FFF8EF",
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
                    backgroundColor: "#293241",
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
                        <Box
                            component="span"
                            sx={{
                                color: "#F4A261",
                            }}
                        >
                            Bridge
                        </Box>
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#C8CED6",
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
                            "rgba(255,255,255,0.06)",
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
                                    "#E76F51",
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
                                    color: "#C8CED6",
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
                            color: "#D7DCE2",
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
                                "#293241",
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
                        <Box
                            component="span"
                            sx={{
                                color: "#F4A261",
                            }}
                        >
                            Bridge
                        </Box>
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#C8CED6",
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
                            color: "#D7DCE2",
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
                        backgroundColor:
                            "#FFFDF9",
                        borderBottom:
                            "1px solid #E9DED0",
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
                    {/* MOBILE MENU */}

                    <IconButton
                        onClick={() =>
                            setMobileMenuOpen(
                                true
                            )
                        }
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },
                            color: "#293241",
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
                                textTransform:
                                    "none",
                                color: "#293241",
                                p: 0.5,
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor:
                                        "#FFF1D6",
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
                                                "#7A7068",
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
                                            "#E76F51",
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

                {/* =====================================================
                    PAGE CONTENT
                ===================================================== */}

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
                    {/* =================================================
                        WELCOME
                    ================================================= */}

                    <Box
                        sx={{
                            mb: 4,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 27,
                                    sm: 32,
                                    md: 38,
                                },
                                fontWeight: 900,
                                color: "#293241",
                                letterSpacing:
                                    "-1px",
                                lineHeight: 1.15,
                            }}
                        >
                            Welcome back,{" "}
                            <Box
                                component="span"
                                sx={{
                                    color: "#E76F51",
                                }}
                            >
                                {firstName}!
                            </Box>{" "}
                            👋
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6F665F",
                                mt: 1.2,
                                maxWidth: 680,
                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                                lineHeight: 1.7,
                            }}
                        >
                            Keep track of your
                            applications, discover
                            new opportunities, and
                            stay ready for your next
                            career move.
                        </Typography>
                    </Box>

                    {/* =================================================
                        FIND JOBS BANNER
                    ================================================= */}

                    <Card
                        elevation={0}
                        sx={{
                            mb: 4.5,
                            borderRadius: 3,
                            backgroundColor:
                                "#293241",
                            color: "white",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 2.8,
                                    sm: 3.5,
                                    md: 4,
                                },
                                "&:last-child": {
                                    pb: {
                                        xs: 2.8,
                                        sm: 3.5,
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
                                            color:
                                                "#F4A261",
                                            fontSize: 12,
                                            fontWeight: 800,
                                            letterSpacing:
                                                "1.5px",
                                            textTransform:
                                                "uppercase",
                                            mb: 1,
                                        }}
                                    >
                                        Your next step
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 22,
                                                sm: 27,
                                            },
                                            fontWeight: 800,
                                            mb: 1,
                                        }}
                                    >
                                        Find an
                                        opportunity
                                        that fits you.
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                "#D8DDE3",
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                            lineHeight: 1.7,
                                            maxWidth: 650,
                                        }}
                                    >
                                        Browse jobs and
                                        internships,
                                        filter by what
                                        you want, and
                                        take the next
                                        step in your
                                        search.
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
                                            "#E76F51",
                                        color: "white",
                                        fontWeight: 700,
                                        textTransform:
                                            "none",
                                        px: 3,
                                        py: 1.3,
                                        borderRadius: 2,
                                        minHeight: 44,
                                        whiteSpace:
                                            "nowrap",
                                        boxShadow:
                                            "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#D85F43",
                                            boxShadow:
                                                "none",
                                        },
                                    }}
                                >
                                    Browse Jobs
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* =================================================
                        ERROR
                    ================================================= */}

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

                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <Box
                        sx={{
                            mb: 5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 19,
                                    sm: 21,
                                },
                                fontWeight: 800,
                                color: "#293241",
                                mb: 0.5,
                            }}
                        >
                            Your Activity
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7A7068",
                                fontSize: 13,
                                mb: 2,
                            }}
                        >
                            A quick look at your
                            activity on CareerBridge.
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
                                                    "1px solid #E9DED0",
                                                backgroundColor:
                                                    "#FFFDF9",
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
                                    iconBackground="#FFF1D6"
                                    iconColor="#E76F51"
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
                                    iconBackground="#EDF4E8"
                                    iconColor="#6A994E"
                                />

                                <SummaryCard
                                    title="CVs"
                                    value={cvCount}
                                    description="Uploaded CVs"
                                    icon={
                                        <Description />
                                    }
                                    iconBackground="#FCE8E2"
                                    iconColor="#D85F43"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <Box sx={{ mb: 5 }}>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 19,
                                    sm: 21,
                                },
                                fontWeight: 800,
                                color: "#293241",
                                mb: 0.5,
                            }}
                        >
                            Quick Actions
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7A7068",
                                fontSize: 13,
                                mb: 2,
                            }}
                        >
                            Get to the things you use
                            most.
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
                            }}
                        >
                            <QuickAction
                                icon={<Work />}
                                title="Find Jobs"
                                description="Browse available jobs and internships."
                                buttonText="Explore Jobs"
                                accent="#E76F51"
                                iconBackground="#FFF1D6"
                                onClick={() =>
                                    navigate(
                                        "/jobs"
                                    )
                                }
                            />

                            <QuickAction
                                icon={
                                    <Description />
                                }
                                title="My Applications"
                                description="Track the progress of your applications."
                                buttonText="View Applications"
                                accent="#6A994E"
                                iconBackground="#EDF4E8"
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
                                accent="#F4A261"
                                iconBackground="#FFF1D6"
                                onClick={() =>
                                    navigate(
                                        "/profile"
                                    )
                                }
                            />
                        </Box>
                    </Box>

                    {/* =================================================
                        CAREER TIP
                    ================================================= */}

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
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
                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius:
                                                    "50%",
                                                backgroundColor:
                                                    "#FFF1D6",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                fontSize: 18,
                                            }}
                                        >
                                            💡
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: 18,
                                                    sm: 20,
                                                },
                                                fontWeight: 800,
                                                color:
                                                    "#293241",
                                            }}
                                        >
                                            Keep your profile
                                            ready
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            color:
                                                "#6F665F",
                                            maxWidth: 700,
                                            fontSize: {
                                                xs: 13,
                                                sm: 14,
                                            },
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        A complete profile
                                        and an up-to-date
                                        CV make it easier
                                        for employers to
                                        understand your
                                        skills and
                                        experience.
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
                                            "#6A994E",
                                        boxShadow:
                                            "none",
                                        whiteSpace:
                                            "nowrap",
                                        "&:hover": {
                                            backgroundColor:
                                                "#58833F",
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

                    {/* SMALL FOOTER SPACE */}

                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#9A9087",
                                fontSize: 12,
                            }}
                        >
                            CareerBridge • Your career,
                            your next step.
                        </Typography>
                    </Box>
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
                justifyContent:
                    "flex-start",
                color: active
                    ? "white"
                    : "#C8CED6",
                backgroundColor: active
                    ? "#E76F51"
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
                        ? "#D85F43"
                        : "rgba(255,255,255,0.08)",
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
    accent,
    iconBackground,
    onClick,
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border:
                    "1px solid #E9DED0",
                backgroundColor:
                    "#FFFDF9",
                height: "100%",
                transition:
                    "all 0.2s ease",
                "&:hover": {
                    borderColor: accent,
                    boxShadow:
                        "0 8px 24px rgba(91,72,56,0.08)",
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
                            iconBackground,
                        color: accent,
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
                        color: "#293241",
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        color: "#6F665F",
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
                            accent,
                        boxShadow:
                            "none",
                        "&:hover": {
                            backgroundColor:
                                accent,
                            filter:
                                "brightness(0.92)",
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