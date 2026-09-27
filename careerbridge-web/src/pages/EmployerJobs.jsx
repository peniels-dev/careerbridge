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

    /*
     * Open the Job Details page for this specific job.
     */
    const handleOpenJob = (jobId) => {
    navigate(`/employer/jobs/${jobId}`);
};

    /*
     * Open the Applicants page for this specific job.
     */
    const handleViewApplicants = (jobId) => {
        navigate(`/employer/jobs/${jobId}/applicants`);
    };

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
            {/* SIDEBAR */}
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
                }}
            >
                {/* LOGO */}
                <Box
                    sx={{
                        px: 3,
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

                    <Box>
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
                            navigate("/employer/jobs")
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

            {/* MAIN */}
            <Box
                sx={{
                    marginLeft: "250px",
                    width: "calc(100% - 250px)",
                }}
            >
                {/* HEADER */}
                <Box
                    sx={{
                        height: 72,
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: { xs: 3, md: 5 },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#667085",
                        }}
                    >
                        {company?.CompanyName || "Your Company"}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
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
                                (user?.firstName?.charAt(0) || "") +
                                (user?.lastName?.charAt(0) || "")
                            ).toUpperCase() || "E"}
                        </Box>

                        <Box>
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

                {/* PAGE */}
                <Box
                    sx={{
                        px: { xs: 3, md: 5 },
                        py: 4,
                        maxWidth: 1400,
                        margin: "0 auto",
                    }}
                >
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/employer-dashboard")
                        }
                        sx={{
                            textTransform: "none",
                            color: "#667085",
                            mb: 2,
                        }}
                    >
                        Back to dashboard
                    </Button>

                    {/* TITLE */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 4,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 32,
                                    fontWeight: 800,
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
                                Manage the jobs posted by your company.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() =>
                                navigate("/employer/post-job")
                            }
                            sx={{
                                backgroundColor: "#2563eb",
                                textTransform: "none",
                                borderRadius: 2,
                                boxShadow: "none",
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

                    {/* SUMMARY */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <SummaryCard
                            title="Total Jobs"
                            value={jobs.length}
                        />

                        <SummaryCard
                            title="Open Jobs"
                            value={
                                jobs.filter((job) =>
                                    checkOpen(job.Status)
                                ).length
                            }
                        />

                        <SummaryCard
                            title="Closed Jobs"
                            value={
                                jobs.filter(
                                    (job) =>
                                        !checkOpen(job.Status)
                                ).length
                            }
                        />
                    </Box>

                    {/* JOBS */}
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
                                Your company's job opportunities
                            </Typography>
                        </Box>

                        <Divider />

                        {jobs.length === 0 ? (
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
                                        backgroundColor: "#f2f4f7",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
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
                                    No job postings yet
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#98a2b3",
                                        mt: 0.7,
                                    }}
                                >
                                    Create your first job posting
                                    to start receiving applications.
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
                                        mt: 2.5,
                                        backgroundColor: "#2563eb",
                                        textTransform: "none",
                                        borderRadius: 2,
                                        boxShadow: "none",
                                        "&:hover": {
                                            backgroundColor: "#1d4ed8",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Post your first job
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2 }}>
                                {jobs.map((job) => {
                                    const open = checkOpen(
                                        job.Status
                                    );

                                    return (
                                        <Paper
                                            key={job.JobID}
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                mb: 1.5,
                                                border:
                                                    "1px solid #eaecf0",
                                                borderRadius: 2.5,
                                                "&:hover": {
                                                    borderColor:
                                                        "#bfdbfe",
                                                    backgroundColor:
                                                        "#fafcff",
                                                },
                                            }}
                                        >
                                            {/* JOB HEADER */}
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
                                                        display: "flex",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 46,
                                                            height: 46,
                                                            minWidth: 46,
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

                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 15,
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            {job.JobTitle}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                color: "#667085",
                                                                mt: 0.4,
                                                            }}
                                                        >
                                                            {job.JobType ||
                                                                "Job type not specified"}
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: 2,
                                                                mt: 1.3,
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
                                                                    <CalendarToday />
                                                                }
                                                                text={`Posted ${formatDate(
                                                                    job.PostedDate
                                                                )}`}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* STATUS */}
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

                                            <Divider sx={{ my: 2 }} />

                                            {/* BOTTOM SECTION */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    gap: 2,
                                                    flexWrap: "wrap",
                                                }}
                                            >
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
                                                        0) === 1
                                                        ? ""
                                                        : "s"}
                                                </Typography>

                                                {/* ACTION BUTTONS */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                    }}
                                                >
                                                    {/* OPEN BUTTON */}
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
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
                                                            px: 2,
                                                            "&:hover": {
                                                                borderColor:
                                                                    "#2563eb",
                                                                backgroundColor:
                                                                    "#eff6ff",
                                                            },
                                                        }}
                                                    >
                                                        Open
                                                    </Button>

                                                    {/* APPLICANTS BUTTON */}
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

/* SIDEBAR ITEM */
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

/* SUMMARY CARD */
const SummaryCard = ({ title, value }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
            }}
        >
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
                    mt: 1,
                }}
            >
                {value}
            </Typography>
        </Paper>
    );
};

/* INFORMATION ITEM */
const InfoItem = ({ icon, text }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
            }}
        >
            <Box
                sx={{
                    color: "#98a2b3",
                    display: "flex",
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