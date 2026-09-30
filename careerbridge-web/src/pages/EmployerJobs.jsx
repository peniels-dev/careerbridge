import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    TextField,
    InputAdornment,
    MenuItem,
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    Logout,
    ArrowBack,
    LocationOn,
    CalendarToday,
    SearchOff,
    Search,
    Edit,
    Close,
    Visibility,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const EmployerJobs = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/jobs/employer");

            const data = response.data.data;

            setJobs(data.jobs || []);
            setCompany(data.company || null);
        } catch (err) {
            console.error("Unable to load employer jobs:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load your job postings."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const checkOpen = (status) => {
        return status === true || status === 1;
    };

    const handleOpenJob = (jobId) => {
        navigate(`/employer/jobs/${jobId}`);
    };

    const handleEditJob = (jobId) => {
        navigate(`/employer/jobs/${jobId}/edit`);
    };

    const handleViewApplicants = (jobId) => {
        navigate(`/employer/jobs/${jobId}/applicants`);
    };

    const handleCloseJob = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to close this job posting?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await axiosAPI.patch(`/jobs/${jobId}/close`);

            await loadJobs();
        } catch (err) {
            console.error("Unable to close job:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to close this job."
            );
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const searchText = search.trim().toLowerCase();

        const matchesSearch =
            !searchText ||
            job.JobTitle?.toLowerCase().includes(searchText) ||
            job.Location?.toLowerCase().includes(searchText) ||
            job.JobType?.toLowerCase().includes(searchText) ||
            job.PostedByName?.toLowerCase().includes(searchText);

        const open = checkOpen(job.Status);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "open" && open) ||
            (statusFilter === "closed" && !open);

        return matchesSearch && matchesStatus;
    });

    const totalJobs = jobs.length;

    const openJobs = jobs.filter((job) =>
        checkOpen(job.Status)
    ).length;

    const closedJobs = jobs.filter(
        (job) => !checkOpen(job.Status)
    ).length;

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f6f8fb",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#667085",
                            fontSize: 14,
                        }}
                    >
                        Loading your job postings...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f6f8fb",
                display: "flex",
            }}
        >
            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <Box
                sx={{
                    width: 250,
                    minHeight: "100vh",
                    backgroundColor: "#111827",
                    color: "#fff",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,

                    "@media (max-width: 900px)": {
                        width: 78,
                    },

                    "@media (max-width: 600px)": {
                        display: "none",
                    },
                }}
            >
                {/* LOGO */}

                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            minWidth: 38,
                            borderRadius: 2,
                            backgroundColor: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 18,
                        }}
                    >
                        C
                    </Box>

                    <Box
                        sx={{
                            "@media (max-width: 900px)": {
                                display: "none",
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 18,
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#9ca3af",
                            }}
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#273142",
                        mx: 2,
                    }}
                />

                {/* NAVIGATION */}

                <Box sx={{ px: 2, mt: 3 }}>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: 1,
                            px: 1.5,
                            mb: 1,

                            "@media (max-width: 900px)": {
                                display: "none",
                            },
                        }}
                    >
                        MAIN MENU
                    </Typography>

                    <SidebarItem
                        icon={<Dashboard />}
                        text="Dashboard"
                        onClick={() =>
                            navigate("/employer-dashboard")
                        }
                    />

                    <SidebarItem
                        icon={<Work />}
                        text="My Job Postings"
                        active
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                    />

                    <SidebarItem
                        icon={<Add />}
                        text="Post a Job"
                        onClick={() =>
                            navigate("/employer/post-job")
                        }
                    />

                    <SidebarItem
                        icon={<People />}
                        text="Applicants"
                        onClick={() =>
                            navigate("/employer/applicants")
                        }
                    />

                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: 1,
                            px: 1.5,
                            mt: 4,
                            mb: 1,

                            "@media (max-width: 900px)": {
                                display: "none",
                            },
                        }}
                    >
                        COMPANY
                    </Typography>

                    <SidebarItem
                        icon={<Business />}
                        text="Company Profile"
                        onClick={() =>
                            navigate("/company-profile")
                        }
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* LOGOUT */}

                <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: "flex-start",
                            color: "#9ca3af",
                            textTransform: "none",
                            borderRadius: 2,
                            px: 1.5,
                            py: 1.2,

                            "@media (max-width: 900px)": {
                                minWidth: 0,
                                justifyContent: "center",

                                "& .MuiButton-startIcon": {
                                    margin: 0,
                                },

                                "& .MuiButton-startIcon + *": {
                                    display: "none",
                                },
                            },

                            "&:hover": {
                                backgroundColor: "#1f2937",
                                color: "#fff",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <Box
                sx={{
                    marginLeft: "250px",
                    width: "calc(100% - 250px)",

                    "@media (max-width: 900px)": {
                        marginLeft: "78px",
                        width: "calc(100% - 78px)",
                    },

                    "@media (max-width: 600px)": {
                        marginLeft: 0,
                        width: "100%",
                    },
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        minHeight: 72,
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: { xs: 2, sm: 3, md: 5 },
                        py: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 14,
                                color: "#667085",
                            }}
                        >
                            {company?.CompanyName ||
                                "Your Company"}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 13,
                            }}
                        >
                            {(
                                (user?.firstName?.charAt(0) ||
                                    "") +
                                (user?.lastName?.charAt(0) ||
                                    "")
                            ).toUpperCase() || "E"}
                        </Box>

                        <Box
                            sx={{
                                "@media (max-width: 500px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                }}
                            >
                                {user?.firstName || "Employer"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#98a2b3",
                                }}
                            >
                                Employer
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* =================================================
                    PAGE CONTENT
                ================================================== */}

                <Box
                    sx={{
                        px: { xs: 2, sm: 3, md: 5 },
                        py: { xs: 3, md: 4 },
                        maxWidth: 1400,
                        margin: "0 auto",
                    }}
                >
                    {/* BACK */}

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/employer-dashboard")
                        }
                        sx={{
                            textTransform: "none",
                            color: "#667085",
                            mb: 2,
                            px: 0,

                            "&:hover": {
                                backgroundColor: "transparent",
                                color: "#2563eb",
                            },
                        }}
                    >
                        Back to dashboard
                    </Button>

                    {/* TITLE */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            gap: 2,
                            mb: 4,

                            "@media (max-width: 600px)": {
                                flexDirection: "column",
                            },
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 26,
                                        md: 32,
                                    },
                                    fontWeight: 800,
                                    color: "#101828",
                                }}
                            >
                                My Job Postings
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#667085",
                                    fontSize: 14,
                                    mt: 0.7,
                                }}
                            >
                                Manage the opportunities posted
                                by your company.
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
                                backgroundColor: "#2563eb",
                                textTransform: "none",
                                borderRadius: 2,
                                px: 2.5,
                                py: 1.2,
                                boxShadow: "none",
                                whiteSpace: "nowrap",

                                "&:hover": {
                                    backgroundColor: "#1d4ed8",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Post a Job
                        </Button>
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

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================== */}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(3, 1fr)",
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <SummaryCard
                            title="Total Jobs"
                            value={totalJobs}
                            icon={<Work />}
                        />

                        <SummaryCard
                            title="Open Jobs"
                            value={openJobs}
                            icon={<Visibility />}
                        />

                        <SummaryCard
                            title="Closed Jobs"
                            value={closedJobs}
                            icon={<Close />}
                        />
                    </Box>

                    {/* =================================================
                        SEARCH + FILTER
                    ================================================== */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 180px",
                                },
                                gap: 2,
                            }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by job title, location or poster..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search
                                                sx={{
                                                    color: "#98a2b3",
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                            />

                            <TextField
                                select
                                size="small"
                                label="Status"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <MenuItem value="all">
                                    All Jobs
                                </MenuItem>

                                <MenuItem value="open">
                                    Open Jobs
                                </MenuItem>

                                <MenuItem value="closed">
                                    Closed Jobs
                                </MenuItem>
                            </TextField>
                        </Box>
                    </Paper>

                    {/* =================================================
                        JOB LIST
                    ================================================== */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography
                                sx={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color: "#101828",
                                }}
                            >
                                All Job Postings
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#98a2b3",
                                    mt: 0.5,
                                }}
                            >
                                {filteredJobs.length}{" "}
                                {filteredJobs.length === 1
                                    ? "posting"
                                    : "postings"}{" "}
                                found
                            </Typography>
                        </Box>

                        <Divider />

                        {/* NO RESULTS */}

                        {filteredJobs.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 9,
                                    px: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 65,
                                        height: 65,
                                        borderRadius: "50%",
                                        backgroundColor:
                                            "#f2f4f7",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            "center",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <SearchOff
                                        sx={{
                                            color: "#98a2b3",
                                            fontSize: 30,
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: 17,
                                        fontWeight: 800,
                                    }}
                                >
                                    No job postings found
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#98a2b3",
                                        mt: 0.7,
                                    }}
                                >
                                    Try changing your search or
                                    status filter.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                                {filteredJobs.map((job) => {
                                    const open = checkOpen(
                                        job.Status
                                    );

                                    const canManage =
                                        job.canManage === true;

                                    return (
                                        <Paper
                                            key={job.JobID}
                                            elevation={0}
                                            sx={{
                                                p: {
                                                    xs: 2,
                                                    md: 2.5,
                                                },
                                                mb: 1.5,
                                                border:
                                                    "1px solid #eaecf0",
                                                borderRadius: 2.5,
                                                transition:
                                                    "all 0.2s ease",

                                                "&:hover": {
                                                    borderColor:
                                                        "#bfdbfe",
                                                    boxShadow:
                                                        "0 4px 14px rgba(16,24,40,0.05)",
                                                },

                                                "&:last-child": {
                                                    mb: 0,
                                                },
                                            }}
                                        >
                                            {/* JOB TOP */}

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        gap: 2,
                                                        minWidth: 0,
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
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <Work />
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 16,
                                                                fontWeight: 800,
                                                                color: "#101828",
                                                                wordBreak:
                                                                    "break-word",
                                                            }}
                                                        >
                                                            {
                                                                job.JobTitle
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                color: "#667085",
                                                                mt: 0.4,
                                                            }}
                                                        >
                                                            {
                                                                job.CompanyName
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                color: "#98a2b3",
                                                                mt: 0.3,
                                                            }}
                                                        >
                                                            Posted by{" "}
                                                            <strong
                                                                style={{
                                                                    color: "#667085",
                                                                }}
                                                            >
                                                                {job.PostedByName ||
                                                                    "Employer"}
                                                            </strong>
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Chip
                                                    label={
                                                        open
                                                            ? "Open"
                                                            : "Closed"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        height: 26,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        flexShrink: 0,
                                                        backgroundColor:
                                                            open
                                                                ? "#ecfdf3"
                                                                : "#f2f4f7",
                                                        color: open
                                                            ? "#027a48"
                                                            : "#667085",
                                                    }}
                                                />
                                            </Box>

                                            {/* JOB INFORMATION */}

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap:
                                                        "wrap",
                                                    gap: {
                                                        xs: 1.5,
                                                        md: 3,
                                                    },
                                                    mt: 2,
                                                    ml: {
                                                        xs: 0,
                                                        md: 64,
                                                    },
                                                }}
                                            >
                                                <InfoItem
                                                    icon={
                                                        <LocationOn />
                                                    }
                                                    text={
                                                        job.Location ||
                                                        "Location not specified"
                                                    }
                                                />

                                                <InfoItem
                                                    icon={
                                                        <Work />
                                                    }
                                                    text={
                                                        job.JobType ||
                                                        "Job type not specified"
                                                    }
                                                />

                                                <InfoItem
                                                    icon={
                                                        <CalendarToday />
                                                    }
                                                    text={`Posted ${formatDate(
                                                        job.PostedDate
                                                    )}`}
                                                />

                                                {job.ApplicationDeadline && (
                                                    <InfoItem
                                                        icon={
                                                            <CalendarToday />
                                                        }
                                                        text={`Deadline ${formatDate(
                                                            job.ApplicationDeadline
                                                        )}`}
                                                    />
                                                )}
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* BOTTOM */}

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "center",
                                                    gap: 2,
                                                    flexWrap:
                                                        "wrap",
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            color: "#667085",
                                                        }}
                                                    >
                                                        <strong>
                                                            {job.applicationCount ||
                                                                0}
                                                        </strong>{" "}
                                                        application
                                                        {(job.applicationCount ||
                                                            0) ===
                                                        1
                                                            ? ""
                                                            : "s"}
                                                    </Typography>

                                                    {!canManage && (
                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                color: "#98a2b3",
                                                                mt: 0.4,
                                                            }}
                                                        >
                                                            Posted by
                                                            another
                                                            employer
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* ACTIONS */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        gap: 1,
                                                        flexWrap:
                                                            "wrap",
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={
                                                            <Visibility />
                                                        }
                                                        onClick={() =>
                                                            handleOpenJob(
                                                                job.JobID
                                                            )
                                                        }
                                                        sx={{
                                                            textTransform:
                                                                "none",
                                                            fontWeight: 700,
                                                            borderRadius: 2,
                                                            color: "#2563eb",
                                                            borderColor:
                                                                "#bfdbfe",

                                                            "&:hover": {
                                                                borderColor:
                                                                    "#2563eb",
                                                                backgroundColor:
                                                                    "#eff6ff",
                                                            },
                                                        }}
                                                    >
                                                        View
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        startIcon={
                                                            <People />
                                                        }
                                                        onClick={() =>
                                                            handleViewApplicants(
                                                                job.JobID
                                                            )
                                                        }
                                                        sx={{
                                                            textTransform:
                                                                "none",
                                                            fontWeight: 700,
                                                            color: "#2563eb",
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        Applicants
                                                    </Button>

                                                    {/* ONLY JOB OWNER CAN EDIT/CLOSE */}

                                                    {canManage && (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                startIcon={
                                                                    <Edit />
                                                                }
                                                                onClick={() =>
                                                                    handleEditJob(
                                                                        job.JobID
                                                                    )
                                                                }
                                                                sx={{
                                                                    textTransform:
                                                                        "none",
                                                                    fontWeight:
                                                                        700,
                                                                    color: "#475467",
                                                                    borderRadius:
                                                                        2,
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>

                                                            {open && (
                                                                <Button
                                                                    size="small"
                                                                    startIcon={
                                                                        <Close />
                                                                    }
                                                                    onClick={() =>
                                                                        handleCloseJob(
                                                                            job.JobID
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        textTransform:
                                                                            "none",
                                                                        fontWeight:
                                                                            700,
                                                                        color: "#d92d20",
                                                                        borderRadius:
                                                                            2,

                                                                        "&:hover":
                                                                            {
                                                                                backgroundColor:
                                                                                    "#fef3f2",
                                                                            },
                                                                    }}
                                                                >
                                                                    Close
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

/* ============================================================
   SIDEBAR ITEM
============================================================ */

const SidebarItem = ({
    icon,
    text,
    active = false,
    onClick,
}) => {
    return (
        <Button
            fullWidth
            startIcon={icon}
            onClick={onClick}
            sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                color: active ? "#fff" : "#9ca3af",
                backgroundColor: active
                    ? "#1d4ed8"
                    : "transparent",
                borderRadius: 2,
                px: 1.5,
                py: 1.15,
                mb: 0.5,
                fontSize: 13,
                fontWeight: active ? 700 : 500,

                "@media (max-width: 900px)": {
                    minWidth: 0,
                    justifyContent: "center",

                    "& .MuiButton-startIcon": {
                        margin: 0,
                    },

                    "& .MuiButton-startIcon + *": {
                        display: "none",
                    },
                },

                "&:hover": {
                    backgroundColor: active
                        ? "#1d4ed8"
                        : "#1f2937",
                    color: "#fff",
                },
            }}
        >
            {text}
        </Button>
    );
};

/* ============================================================
   SUMMARY CARD
============================================================ */

const SummaryCard = ({ title, value, icon }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: 12,
                        color: "#667085",
                        fontWeight: 600,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 28,
                        fontWeight: 800,
                        mt: 0.7,
                        color: "#101828",
                    }}
                >
                    {value}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: 44,
                    height: 44,
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
        </Paper>
    );
};

/* ============================================================
   INFORMATION ITEM
============================================================ */

const InfoItem = ({ icon, text }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
            }}
        >
            <Box
                sx={{
                    color: "#98a2b3",
                    display: "flex",

                    "& svg": {
                        fontSize: 16,
                    },
                }}
            >
                {icon}
            </Box>

            <Typography
                sx={{
                    fontSize: 11,
                    color: "#667085",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default EmployerJobs;

