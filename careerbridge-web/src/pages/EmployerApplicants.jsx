import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Typography,
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    Logout,
    Description,
    Visibility,
    CalendarToday,
    LocationOn,
    Email,
    Phone,
    CheckCircle,
    Person,
    KeyboardArrowDown,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const EmployerApplicants = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [applicants, setApplicants] = useState([]);

    const [selectedJobId, setSelectedJobId] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // ---------------------------------------------------------
    // LOAD EMPLOYER JOBS + ALL APPLICANTS
    // ---------------------------------------------------------
    useEffect(() => {
        loadEmployerApplicants();
    }, []);

    const loadEmployerApplicants = async () => {
        try {
            setLoading(true);
            setError("");

            // First get only this employer's jobs
            const jobsResponse = await axiosAPI.get("/jobs/employer");

            const jobsData = jobsResponse.data?.data;

            const employerJobs = jobsData?.jobs || [];

            setJobs(employerJobs);
            setCompany(jobsData?.company || null);

            // Get applicants for every employer job
            const applicantRequests = employerJobs.map(async (job) => {
                try {
                    const response = await axiosAPI.get(
                        `/jobs/${job.JobID}/applicants`
                    );

                    const jobApplicants =
                        response.data?.data?.applicants || [];

                    return jobApplicants.map((applicant) => ({
                        ...applicant,

                        // Keep the job information with every applicant
                        jobId: job.JobID,
                        jobTitle: job.JobTitle,
                        jobLocation: job.Location,
                    }));
                } catch (jobError) {
                    console.error(
                        `Unable to load applicants for job ${job.JobID}:`,
                        jobError
                    );

                    // If one job fails, don't destroy the whole page.
                    return [];
                }
            });

            const applicantResults =
                await Promise.all(applicantRequests);

            const allApplicants = applicantResults.flat();

            setApplicants(allApplicants);
        } catch (err) {
            console.error(
                "Unable to load employer applicants:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load your applicants."
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------
    // FILTER APPLICANTS
    // ---------------------------------------------------------
    const filteredApplicants = useMemo(() => {
        if (selectedJobId === "all") {
            return applicants;
        }

        return applicants.filter(
            (applicant) =>
                String(applicant.jobId) ===
                String(selectedJobId)
        );
    }, [applicants, selectedJobId]);

    // ---------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ---------------------------------------------------------
    // VIEW CV
    // ---------------------------------------------------------
    const handleViewCV = async (applicant) => {
        try {
            setError("");

            const response = await axiosAPI.get(
                `/applications/${applicant.applicationId}/cv`,
                {
                    responseType: "blob",
                }
            );

            const contentType =
                response.headers["content-type"] ||
                "application/pdf";

            const fileBlob = new Blob([response.data], {
                type: contentType,
            });

            const fileURL = URL.createObjectURL(fileBlob);

            const newWindow = window.open(
                fileURL,
                "_blank"
            );

            if (!newWindow) {
                setError(
                    "Your browser blocked the CV window. Please allow pop-ups for CareerBridge."
                );

                URL.revokeObjectURL(fileURL);
                return;
            }

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);
        } catch (err) {
            console.error("View CV error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to open this CV."
            );
        }
    };

    // ---------------------------------------------------------
    // STATUS CHANGE
    // ---------------------------------------------------------
    const handleStatusChange = async (
        applicationId,
        newStatus
    ) => {
        try {
            setError("");

            await axiosAPI.patch(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus,
                }
            );

            setApplicants((previousApplicants) =>
                previousApplicants.map((applicant) =>
                    applicant.applicationId ===
                    applicationId
                        ? {
                              ...applicant,
                              status: newStatus,
                          }
                        : applicant
                )
            );

            setSelectedApplicant((previous) =>
                previous
                    ? {
                          ...previous,
                          status: newStatus,
                      }
                    : previous
            );
        } catch (err) {
            console.error(
                "Unable to update application status:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update application status."
            );
        }
    };

    // ---------------------------------------------------------
    // OPEN APPLICANT DETAILS
    // ---------------------------------------------------------
    const handleOpenApplicant = (applicant) => {
        setSelectedApplicant(applicant);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedApplicant(null);
    };

    // ---------------------------------------------------------
    // VIEW PROFILE
    // ---------------------------------------------------------
    const handleViewProfile = (applicant) => {
        navigate(
            `/employer/jobs/${applicant.jobId}/applicants/${applicant.applicationId}/profile`
        );
    };

    // ---------------------------------------------------------
    // DATE FORMAT
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // STATUS COLOR
    // ---------------------------------------------------------
    const getStatusColor = (status) => {
        switch (status) {
            case "Accepted":
                return {
                    background: "#ecfdf3",
                    color: "#027a48",
                };

            case "Rejected":
                return {
                    background: "#fef3f2",
                    color: "#b42318",
                };

            case "Shortlisted":
                return {
                    background: "#eff8ff",
                    color: "#175cd3",
                };

            case "Reviewed":
                return {
                    background: "#fffaeb",
                    color: "#b54708",
                };

            default:
                return {
                    background: "#f2f4f7",
                    color: "#475467",
                };
        }
    };

    // ---------------------------------------------------------
    // NEXT STATUS OPTIONS
    // ---------------------------------------------------------
    const getStatusOptions = (status) => {
        switch (status) {
            case "Submitted":
                return ["Reviewed"];

            case "Reviewed":
                return ["Shortlisted"];

            case "Shortlisted":
                return ["Accepted", "Rejected"];

            case "Accepted":
            case "Rejected":
                return [];

            default:
                return ["Reviewed"];
        }
    };

    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------
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
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#667085",
                            fontSize: 14,
                        }}
                    >
                        Loading applicants...
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
                                color: "#fff",
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
                <Box
                    sx={{
                        px: 2,
                        mt: 3,
                    }}
                >
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
                        active
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
                <Box
                    sx={{
                        px: 2,
                        pb: 2,
                    }}
                >
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
                                backgroundColor:
                                    "#1f2937",
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
                }}
            >
                {/* HEADER */}
                <Box
                    sx={{
                        height: 72,
                        backgroundColor: "#fff",
                        borderBottom:
                            "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: {
                            xs: 3,
                            md: 5,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#667085",
                        }}
                    >
                        {company?.CompanyName ||
                            "Your Company"}
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
                                backgroundColor:
                                    "#2563eb",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 13,
                            }}
                        >
                            {(
                                (user?.firstName?.charAt(
                                    0
                                ) || "") +
                                (user?.lastName?.charAt(
                                    0
                                ) || "")
                            ).toUpperCase() || "E"}
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                }}
                            >
                                {user?.firstName ||
                                    "Employer"}
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

                {/* PAGE CONTENT */}
                <Box
                    sx={{
                        px: {
                            xs: 3,
                            md: 5,
                        },
                        py: 4,
                        maxWidth: 1400,
                        margin: "0 auto",
                    }}
                >
                    {/* TITLE */}
                    <Box
                        sx={{
                            mb: 3,
                        }}
                    >
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
                            Applicants
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                fontSize: 14,
                                mt: 0.7,
                            }}
                        >
                            View and manage applicants
                            across your job postings.
                        </Typography>
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

                    {/* SUMMARY CARDS */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <SummaryCard
                            title="Total Applicants"
                            value={applicants.length}
                            icon={<People />}
                        />

                        <SummaryCard
                            title="Job Postings"
                            value={jobs.length}
                            icon={<Work />}
                        />

                        <SummaryCard
                            title="Showing"
                            value={
                                filteredApplicants.length
                            }
                            icon={<Visibility />}
                        />
                    </Box>

                    {/* MAIN APPLICANTS CARD */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            backgroundColor: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        {/* CARD HEADER */}
                        <Box
                            sx={{
                                p: {
                                    xs: 2.5,
                                    md: 3,
                                },
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: {
                                    xs: "flex-start",
                                    md: "center",
                                },
                                flexDirection: {
                                    xs: "column",
                                    md: "row",
                                },
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: "#101828",
                                    }}
                                >
                                    Applicant List
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#98a2b3",
                                        mt: 0.5,
                                    }}
                                >
                                    {filteredApplicants.length}{" "}
                                    applicant
                                    {filteredApplicants.length ===
                                    1
                                        ? ""
                                        : "s"}{" "}
                                    found
                                </Typography>
                            </Box>

                            {/* JOB FILTER */}
                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        sm: 280,
                                    },
                                }}
                            >
                                <Select
                                    value={
                                        selectedJobId
                                    }
                                    onChange={(event) =>
                                        setSelectedJobId(
                                            event.target
                                                .value
                                        )
                                    }
                                    displayEmpty
                                    IconComponent={
                                        KeyboardArrowDown
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: 13,
                                        backgroundColor:
                                            "#fff",
                                        fontWeight: 600,
                                        "& .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#d0d5dd",
                                            },
                                    }}
                                >
                                    <MenuItem value="all">
                                        All Jobs
                                    </MenuItem>

                                    {jobs.map((job) => (
                                        <MenuItem
                                            key={
                                                job.JobID
                                            }
                                            value={
                                                job.JobID
                                            }
                                        >
                                            {job.JobTitle}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Divider />

                        {/* NO APPLICANTS */}
                        {filteredApplicants.length ===
                        0 ? (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 9,
                                    px: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius:
                                            "50%",
                                        backgroundColor:
                                            "#eff6ff",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        mx: "auto",
                                        mb: 2,
                                    }}
                                >
                                    <People
                                        sx={{
                                            fontSize: 34,
                                            color: "#2563eb",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: "#101828",
                                    }}
                                >
                                    {jobs.length === 0
                                        ? "No job postings yet"
                                        : selectedJobId ===
                                          "all"
                                        ? "No applicants yet"
                                        : "No applicants for this job"}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#98a2b3",
                                        mt: 0.8,
                                    }}
                                >
                                    {jobs.length === 0
                                        ? "Post a job to start receiving applications."
                                        : "Applicants will appear here when candidates apply."}
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: {
                                        xs: 1.5,
                                        md: 2,
                                    },
                                }}
                            >
                                {filteredApplicants.map(
                                    (applicant) => {
                                        const statusStyle =
                                            getStatusColor(
                                                applicant.status
                                            );

                                        const statusOptions =
                                            getStatusOptions(
                                                applicant.status
                                            );

                                        const fullName =
                                            applicant.fullName ||
                                            [
                                                applicant.firstName,
                                                applicant.lastName,
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(
                                                    " "
                                                ) ||
                                            "Applicant";

                                        const initials =
                                            fullName
                                                .split(
                                                    " "
                                                )
                                                .map(
                                                    (
                                                        part
                                                    ) =>
                                                        part.charAt(
                                                            0
                                                        )
                                                )
                                                .join("")
                                                .slice(
                                                    0,
                                                    2
                                                )
                                                .toUpperCase();

                                        return (
                                            <Paper
                                                key={
                                                    applicant.applicationId
                                                }
                                                elevation={
                                                    0
                                                }
                                                sx={{
                                                    p: {
                                                        xs: 2,
                                                        md: 2.5,
                                                    },
                                                    mb: 1.5,
                                                    border:
                                                        "1px solid #eaecf0",
                                                    borderRadius: 2.5,
                                                    "&:last-child":
                                                        {
                                                            mb: 0,
                                                        },
                                                    "&:hover":
                                                        {
                                                            borderColor:
                                                                "#bfdbfe",
                                                            backgroundColor:
                                                                "#fafcff",
                                                        },
                                                }}
                                            >
                                                {/* APPLICANT HEADER */}
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        gap: 2,
                                                        flexWrap:
                                                            "wrap",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            gap: 1.5,
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                backgroundColor:
                                                                    "#eff6ff",
                                                                color: "#2563eb",
                                                                fontWeight: 800,
                                                                fontSize: 15,
                                                            }}
                                                        >
                                                            {
                                                                initials
                                                            }
                                                        </Avatar>

                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 15,
                                                                    fontWeight: 800,
                                                                    color: "#101828",
                                                                }}
                                                            >
                                                                {
                                                                    fullName
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    color: "#667085",
                                                                    mt: 0.3,
                                                                }}
                                                            >
                                                                Application
                                                                #
                                                                {
                                                                    applicant.applicationId
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Chip
                                                        label={
                                                            applicant.status ||
                                                            "Submitted"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            height: 28,
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            backgroundColor:
                                                                statusStyle.background,
                                                            color: statusStyle.color,
                                                        }}
                                                    />
                                                </Box>

                                                {/* JOB */}
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        backgroundColor:
                                                            "#f8fafc",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Work
                                                        sx={{
                                                            fontSize: 18,
                                                            color: "#2563eb",
                                                        }}
                                                    />

                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 10,
                                                                color: "#98a2b3",
                                                                fontWeight: 700,
                                                                textTransform:
                                                                    "uppercase",
                                                                letterSpacing:
                                                                    0.5,
                                                            }}
                                                        >
                                                            Applied
                                                            for
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 13,
                                                                fontWeight: 700,
                                                                color: "#344054",
                                                            }}
                                                        >
                                                            {
                                                                applicant.jobTitle
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Divider
                                                    sx={{
                                                        my: 2,
                                                    }}
                                                />

                                                {/* CONTACT / INFO */}
                                                <Box
                                                    sx={{
                                                        display:
                                                            "grid",
                                                        gridTemplateColumns:
                                                            {
                                                                xs: "1fr",
                                                                sm: "repeat(2, 1fr)",
                                                                lg: "repeat(4, 1fr)",
                                                            },
                                                        gap: 2,
                                                    }}
                                                >
                                                    <InfoBox
                                                        icon={
                                                            <Email />
                                                        }
                                                        label="Email"
                                                        value={
                                                            applicant.email ||
                                                            "Not provided"
                                                        }
                                                    />

                                                    <InfoBox
                                                        icon={
                                                            <Phone />
                                                        }
                                                        label="Phone"
                                                        value={
                                                            applicant.phone ||
                                                            "Not provided"
                                                        }
                                                    />

                                                    <InfoBox
                                                        icon={
                                                            <LocationOn />
                                                        }
                                                        label="Location"
                                                        value={
                                                            applicant.location ||
                                                            "Not provided"
                                                        }
                                                    />

                                                    <InfoBox
                                                        icon={
                                                            <CalendarToday />
                                                        }
                                                        label="Applied"
                                                        value={formatDate(
                                                            applicant.createdDate ||
                                                                applicant.applicationDate ||
                                                                applicant.CreatedDate
                                                        )}
                                                    />
                                                </Box>

                                                {/* CV */}
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 2,
                                                        flexWrap:
                                                            "wrap",
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        backgroundColor:
                                                            "#f8fafc",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Description
                                                            sx={{
                                                                color: "#2563eb",
                                                                fontSize: 21,
                                                            }}
                                                        />

                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 10,
                                                                    color: "#98a2b3",
                                                                    fontWeight: 700,
                                                                    textTransform:
                                                                        "uppercase",
                                                                }}
                                                            >
                                                                CV
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                    color: "#344054",
                                                                }}
                                                            >
                                                                {applicant.cvTitle ||
                                                                    "CV submitted"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Button
                                                        size="small"
                                                        startIcon={
                                                            <Visibility />
                                                        }
                                                        onClick={() =>
                                                            handleViewCV(
                                                                applicant
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
                                                        Open CV
                                                    </Button>
                                                </Box>

                                                {/* COVER LETTER */}
                                                {applicant.coverLetter && (
                                                    <Box
                                                        sx={{
                                                            mt: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 11,
                                                                fontWeight: 800,
                                                                color: "#475467",
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            Cover
                                                            Letter
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                color: "#667085",
                                                                lineHeight: 1.7,
                                                            }}
                                                        >
                                                            {
                                                                applicant.coverLetter
                                                            }
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* ACTIONS */}
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "center",
                                                        gap: 2,
                                                        flexWrap:
                                                            "wrap",
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        startIcon={
                                                            <Person />
                                                        }
                                                        onClick={() =>
                                                            handleViewProfile(
                                                                applicant
                                                            )
                                                        }
                                                        sx={{
                                                            textTransform:
                                                                "none",
                                                            fontWeight: 700,
                                                            color: "#344054",
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        View Profile
                                                    </Button>

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            gap: 1,
                                                            alignItems:
                                                                "center",
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >
                                                        {statusOptions.length >
                                                        0 ? (
                                                            <FormControl
                                                                size="small"
                                                                sx={{
                                                                    minWidth: 160,
                                                                }}
                                                            >
                                                                <Select
                                                                    value=""
                                                                    displayEmpty
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleStatusChange(
                                                                            applicant.applicationId,
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    renderValue={() => (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: 12,
                                                                                fontWeight: 700,
                                                                                color: "#344054",
                                                                            }}
                                                                        >
                                                                            Update
                                                                            Status
                                                                        </Typography>
                                                                    )}
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    {statusOptions.map(
                                                                        (
                                                                            status
                                                                        ) => (
                                                                            <MenuItem
                                                                                key={
                                                                                    status
                                                                                }
                                                                                value={
                                                                                    status
                                                                                }
                                                                            >
                                                                                {
                                                                                    status
                                                                                }
                                                                            </MenuItem>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        ) : (
                                                            <Chip
                                                                icon={
                                                                    <CheckCircle
                                                                        sx={{
                                                                            fontSize:
                                                                                16,
                                                                        }}
                                                                    />
                                                                }
                                                                label="Final decision"
                                                                size="small"
                                                                sx={{
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                    backgroundColor:
                                                                        "#f2f4f7",
                                                                    color: "#667085",
                                                                }}
                                                            />
                                                        )}

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                handleOpenApplicant(
                                                                    applicant
                                                                )
                                                            }
                                                            sx={{
                                                                textTransform:
                                                                    "none",
                                                                fontWeight: 700,
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            Details
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        );
                                    }
                                )}
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* =====================================================
                APPLICANT DETAILS DIALOG
            ====================================================== */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                {selectedApplicant && (
                    <>
                        <DialogTitle
                            sx={{
                                fontWeight: 800,
                            }}
                        >
                            Applicant Details
                        </DialogTitle>

                        <DialogContent dividers>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 54,
                                        height: 54,
                                        backgroundColor:
                                            "#eff6ff",
                                        color: "#2563eb",
                                        fontWeight: 800,
                                    }}
                                >
                                    {(
                                        selectedApplicant.fullName ||
                                        [
                                            selectedApplicant.firstName,
                                            selectedApplicant.lastName,
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(" ")
                                    )
                                        .split(" ")
                                        .map(
                                            (part) =>
                                                part.charAt(
                                                    0
                                                )
                                        )
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </Avatar>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {selectedApplicant.fullName ||
                                            [
                                                selectedApplicant.firstName,
                                                selectedApplicant.lastName,
                                            ]
                                                .filter(
                                                    Boolean
                                                )
                                                .join(
                                                    " "
                                                ) ||
                                            "Applicant"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "#667085",
                                        }}
                                    >
                                        {
                                            selectedApplicant.jobTitle
                                        }
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: 2,
                                }}
                            >
                                <InfoBox
                                    icon={<Email />}
                                    label="Email"
                                    value={
                                        selectedApplicant.email ||
                                        "Not provided"
                                    }
                                />

                                <InfoBox
                                    icon={<Phone />}
                                    label="Phone"
                                    value={
                                        selectedApplicant.phone ||
                                        "Not provided"
                                    }
                                />

                                <InfoBox
                                    icon={<LocationOn />}
                                    label="Location"
                                    value={
                                        selectedApplicant.location ||
                                        "Not provided"
                                    }
                                />

                                <InfoBox
                                    icon={
                                        <CalendarToday />
                                    }
                                    label="Applied"
                                    value={formatDate(
                                        selectedApplicant.createdDate ||
                                            selectedApplicant.applicationDate ||
                                            selectedApplicant.CreatedDate
                                    )}
                                />
                            </Box>

                            <Divider
                                sx={{
                                    my: 3,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#475467",
                                    mb: 1,
                                }}
                            >
                                Application
                            </Typography>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#f8fafc",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#667085",
                                    }}
                                >
                                    Job
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        mt: 0.3,
                                    }}
                                >
                                    {
                                        selectedApplicant.jobTitle
                                    }
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#667085",
                                        mt: 1.5,
                                    }}
                                >
                                    Status
                                </Typography>

                                <Chip
                                    label={
                                        selectedApplicant.status ||
                                        "Submitted"
                                    }
                                    size="small"
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        backgroundColor:
                                            getStatusColor(
                                                selectedApplicant.status
                                            )
                                                .background,
                                        color: getStatusColor(
                                            selectedApplicant.status
                                        ).color,
                                    }}
                                />
                            </Box>

                            {selectedApplicant.coverLetter && (
                                <>
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 800,
                                            color: "#475467",
                                            mt: 3,
                                            mb: 1,
                                        }}
                                    >
                                        Cover Letter
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#667085",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {
                                            selectedApplicant.coverLetter
                                        }
                                    </Typography>
                                </>
                            )}
                        </DialogContent>

                        <DialogActions
                            sx={{
                                p: 2,
                                gap: 1,
                            }}
                        >
                            <Button
                                onClick={() =>
                                    handleViewCV(
                                        selectedApplicant
                                    )
                                }
                                startIcon={
                                    <Description />
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                }}
                            >
                                Open CV
                            </Button>

                            <Button
                                onClick={() =>
                                    handleViewProfile(
                                        selectedApplicant
                                    )
                                }
                                startIcon={<Person />}
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                }}
                            >
                                View Profile
                            </Button>

                            <Button
                                onClick={
                                    handleCloseDialog
                                }
                                variant="contained"
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    boxShadow: "none",
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

// =============================================================
// SIDEBAR ITEM
// =============================================================
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
                color: active
                    ? "#fff"
                    : "#9ca3af",
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

// =============================================================
// SUMMARY CARD
// =============================================================
const SummaryCard = ({
    title,
    value,
    icon,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                        mt: 1,
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

// =============================================================
// INFO BOX
// =============================================================
const InfoBox = ({
    icon,
    label,
    value,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    color: "#98a2b3",
                    display: "flex",
                    mt: 0.2,
                }}
            >
                {icon}
            </Box>

            <Box
                sx={{
                    minWidth: 0,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 10,
                        color: "#98a2b3",
                        fontWeight: 700,
                        textTransform:
                            "uppercase",
                        letterSpacing: 0.3,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 12,
                        color: "#475467",
                        mt: 0.2,
                        overflow: "hidden",
                        textOverflow:
                            "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default EmployerApplicants;