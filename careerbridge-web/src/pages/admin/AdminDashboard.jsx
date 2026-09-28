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

            const response = await axiosAPI.get(
                "/admin/dashboard"
            );

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

        return new Date(date).toLocaleDateString(
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

    const getRoleColor = (role) => {
        if (
            role === "JobSeeker" ||
            role === "Job seeker"
        ) {
            return "primary";
        }

        if (role === "Employer") {
            return "success";
        }

        if (role === "Admin") {
            return "secondary";
        }

        return "default";
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
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <CircularProgress size={42} />

                    <Typography
                        sx={{
                            color: "#64748b",
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
            <Box>
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 3,
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
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* PAGE HEADER */}

            <Box
                sx={{
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        gap: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Dashboard
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                mt: 0.7,
                            }}
                        >
                            Here's an overview of what's
                            happening across CareerBridge.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={
                            <RefreshRounded />
                        }
                        onClick={fetchDashboard}
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                            borderColor: "#dbe2ea",
                            color: "#334155",
                            "&:hover": {
                                borderColor: "#94a3b8",
                                backgroundColor:
                                    "#f8fafc",
                            },
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
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
                    iconBackground="linear-gradient(135deg, #2563eb, #4f46e5)"
                />

                <AdminStatCard
                    title="Job Seekers"
                    value={
                        stats?.TotalJobSeekers ?? 0
                    }
                    description="People looking for opportunities"
                    icon={<PersonSearchRounded />}
                    iconBackground="linear-gradient(135deg, #0891b2, #0e7490)"
                />

                <AdminStatCard
                    title="Employers"
                    value={
                        stats?.TotalEmployers ?? 0
                    }
                    description="Hiring organizations"
                    icon={<BusinessRounded />}
                    iconBackground="linear-gradient(135deg, #059669, #047857)"
                />

                <AdminStatCard
                    title="Companies"
                    value={
                        stats?.TotalCompanies ?? 0
                    }
                    description="Organizations on CareerBridge"
                    icon={<BusinessRounded />}
                    iconBackground="linear-gradient(135deg, #7c3aed, #6d28d9)"
                />

                <AdminStatCard
                    title="Active Jobs"
                    value={stats?.ActiveJobs ?? 0}
                    description="Currently open positions"
                    icon={<WorkRounded />}
                    iconBackground="linear-gradient(135deg, #ea580c, #c2410c)"
                />

                <AdminStatCard
                    title="Applications"
                    value={
                        stats?.TotalApplications ?? 0
                    }
                    description="Applications submitted"
                    icon={<DescriptionRounded />}
                    iconBackground="linear-gradient(135deg, #db2777, #be185d)"
                />
            </Box>

            {/* OVERVIEW CARDS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2.5,
                    mb: 4,
                }}
            >
                {/* USER OVERVIEW */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        height: "100%",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
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
                                    fontWeight={800}
                                    color="#0f172a"
                                >
                                    User Overview
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="#64748b"
                                    sx={{ mt: 0.5 }}
                                >
                                    Breakdown of
                                    registered users
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "#eff6ff",
                                    color: "#2563eb",
                                }}
                            >
                                <TrendingUpRounded />
                            </Box>
                        </Box>

                        <Stack spacing={2.2}>
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
                                        color="#334155"
                                    >
                                        Job Seekers
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="#0f172a"
                                    >
                                        {
                                            stats?.TotalJobSeekers ??
                                            0
                                        }
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#e2e8f0",
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
                                            borderRadius: 10,
                                            background:
                                                "linear-gradient(90deg, #2563eb, #4f46e5)",
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
                                        color="#334155"
                                    >
                                        Employers
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="#0f172a"
                                    >
                                        {
                                            stats?.TotalEmployers ??
                                            0
                                        }
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#e2e8f0",
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
                                            borderRadius: 10,
                                            background:
                                                "linear-gradient(90deg, #059669, #047857)",
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
                                        color="#334155"
                                    >
                                        Other Accounts
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="#0f172a"
                                    >
                                        {getOtherAccounts()}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor:
                                            "#e2e8f0",
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
                                            borderRadius: 10,
                                            background:
                                                "linear-gradient(90deg, #7c3aed, #6d28d9)",
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
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        height: "100%",
                        background:
                            "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            fontWeight={800}
                            color="#0f172a"
                        >
                            Platform Summary
                        </Typography>

                        <Typography
                            variant="body2"
                            color="#64748b"
                            sx={{
                                mt: 0.5,
                                mb: 3,
                            }}
                        >
                            A quick look at CareerBridge
                            activity.
                        </Typography>

                        <Stack spacing={2}>
                            {/* ACTIVE JOBS */}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    backgroundColor:
                                        "#f8fafc",
                                    border: "1px solid #eef2f7",
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
                                            width: 44,
                                            height: 44,
                                            backgroundColor:
                                                "#eff6ff",
                                            color: "#2563eb",
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
                                            color="#334155"
                                        >
                                            Open Positions
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="#64748b"
                                        >
                                            {
                                                stats?.ActiveJobs ??
                                                0
                                            }{" "}
                                            active jobs
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                        color="#0f172a"
                                    >
                                        {
                                            stats?.ActiveJobs ??
                                            0
                                        }
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* APPLICATIONS */}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    backgroundColor:
                                        "#f8fafc",
                                    border: "1px solid #eef2f7",
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
                                            width: 44,
                                            height: 44,
                                            backgroundColor:
                                                "#fdf2f8",
                                            color: "#db2777",
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
                                            color="#334155"
                                        >
                                            Applications
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="#64748b"
                                        >
                                            Total applications
                                            submitted
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                        color="#0f172a"
                                    >
                                        {
                                            stats?.TotalApplications ??
                                            0
                                        }
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* COMPANIES */}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    backgroundColor:
                                        "#f8fafc",
                                    border: "1px solid #eef2f7",
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
                                            width: 44,
                                            height: 44,
                                            backgroundColor:
                                                "#ecfdf5",
                                            color: "#059669",
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
                                            color="#334155"
                                        >
                                            Companies
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="#64748b"
                                        >
                                            Organizations
                                            registered
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                        color="#0f172a"
                                    >
                                        {
                                            stats?.TotalCompanies ??
                                            0
                                        }
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
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    mb: 3,
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Box
                        sx={{
                            px: 3,
                            py: 2.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography
                                fontWeight={800}
                                color="#0f172a"
                            >
                                Recent Users
                            </Typography>

                            <Typography
                                variant="body2"
                                color="#64748b"
                                sx={{ mt: 0.4 }}
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
                                navigateTo("/admin/users")
                            }
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                                flexShrink: 0,
                            }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Divider />

                    {recentUsers.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                textAlign: "center",
                            }}
                        >
                            <Typography color="#64748b">
                                No users found.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#f8fafc",
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            User
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Email
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Role
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Status
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
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
                                            >
                                                <TableCell>
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
                                                                background:
                                                                    "linear-gradient(135deg, #2563eb, #4f46e5)",
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
                                                            color="#1e293b"
                                                        >
                                                            {getFullName(
                                                                user
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="#64748b"
                                                    >
                                                        {
                                                            user.Email
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={getRoleLabel(
                                                            user.Role
                                                        )}
                                                        color={getRoleColor(
                                                            user.Role
                                                        )}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            user.IsActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            backgroundColor:
                                                                user.IsActive
                                                                    ? "#dcfce7"
                                                                    : "#fee2e2",
                                                            color:
                                                                user.IsActive
                                                                    ? "#166534"
                                                                    : "#991b1b",
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="#64748b"
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
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <Box
                        sx={{
                            px: 3,
                            py: 2.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography
                                fontWeight={800}
                                color="#0f172a"
                            >
                                Recent Jobs
                            </Typography>

                            <Typography
                                variant="body2"
                                color="#64748b"
                                sx={{ mt: 0.4 }}
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
                                navigateTo("/admin/jobs")
                            }
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                                flexShrink: 0,
                            }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Divider />

                    {recentJobs.length === 0 ? (
                        <Box
                            sx={{
                                py: 5,
                                textAlign: "center",
                            }}
                        >
                            <Typography color="#64748b">
                                No jobs found.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                "#f8fafc",
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Job
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Company
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Location
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Type
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                        >
                                            Status
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: "#475569",
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
                                            >
                                                <TableCell>
                                                    <Typography
                                                        fontWeight={
                                                            700
                                                        }
                                                        color="#1e293b"
                                                    >
                                                        {
                                                            job.JobTitle
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="#64748b"
                                                    >
                                                        {
                                                            job.CompanyName
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="#64748b"
                                                    >
                                                        {
                                                            job.Location
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="#64748b"
                                                    >
                                                        {
                                                            job.JobType
                                                        }
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            job.Status
                                                                ? "Active"
                                                                : "Closed"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            backgroundColor:
                                                                job.Status
                                                                    ? "#dcfce7"
                                                                    : "#fee2e2",
                                                            color:
                                                                job.Status
                                                                    ? "#166534"
                                                                    : "#991b1b",
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="#64748b"
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

