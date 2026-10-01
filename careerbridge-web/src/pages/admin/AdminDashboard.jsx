import { useEffect, useState } from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import {
    PeopleAltRounded,
    PersonSearchRounded,
    BusinessRounded,
    WorkRounded,
    DescriptionRounded,
    ArrowForwardRounded,
    TrendingUpRounded,
    RefreshRounded,
} from "@mui/icons-material";

import axiosAPI from "../../api/axiosAPI";
import AdminStatCard from "../../components/admin/AdminStatCard";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/admin/dashboard");

            console.log(
                "Admin dashboard response:",
                response.data
            );

            const dashboardData = response.data.data;

            setStats(dashboardData.stats);

            setRecentUsers(
                dashboardData.recentUsers || []
            );

            setRecentJobs(
                dashboardData.recentJobs || []
            );
        } catch (error) {
            console.error(
                "Admin dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load the admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getFullName = (user) => {
        return [
            user.FirstName,
            user.MiddleName,
            user.LastName,
        ]
            .filter(Boolean)
            .join(" ");
    };

    const getRoleLabel = (role) => {
        if (
            role === "JobSeeker" ||
            role === "Job seeker"
        ) {
            return "Job Seeker";
        }

        return role || "Unknown";
    };

    const getRoleStyle = (role) => {
        if (
            role === "JobSeeker" ||
            role === "Job seeker"
        ) {
            return {
                backgroundColor: "#FFF1D6",
                color: "#A65F00",
            };
        }

        if (role === "Employer") {
            return {
                backgroundColor: "#EDF4E8",
                color: "#477A35",
            };
        }

        if (role === "Admin") {
            return {
                backgroundColor: "#F3E8FF",
                color: "#7E4BA3",
            };
        }

        return {
            backgroundColor: "#F1ECE6",
            color: "#625A53",
        };
    };

    const getPercentage = (value, total) => {
        if (!total || total <= 0) {
            return "0%";
        }

        return `${Math.min(
            (value / total) * 100,
            100
        )}%`;
    };

    const getOtherAccounts = () => {
        return Math.max(
            0,
            (stats?.TotalUsers || 0) -
                (stats?.TotalJobSeekers || 0) -
                (stats?.TotalEmployers || 0)
        );
    };

    const navigateTo = (path) => {
        window.location.href = path;
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFF8EF",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress
                        size={42}
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            color: "#6B625A",
                            fontWeight: 600,
                        }}
                    >
                        Loading admin dashboard...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    backgroundColor: "#FFF8EF",
                    minHeight: "70vh",
                    p: {
                        xs: 2,
                        sm: 3,
                    },
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 2,
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<RefreshRounded />}
                    onClick={fetchDashboard}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        backgroundColor: "#E76F51",
                        "&:hover": {
                            backgroundColor: "#D85F43",
                        },
                    }}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100%",
                backgroundColor: "#FFF8EF",
                color: "#293241",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
            }}
        >
            {/* PAGE HEADER */}
            <Box
                sx={{
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
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: 1.4,
                            color: "#E76F51",
                            mb: 0.7,
                        }}
                    >
                        CAREERBRIDGE ADMIN
                    </Typography>

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: 30,
                                sm: 36,
                            },
                            fontWeight: 900,
                            color: "#293241",
                            letterSpacing: "-1px",
                        }}
                    >
                        Dashboard
                    </Typography>

                    <Typography
                        sx={{
                            color: "#756B63",
                            mt: 0.6,
                            fontSize: 15,
                        }}
                    >
                        Here's an overview of what's
                        happening across CareerBridge.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<RefreshRounded />}
                    onClick={fetchDashboard}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: "#DCCFC2",
                        color: "#514941",
                        backgroundColor: "#FFFDF9",
                        px: 2,
                        "&:hover": {
                            borderColor: "#E76F51",
                            backgroundColor: "#FFF1D6",
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* STATISTICS */}
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
                <AdminStatCard
                    title="Total Users"
                    value={stats?.TotalUsers ?? 0}
                    description="Registered accounts"
                    icon={<PeopleAltRounded />}
                    iconBackground="#E76F51"
                />

                <AdminStatCard
                    title="Job Seekers"
                    value={
                        stats?.TotalJobSeekers ?? 0
                    }
                    description="People looking for opportunities"
                    icon={<PersonSearchRounded />}
                    iconBackground="#F4A261"
                />

                <AdminStatCard
                    title="Employers"
                    value={
                        stats?.TotalEmployers ?? 0
                    }
                    description="Hiring organizations"
                    icon={<BusinessRounded />}
                    iconBackground="#6A994E"
                />

                <AdminStatCard
                    title="Companies"
                    value={
                        stats?.TotalCompanies ?? 0
                    }
                    description="Organizations on CareerBridge"
                    icon={<BusinessRounded />}
                    iconBackground="#8A6A9B"
                />

                <AdminStatCard
                    title="Active Jobs"
                    value={stats?.ActiveJobs ?? 0}
                    description="Currently open positions"
                    icon={<WorkRounded />}
                    iconBackground="#D9822B"
                />

                <AdminStatCard
                    title="Applications"
                    value={
                        stats?.TotalApplications ?? 0
                    }
                    description="Applications submitted"
                    icon={<DescriptionRounded />}
                    iconBackground="#B96868"
                />
            </Box>

            {/* OVERVIEW */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1.05fr 0.95fr",
                    },
                    gap: 2.5,
                    mb: 4,
                }}
            >
                {/* USER OVERVIEW */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
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
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                mb: 3,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: "#293241",
                                        fontSize: 18,
                                    }}
                                >
                                    User Overview
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#756B63",
                                        mt: 0.5,
                                    }}
                                >
                                    Breakdown of registered
                                    users
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "#FFF1D6",
                                    color: "#E76F51",
                                }}
                            >
                                <TrendingUpRounded />
                            </Box>
                        </Box>

                        <Stack spacing={2.5}>
                            {/* JOB SEEKERS */}
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        mb: 0.8,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="#514941"
                                    >
                                        Job Seekers
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={800}
                                        color="#293241"
                                    >
                                        {stats?.TotalJobSeekers ??
                                            0}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#EEE6DD",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: getPercentage(
                                                stats?.TotalJobSeekers ||
                                                    0,
                                                stats?.TotalUsers ||
                                                    0
                                            ),
                                            height: "100%",
                                            backgroundColor:
                                                "#E76F51",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* EMPLOYERS */}
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        mb: 0.8,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="#514941"
                                    >
                                        Employers
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={800}
                                        color="#293241"
                                    >
                                        {stats?.TotalEmployers ??
                                            0}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#EEE6DD",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: getPercentage(
                                                stats?.TotalEmployers ||
                                                    0,
                                                stats?.TotalUsers ||
                                                    0
                                            ),
                                            height: "100%",
                                            backgroundColor:
                                                "#6A994E",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* OTHER ACCOUNTS */}
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        mb: 0.8,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="#514941"
                                    >
                                        Other Accounts
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={800}
                                        color="#293241"
                                    >
                                        {getOtherAccounts()}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#EEE6DD",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: getPercentage(
                                                getOtherAccounts(),
                                                stats?.TotalUsers ||
                                                    0
                                            ),
                                            height: "100%",
                                            backgroundColor:
                                                "#8A6A9B",
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* PLATFORM SUMMARY */}
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
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
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#293241",
                                fontSize: 18,
                            }}
                        >
                            Platform Summary
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#756B63",
                                mt: 0.5,
                                mb: 3,
                            }}
                        >
                            A quick look at CareerBridge
                            activity.
                        </Typography>

                        <Stack spacing={1.5}>
                            {/* ACTIVE JOBS */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#FFF8EF",
                                    border: "1px solid #E9DED0",
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
                                            width: 44,
                                            height: 44,
                                            backgroundColor:
                                                "#FFF1D6",
                                            color: "#E76F51",
                                        }}
                                    >
                                        <WorkRounded />
                                    </Avatar>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            fontWeight={700}
                                            color="#514941"
                                        >
                                            Open Positions
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="#756B63"
                                        >
                                            Currently active
                                            jobs
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: 25,
                                            fontWeight: 900,
                                            color: "#293241",
                                        }}
                                    >
                                        {stats?.ActiveJobs ??
                                            0}
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* APPLICATIONS */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#FFF8EF",
                                    border: "1px solid #E9DED0",
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
                                            width: 44,
                                            height: 44,
                                            backgroundColor:
                                                "#F9E7E7",
                                            color: "#B96868",
                                        }}
                                    >
                                        <DescriptionRounded />
                                    </Avatar>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            fontWeight={700}
                                            color="#514941"
                                        >
                                            Applications
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="#756B63"
                                        >
                                            Applications submitted
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: 25,
                                            fontWeight: 900,
                                            color: "#293241",
                                        }}
                                    >
                                        {stats?.TotalApplications ??
                                            0}
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* COMPANIES */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#FFF8EF",
                                    border: "1px solid #E9DED0",
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
                                            width: 44,
                                            height: 44,
                                            backgroundColor:
                                                "#EDF4E8",
                                            color: "#6A994E",
                                        }}
                                    >
                                        <BusinessRounded />
                                    </Avatar>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            fontWeight={700}
                                            color="#514941"
                                        >
                                            Companies
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="#756B63"
                                        >
                                            Organizations
                                            registered
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: 25,
                                            fontWeight: 900,
                                            color: "#293241",
                                        }}
                                    >
                                        {stats?.TotalCompanies ??
                                            0}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            {/* RECENT USERS */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #E9DED0",
                    backgroundColor: "#FFFDF9",
                    mb: 3,
                    overflow: "hidden",
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 3,
                            },
                            py: 2.5,
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
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: "#293241",
                                    fontSize: 18,
                                }}
                            >
                                Recent Users
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#756B63",
                                    mt: 0.4,
                                }}
                            >
                                The latest accounts created
                                on CareerBridge.
                            </Typography>
                        </Box>

                        <Button
                            endIcon={
                                <ArrowForwardRounded />
                            }
                            onClick={() =>
                                navigateTo(
                                    "/admin/users"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                                flexShrink: 0,
                                color: "#E76F51",
                                "&:hover": {
                                    backgroundColor:
                                        "#FFF1D6",
                                },
                            }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Divider
                        sx={{
                            borderColor: "#E9DED0",
                        }}
                    />

                    {recentUsers.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                textAlign: "center",
                            }}
                        >
                            <Typography color="#756B63">
                                No users found.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer
                            sx={{
                                overflowX: "auto",
                            }}
                        >
                            <Table
                                sx={{
                                    minWidth: 700,
                                }}
                            >
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#FFF8EF",
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            User
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Email
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Role
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Status
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Joined
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {recentUsers.map(
                                        (user) => (
                                            <TableRow
                                                key={
                                                    user.UserID
                                                }
                                                hover
                                                sx={{
                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "#FFF8EF",
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 38,
                                                                height: 38,
                                                                fontSize:
                                                                    "0.85rem",
                                                                fontWeight: 700,
                                                                backgroundColor:
                                                                    "#E76F51",
                                                            }}
                                                        >
                                                            {user.FirstName
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase()}
                                                        </Avatar>

                                                        <Typography
                                                            fontWeight={
                                                                700
                                                            }
                                                            color="#293241"
                                                        >
                                                            {getFullName(
                                                                user
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="#756B63"
                                                    >
                                                        {
                                                            user.Email
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Chip
                                                        label={getRoleLabel(
                                                            user.Role
                                                        )}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            ...getRoleStyle(
                                                                user.Role
                                                            ),
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Chip
                                                        label={
                                                            user.IsActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            backgroundColor:
                                                                user.IsActive
                                                                    ? "#EDF4E8"
                                                                    : "#F9E7E7",
                                                            color:
                                                                user.IsActive
                                                                    ? "#477A35"
                                                                    : "#9B4A4A",
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="#756B63"
                                                    >
                                                        {formatDate(
                                                            user.CreatedOn
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* RECENT JOBS */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #E9DED0",
                    backgroundColor: "#FFFDF9",
                    overflow: "hidden",
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 3,
                            },
                            py: 2.5,
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
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: "#293241",
                                    fontSize: 18,
                                }}
                            >
                                Recent Jobs
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#756B63",
                                    mt: 0.4,
                                }}
                            >
                                The latest job opportunities
                                posted by employers.
                            </Typography>
                        </Box>

                        <Button
                            endIcon={
                                <ArrowForwardRounded />
                            }
                            onClick={() =>
                                navigateTo(
                                    "/admin/jobs"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                                flexShrink: 0,
                                color: "#E76F51",
                                "&:hover": {
                                    backgroundColor:
                                        "#FFF1D6",
                                },
                            }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Divider
                        sx={{
                            borderColor: "#E9DED0",
                        }}
                    />

                    {recentJobs.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                textAlign: "center",
                            }}
                        >
                            <Typography color="#756B63">
                                No jobs found.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer
                            sx={{
                                overflowX: "auto",
                            }}
                        >
                            <Table
                                sx={{
                                    minWidth: 750,
                                }}
                            >
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#FFF8EF",
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Job
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Company
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Location
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Type
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Status
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#625A53",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                            }}
                                        >
                                            Posted
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {recentJobs.map(
                                        (job) => (
                                            <TableRow
                                                key={
                                                    job.JobID
                                                }
                                                hover
                                                sx={{
                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "#FFF8EF",
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={
                                                            700
                                                        }
                                                        color="#293241"
                                                    >
                                                        {
                                                            job.JobTitle
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="#756B63"
                                                    >
                                                        {
                                                            job.CompanyName
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="#756B63"
                                                    >
                                                        {
                                                            job.Location
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="#756B63"
                                                    >
                                                        {
                                                            job.JobType
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Chip
                                                        label={
                                                            job.Status
                                                                ? "Active"
                                                                : "Closed"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            backgroundColor:
                                                                job.Status
                                                                    ? "#EDF4E8"
                                                                    : "#F9E7E7",
                                                            color:
                                                                job.Status
                                                                    ? "#477A35"
                                                                    : "#9B4A4A",
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        borderBottom:
                                                            "1px solid #EFE5DC",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="#756B63"
                                                    >
                                                        {formatDate(
                                                            job.PostedDate
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default AdminDashboard;