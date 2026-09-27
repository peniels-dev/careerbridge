import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    Button,
    Avatar,
    Chip,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    Logout,
    ArrowBack,
    Description,
    Visibility,
    CalendarToday,
    LocationOn,
    Email,
    Phone,
    School,
    Code,
    Person,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const EmployerApplicantProfile = () => {
    const { jobId, applicationId } = useParams();

    const navigate = useNavigate();

    const { logout } = useAuth();

    const [job, setJob] = useState(null);
    const [applicant, setApplicant] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD APPLICANT
    // =====================================================

    const loadApplicant = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await axiosAPI.get(
                    `/jobs/${jobId}/applicants`
                );

            const jobData =
                response.data?.data?.job;

            const applicants =
                response.data?.data?.applicants ||
                [];

            const selectedApplicant =
                applicants.find(
                    (item) =>
                        Number(
                            item.applicationId
                        ) ===
                        Number(applicationId)
                );

            if (!selectedApplicant) {
                setError(
                    "Applicant could not be found."
                );
                return;
            }

            setJob(jobData);
            setApplicant(
                selectedApplicant
            );
        } catch (err) {
            console.error(
                "Load applicant profile error:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load applicant profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId && applicationId) {
            loadApplicant();
        }
    }, [jobId, applicationId]);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // =====================================================
    // VIEW CV
    // =====================================================

    const handleViewCV = async () => {
        try {
            setError("");

            const response =
                await axiosAPI.get(
                    `/applications/${applicationId}/cv`,
                    {
                        responseType: "blob",
                    }
                );

            const contentType =
                response.headers[
                    "content-type"
                ] || "application/pdf";

            const blob = new Blob(
                [response.data],
                {
                    type: contentType,
                }
            );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            setTimeout(() => {
                window.URL.revokeObjectURL(
                    url
                );
            }, 60000);
        } catch (err) {
            console.error(
                "Open CV error:",
                err.response?.data || err
            );

            setError(
                "Unable to open this CV. Please try again."
            );
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
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

    // =====================================================
    // STATUS COLOR
    // =====================================================

    const getStatusColor = (status) => {
        switch (status) {
            case "Accepted":
                return "success";

            case "Rejected":
                return "error";

            case "Shortlisted":
                return "info";

            case "Reviewed":
                return "warning";

            default:
                return "default";
        }
    };

    // =====================================================
    // SIDEBAR
    // =====================================================

    const menuItems = [
        {
            label: "Dashboard",
            icon: <Dashboard />,
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
            path: `/employer/jobs/${jobId}/applicants`,
        },
        {
            label: "Company Profile",
            icon: <Business />,
            path: "/company-profile",
        },
    ];

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        "#f6f8fb",
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
                        }}
                    >
                        Loading applicant profile...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error && !applicant) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        "#f6f8fb",
                    p: 3,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: 500,
                        width: "100%",
                        p: 4,
                        borderRadius: 3,
                        border:
                            "1px solid #e5e7eb",
                        textAlign: "center",
                    }}
                >
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>

                    <Button
                        variant="contained"
                        onClick={() =>
                            navigate(
                                `/employer/jobs/${jobId}/applicants`
                            )
                        }
                        sx={{
                            textTransform:
                                "none",
                            fontWeight: 700,
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
                        Back to Applicants
                    </Button>
                </Paper>
            </Box>
        );
    }

    const fullName =
        `${applicant?.firstName || ""} ${
            applicant?.lastName || ""
        }`.trim() || "Applicant";

    const initials =
        `${applicant?.firstName?.charAt(0) || ""}${
            applicant?.lastName?.charAt(0) || ""
        }`.toUpperCase();

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
            ===================================================== */}

            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#111827",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
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
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor:
                                "#2563eb",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontWeight: 800,
                            fontSize: 20,
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

                <Box
                    sx={{
                        p: 2,
                        flex: 1,
                    }}
                >
                    {menuItems.map((item) => {
                        const active =
                            item.label ===
                            "Applicants";

                        return (
                            <Button
                                key={item.label}
                                fullWidth
                                startIcon={
                                    item.icon
                                }
                                onClick={() =>
                                    navigate(
                                        item.path
                                    )
                                }
                                sx={{
                                    justifyContent:
                                        "flex-start",
                                    px: 1.5,
                                    py: 1.25,
                                    mb: 0.5,
                                    borderRadius: 2,
                                    color: active
                                        ? "#fff"
                                        : "#9ca3af",
                                    backgroundColor:
                                        active
                                            ? "#2563eb"
                                            : "transparent",
                                    textTransform:
                                        "none",
                                    fontWeight:
                                        active
                                            ? 700
                                            : 500,

                                    "&:hover": {
                                        backgroundColor:
                                            active
                                                ? "#2563eb"
                                                : "#1f2937",
                                        color: "#fff",
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        );
                    })}
                </Box>

                {/* LOGOUT */}

                <Box
                    sx={{
                        p: 2,
                        borderTop:
                            "1px solid #273142",
                    }}
                >
                    <Button
                        fullWidth
                        startIcon={
                            <Logout />
                        }
                        onClick={handleLogout}
                        sx={{
                            justifyContent:
                                "flex-start",
                            px: 1.5,
                            py: 1.25,
                            color: "#9ca3af",
                            textTransform:
                                "none",
                            borderRadius: 2,

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
            ===================================================== */}

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
                        backgroundColor:
                            "#fff",
                        borderBottom:
                            "1px solid #e5e7eb",
                        display: "flex",
                        alignItems:
                            "center",
                        px: {
                            xs: 3,
                            md: 5,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#101828",
                        }}
                    >
                        Applicant Profile
                    </Typography>
                </Box>

                {/* PAGE */}

                <Box
                    sx={{
                        p: {
                            xs: 3,
                            md: 5,
                        },
                        maxWidth: 1100,
                        margin: "0 auto",
                    }}
                >
                    {/* BACK */}

                    <Button
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                `/employer/jobs/${jobId}/applicants`
                            )
                        }
                        sx={{
                            mb: 3,
                            textTransform:
                                "none",
                            color: "#667085",
                            fontWeight: 600,
                        }}
                    >
                        Back to Applicants
                    </Button>

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
                        PROFILE HEADER
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: 3,
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 2.5,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 84,
                                        height: 84,
                                        backgroundColor:
                                            "#2563eb",
                                        fontSize: 28,
                                        fontWeight:
                                            800,
                                    }}
                                >
                                    {initials ||
                                        <Person />}
                                </Avatar>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize:
                                                {
                                                    xs: 25,
                                                    md: 30,
                                                },
                                            fontWeight:
                                                800,
                                            color:
                                                "#101828",
                                        }}
                                    >
                                        {fullName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            color:
                                                "#667085",
                                            fontSize:
                                                14,
                                        }}
                                    >
                                        Applicant for{" "}
                                        <strong>
                                            {job?.JobTitle ||
                                                "this position"}
                                        </strong>
                                    </Typography>

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            gap: 1,
                                            mt: 1.5,
                                            flexWrap:
                                                "wrap",
                                        }}
                                    >
                                        <Chip
                                            size="small"
                                            label={
                                                applicant.status ||
                                                "Submitted"
                                            }
                                            color={getStatusColor(
                                                applicant.status
                                            )}
                                            sx={{
                                                fontWeight:
                                                    700,
                                            }}
                                        />

                                        <Chip
                                            size="small"
                                            icon={
                                                <CalendarToday />
                                            }
                                            label={`Applied ${formatDate(
                                                applicant.appliedOn
                                            )}`}
                                            sx={{
                                                backgroundColor:
                                                    "#f1f5f9",
                                                fontWeight:
                                                    600,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* =================================================
                        CONTACT INFORMATION
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            mb: 3,
                        }}
                    >
                        <SectionTitle
                            icon={<Person />}
                            title="Contact Information"
                            subtitle="Contact details provided by the applicant."
                        />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    {
                                        xs: "1fr",
                                        md: "repeat(2, 1fr)",
                                    },
                                gap: 2,
                                mt: 3,
                            }}
                        >
                            <InfoCard
                                icon={
                                    <Email />
                                }
                                label="Email"
                                value={
                                    applicant.email ||
                                    "Not provided"
                                }
                            />

                            <InfoCard
                                icon={
                                    <Phone />
                                }
                                label="Phone"
                                value={
                                    applicant.phone ||
                                    "Not provided"
                                }
                            />

                            <InfoCard
                                icon={
                                    <LocationOn />
                                }
                                label="Location"
                                value={
                                    applicant.location ||
                                    "Not provided"
                                }
                            />

                            <InfoCard
                                icon={
                                    <CalendarToday />
                                }
                                label="Application Date"
                                value={formatDate(
                                    applicant.appliedOn
                                )}
                            />
                        </Box>
                    </Paper>

                    {/* =================================================
                        PROFESSIONAL PROFILE
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            mb: 3,
                        }}
                    >
                        <SectionTitle
                            icon={<School />}
                            title="Professional Profile"
                            subtitle="Skills and educational background."
                        />

                        <Box
                            sx={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    {
                                        xs: "1fr",
                                        md: "repeat(2, 1fr)",
                                    },
                                gap: 3,
                                mt: 3,
                            }}
                        >
                            <ProfileSection
                                icon={
                                    <Code />
                                }
                                title="Skills"
                                value={
                                    applicant.skills ||
                                    "No skills provided."
                                }
                            />

                            <ProfileSection
                                icon={
                                    <School />
                                }
                                title="Education"
                                value={
                                    applicant.education ||
                                    "No education information provided."
                                }
                            />
                        </Box>
                    </Paper>

                    {/* =================================================
                        CV
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            mb: 3,
                        }}
                    >
                        <SectionTitle
                            icon={
                                <Description />
                            }
                            title="Curriculum Vitae"
                            subtitle="CV submitted with this application."
                        />

                        <Box
                            sx={{
                                mt: 3,
                                p: 3,
                                borderRadius: 2,
                                backgroundColor:
                                    "#f8fafc",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: 2,
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        backgroundColor:
                                            "#eff6ff",
                                        color:
                                            "#2563eb",
                                    }}
                                >
                                    <Description />
                                </Avatar>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight:
                                                800,
                                            color:
                                                "#101828",
                                        }}
                                    >
                                        {applicant.cvTitle ||
                                            "CV"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize:
                                                13,
                                            color:
                                                "#667085",
                                            mt: 0.3,
                                        }}
                                    >
                                        Submitted with
                                        this application
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={
                                    <Visibility />
                                }
                                onClick={
                                    handleViewCV
                                }
                                disabled={
                                    !applicant.cvId
                                }
                                sx={{
                                    minHeight:
                                        44,
                                    px: 2.5,
                                    borderRadius:
                                        2,
                                    textTransform:
                                        "none",
                                    fontWeight:
                                        700,
                                    backgroundColor:
                                        "#2563eb",
                                    boxShadow:
                                        "none",
                                    "&:hover": {
                                        backgroundColor:
                                            "#1d4ed8",
                                        boxShadow:
                                            "none",
                                    },
                                }}
                            >
                                Open CV
                            </Button>
                        </Box>
                    </Paper>

                    {/* =================================================
                        COVER LETTER
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            mb: 3,
                        }}
                    >
                        <SectionTitle
                            icon={
                                <Description />
                            }
                            title="Cover Letter"
                            subtitle="Message submitted by the applicant."
                        />

                        <Box
                            sx={{
                                mt: 3,
                                p: 3,
                                backgroundColor:
                                    "#f8fafc",
                                borderRadius: 2,
                                borderLeft:
                                    "4px solid #2563eb",
                            }}
                        >
                            <Typography
                                sx={{
                                    whiteSpace:
                                        "pre-wrap",
                                    lineHeight:
                                        1.8,
                                    color:
                                        "#475467",
                                    fontSize:
                                        14,
                                }}
                            >
                                {applicant.coverLetter ||
                                    "No cover letter was provided."}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* =================================================
                        JOB INFORMATION
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                        }}
                    >
                        <SectionTitle
                            icon={<Work />}
                            title="Application Details"
                            subtitle="Information about the position this applicant applied for."
                        />

                        <Box
                            sx={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    {
                                        xs: "1fr",
                                        md: "repeat(2, 1fr)",
                                    },
                                gap: 2,
                                mt: 3,
                            }}
                        >
                            <InfoCard
                                icon={
                                    <Work />
                                }
                                label="Position"
                                value={
                                    job?.JobTitle ||
                                    "Not available"
                                }
                            />

                            <InfoCard
                                icon={
                                    <Business />
                                }
                                label="Company"
                                value={
                                    job?.CompanyName ||
                                    "Not available"
                                }
                            />

                            <InfoCard
                                icon={
                                    <LocationOn />
                                }
                                label="Job Location"
                                value={
                                    job?.Location ||
                                    "Not specified"
                                }
                            />

                            <InfoCard
                                icon={
                                    <CalendarToday />
                                }
                                label="Posted"
                                value={formatDate(
                                    job?.PostedDate
                                )}
                            />
                        </Box>
                    </Paper>

                    {/* BOTTOM BACK BUTTON */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "center",
                            mt: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate(
                                    `/employer/jobs/${jobId}/applicants`
                                )
                            }
                            sx={{
                                minHeight: 44,
                                px: 3,
                                borderRadius: 2,
                                textTransform:
                                    "none",
                                fontWeight: 700,
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
                            Back to Applicants
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = ({
    icon,
    title,
    subtitle,
}) => {
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor:
                            "#eff6ff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                    }}
                >
                    {icon}
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#101828",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#667085",
                            mt: 0.2,
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

// =====================================================
// INFO CARD
// =====================================================

const InfoCard = ({
    icon,
    label,
    value,
}) => {
    return (
        <Box
            sx={{
                p: 2.5,
                backgroundColor:
                    "#f8fafc",
                borderRadius: 2,
                display: "flex",
                gap: 1.5,
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    minWidth: 38,
                    borderRadius: 2,
                    backgroundColor:
                        "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        color: "#98a2b3",
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#344054",
                        mt: 0.4,
                        wordBreak:
                            "break-word",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

// =====================================================
// PROFILE SECTION
// =====================================================

const ProfileSection = ({
    icon,
    title,
    value,
}) => {
    return (
        <Box
            sx={{
                p: 3,
                backgroundColor:
                    "#f8fafc",
                borderRadius: 2,
                minHeight: 150,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        color: "#2563eb",
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#101828",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Typography
                sx={{
                    color: "#475467",
                    lineHeight: 1.8,
                    whiteSpace:
                        "pre-wrap",
                    fontSize: 14,
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default EmployerApplicantProfile;