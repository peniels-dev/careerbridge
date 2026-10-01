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

    // =========================================================
    // LOAD EMPLOYER JOBS + APPLICANTS
    // =========================================================

    useEffect(() => {
        loadEmployerApplicants();
    }, []);

    const loadEmployerApplicants = async () => {
        try {
            setLoading(true);
            setError("");

            const jobsResponse = await axiosAPI.get("/jobs/employer");

            const jobsData = jobsResponse.data?.data;

            const employerJobs = jobsData?.jobs || [];

            setJobs(employerJobs);
            setCompany(jobsData?.company || null);

            const applicantRequests = employerJobs.map(
                async (job) => {
                    try {
                        const response = await axiosAPI.get(
                            `/jobs/${job.JobID}/applicants`
                        );

                        const jobApplicants =
                            response.data?.data?.applicants || [];

                        return jobApplicants.map((applicant) => ({
                            ...applicant,
                            jobId: job.JobID,
                            jobTitle: job.JobTitle,
                            jobLocation: job.Location,
                        }));
                    } catch (jobError) {
                        console.error(
                            `Unable to load applicants for job ${job.JobID}:`,
                            jobError
                        );

                        return [];
                    }
                }
            );

            const applicantResults =
                await Promise.all(applicantRequests);

            const allApplicants =
                applicantResults.flat();

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

    // =========================================================
    // FILTER
    // =========================================================

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

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // =========================================================
    // VIEW CV
    // =========================================================

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

    // =========================================================
    // STATUS CHANGE
    // =========================================================

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

    // =========================================================
    // APPLICANT DETAILS
    // =========================================================

    const handleOpenApplicant = (applicant) => {
        setSelectedApplicant(applicant);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedApplicant(null);
    };

    // =========================================================
    // VIEW PROFILE
    // =========================================================

    const handleViewProfile = (applicant) => {
        navigate(
            `/employer/jobs/${applicant.jobId}/applicants/${applicant.applicationId}/profile`
        );
    };

    // =========================================================
    // DATE
    // =========================================================

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

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusColor = (status) => {
        switch (status) {
            case "Accepted":
                return {
                    background: "#EDF4E8",
                    color: "#477A35",
                };

            case "Rejected":
                return {
                    background: "#FCECEA",
                    color: "#B84A3A",
                };

            case "Shortlisted":
                return {
                    background: "#FFF1D6",
                    color: "#9A6418",
                };

            case "Reviewed":
                return {
                    background: "#FFF4DE",
                    color: "#A66A19",
                };

            default:
                return {
                    background: "#F1ECE7",
                    color: "#6D6258",
                };
        }
    };

    // =========================================================
    // STATUS OPTIONS
    // =========================================================

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

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFF8EF",
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <CircularProgress
                        size={34}
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#7A7068",
                            fontSize: 14,
                        }}
                    >
                        Loading applicants...
                    </Typography>
                </Box>
            </Box>
        );
    }

    const firstName =
        user?.firstName ||
        user?.FirstName ||
        "Employer";

    const lastName =
        user?.lastName ||
        user?.LastName ||
        "";

    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`
            .toUpperCase();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                display: "flex",
            }}
        >
            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Box
                sx={{
                    width: {
                        xs: 0,
                        sm: 78,
                        md: 250,
                    },
                    minHeight: "100vh",
                    backgroundColor: "#293241",
                    color: "#fff",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: {
                        xs: "none",
                        sm: "flex",
                    },
                    flexDirection: "column",
                    zIndex: 10,
                    overflow: "hidden",
                }}
            >
                {/* LOGO */}

                <Box
                    sx={{
                        px: {
                            sm: 2,
                            md: 3,
                        },
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
                            backgroundColor: "#E76F51",
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
                            display: {
                                sm: "none",
                                md: "block",
                            },
                        }}
                    >
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
                                color: "#B7BEC8",
                            }}
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#3A4658",
                        mx: 2,
                    }}
                />

                {/* NAVIGATION */}

                <Box
                    sx={{
                        px: {
                            sm: 1,
                            md: 2,
                        },
                        mt: 3,
                    }}
                >
                    <Typography
                        sx={{
                            display: {
                                sm: "none",
                                md: "block",
                            },
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#8993A1",
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
                            display: {
                                sm: "none",
                                md: "block",
                            },
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#8993A1",
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
                        px: {
                            sm: 1,
                            md: 2,
                        },
                        pb: 2,
                    }}
                >
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: {
                                sm: "center",
                                md: "flex-start",
                            },
                            textTransform: "none",
                            color: "#B7BEC8",
                            borderRadius: 2,
                            px: 1.5,
                            py: 1.2,
                            minWidth: 0,
                            "&:hover": {
                                backgroundColor:
                                    "#3A4658",
                                color: "#fff",
                            },
                            "& .MuiButton-startIcon": {
                                marginRight: {
                                    sm: 0,
                                    md: 1,
                                },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: {
                                    sm: "none",
                                    md: "block",
                                },
                            }}
                        >
                            Logout
                        </Box>
                    </Button>
                </Box>
            </Box>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Box
                sx={{
                    marginLeft: {
                        xs: 0,
                        sm: "78px",
                        md: "250px",
                    },
                    width: {
                        xs: "100%",
                        sm: "calc(100% - 78px)",
                        md: "calc(100% - 250px)",
                    },
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        minHeight: 72,
                        backgroundColor: "#FFFDF9",
                        borderBottom:
                            "1px solid #E9DED0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: {
                            xs: 2.5,
                            sm: 3,
                            md: 5,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#7A7068",
                            fontWeight: 600,
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
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                backgroundColor: "#F4A261",
                                color: "#293241",
                                fontWeight: 800,
                                fontSize: 13,
                            }}
                        >
                            {initials || "E"}
                        </Avatar>

                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#293241",
                                }}
                            >
                                {firstName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#91867D",
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
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 5,
                        },
                        py: {
                            xs: 3,
                            md: 4,
                        },
                        maxWidth: 1400,
                        margin: "0 auto",
                    }}
                >
                    {/* TITLE */}

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 27,
                                    md: 32,
                                },
                                fontWeight: 800,
                                color: "#293241",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Applicants
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7A7068",
                                fontSize: 14,
                                mt: 0.7,
                            }}
                        >
                            Review candidates who have
                            applied to your job postings.
                        </Typography>
                    </Box>

                    {/* ERROR */}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                border:
                                    "1px solid #F0C8C1",
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
                            iconBackground="#FFF1D6"
                            iconColor="#E76F51"
                        />

                        <SummaryCard
                            title="Job Postings"
                            value={jobs.length}
                            icon={<Work />}
                            iconBackground="#EDF4E8"
                            iconColor="#6A994E"
                        />

                        <SummaryCard
                            title="Currently Showing"
                            value={
                                filteredApplicants.length
                            }
                            icon={<Visibility />}
                            iconBackground="#FCEDE7"
                            iconColor="#D65D42"
                        />
                    </Box>

                    {/* APPLICANT LIST */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border:
                                "1px solid #E9DED0",
                            backgroundColor: "#FFFDF9",
                            overflow: "hidden",
                        }}
                    >
                        {/* HEADER */}

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
                                        color: "#293241",
                                    }}
                                >
                                    Applicant List
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#91867D",
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
                                            event.target.value
                                        )
                                    }
                                    IconComponent={
                                        KeyboardArrowDown
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        fontSize: 13,
                                        backgroundColor:
                                            "#FFFDF9",
                                        fontWeight: 600,
                                        color: "#293241",
                                        "& .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#E1D5C8",
                                            },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor:
                                                    "#E76F51",
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

                        <Divider
                            sx={{
                                borderColor:
                                    "#E9DED0",
                            }}
                        />

                        {/* EMPTY STATE */}

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
                                        borderRadius: "50%",
                                        backgroundColor:
                                            "#FFF1D6",
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
                                            color: "#E76F51",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: "#293241",
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
                                        color: "#91867D",
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
                                                elevation={0}
                                                sx={{
                                                    p: {
                                                        xs: 2,
                                                        md: 2.5,
                                                    },
                                                    mb: 1.5,
                                                    border:
                                                        "1px solid #E9DED0",
                                                    borderRadius: 2.5,
                                                    backgroundColor:
                                                        "#FFFDF9",
                                                    "&:last-child":
                                                        {
                                                            mb: 0,
                                                        },
                                                    "&:hover":
                                                        {
                                                            borderColor:
                                                                "#E7B8A9",
                                                            backgroundColor:
                                                                "#FFFAF4",
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
                                                                    "#FFF1D6",
                                                                color: "#C85D42",
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
                                                                    color: "#293241",
                                                                }}
                                                            >
                                                                {
                                                                    fullName
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: 12,
                                                                    color: "#91867D",
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
                                                            "#FFF6E9",
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
                                                            color: "#E76F51",
                                                        }}
                                                    />

                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 10,
                                                                color: "#9A8B7D",
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
                                                                color: "#493F38",
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
                                                        borderColor:
                                                            "#EDE2D7",
                                                    }}
                                                />

                                                {/* CONTACT */}

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
                                                            "#F7F2EC",
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
                                                                color: "#E76F51",
                                                                fontSize: 21,
                                                            }}
                                                        />

                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: 10,
                                                                    color: "#9A8B7D",
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
                                                                    color: "#493F38",
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
                                                            color: "#D65D42",
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
                                                                color: "#6D6258",
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            Cover
                                                            Letter
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize: 12,
                                                                color: "#7A7068",
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
                                                            color: "#493F38",
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
                                                                                color: "#493F38",
                                                                            }}
                                                                        >
                                                                            Update
                                                                            Status
                                                                        </Typography>
                                                                    )}
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        fontSize: 12,
                                                                        backgroundColor:
                                                                            "#FFFDF9",
                                                                        "& .MuiOutlinedInput-notchedOutline":
                                                                            {
                                                                                borderColor:
                                                                                    "#E1D5C8",
                                                                            },
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
                                                                        "#EDF4E8",
                                                                    color: "#477A35",
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
                                                                color: "#493F38",
                                                                borderColor:
                                                                    "#DCCFC2",
                                                                "&:hover":
                                                                    {
                                                                        borderColor:
                                                                            "#E76F51",
                                                                        backgroundColor:
                                                                            "#FFF6E9",
                                                                    },
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

            {/* =================================================
                DETAILS DIALOG
            ================================================= */}

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
                                color: "#293241",
                            }}
                        >
                            Applicant Details
                        </DialogTitle>

                        <DialogContent dividers>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 54,
                                        height: 54,
                                        backgroundColor:
                                            "#FFF1D6",
                                        color: "#C85D42",
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
                                            color: "#293241",
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
                                            color: "#7A7068",
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
                                        {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },
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
                                    borderColor:
                                        "#E9DED0",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#6D6258",
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
                                        "#FFF6E9",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#91867D",
                                    }}
                                >
                                    Job
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        mt: 0.3,
                                        color: "#493F38",
                                    }}
                                >
                                    {
                                        selectedApplicant.jobTitle
                                    }
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#91867D",
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
                                            color: "#6D6258",
                                            mt: 3,
                                            mb: 1,
                                        }}
                                    >
                                        Cover Letter
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#7A7068",
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
                                    color: "#D65D42",
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
                                    color: "#493F38",
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
                                    backgroundColor:
                                        "#E76F51",
                                    "&:hover": {
                                        backgroundColor:
                                            "#D65D42",
                                        boxShadow: "none",
                                    },
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
                justifyContent: {
                    sm: "center",
                    md: "flex-start",
                },
                textTransform: "none",
                color: active
                    ? "#fff"
                    : "#B7BEC8",
                backgroundColor: active
                    ? "#E76F51"
                    : "transparent",
                borderRadius: 2,
                px: 1.5,
                py: 1.15,
                mb: 0.5,
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                minWidth: 0,
                "&:hover": {
                    backgroundColor: active
                        ? "#E76F51"
                        : "#3A4658",
                    color: "#fff",
                },
                "& .MuiButton-startIcon": {
                    marginRight: {
                        sm: 0,
                        md: 1,
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: {
                        sm: "none",
                        md: "block",
                    },
                }}
            >
                {text}
            </Box>
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
    iconBackground,
    iconColor,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #E9DED0",
                backgroundColor: "#FFFDF9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: 12,
                        color: "#7A7068",
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
                        color: "#293241",
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
                    backgroundColor:
                        iconBackground,
                    color: iconColor,
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
                    color: "#A0958C",
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
                        color: "#9A8B7D",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 12,
                        color: "#493F38",
                        mt: 0.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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