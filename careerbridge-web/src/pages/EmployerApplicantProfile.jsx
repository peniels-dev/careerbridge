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
    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD APPLICANT
    // =====================================================

    const loadApplicant = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get(
                `/jobs/${jobId}/applicants`
            );

            const jobData =
                response.data?.data?.job;

            const applicants =
                response.data?.data?.applicants || [];

            const selectedApplicant =
                applicants.find(
                    (item) =>
                        Number(item.applicationId) ===
                        Number(applicationId)
                );

            if (!selectedApplicant) {
                setError(
                    "Applicant could not be found."
                );
                return;
            }

            setJob(jobData);
            setApplicant(selectedApplicant);
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

            const response = await axiosAPI.get(
                `/applications/${applicationId}/cv`,
                {
                    responseType: "blob",
                }
            );

            const contentType =
                response.headers["content-type"] ||
                "application/pdf";

            const blob = new Blob(
                [response.data],
                {
                    type: contentType,
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
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
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Accepted":
                return {
                    backgroundColor: "#EDF4E8",
                    color: "#477A35",
                };

            case "Rejected":
                return {
                    backgroundColor: "#FBE9E6",
                    color: "#A94B3C",
                };

            case "Shortlisted":
                return {
                    backgroundColor: "#FFF1D6",
                    color: "#A65F00",
                };

            case "Reviewed":
                return {
                    backgroundColor: "#FFF1D6",
                    color: "#A65F00",
                };

            default:
                return {
                    backgroundColor: "#F1ECE7",
                    color: "#6D6258",
                };
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
                    backgroundColor: "#FFF8EF",
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <CircularProgress
                        size={38}
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#7A7068",
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        Loading applicant profile...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // =====================================================
    // ERROR PAGE
    // =====================================================

    if (error && !applicant) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFF8EF",
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
                            "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                        textAlign: "center",
                    }}
                >
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
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
                        startIcon={<ArrowBack />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            backgroundColor: "#E76F51",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor:
                                    "#D95D40",
                                boxShadow: "none",
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

    const statusStyle = getStatusStyle(
        applicant?.status
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                display: "flex",
            }}
        >
            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#293241",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1200,
                    "@media (max-width: 900px)": {
                        width: 78,
                    },
                    "@media (max-width: 650px)": {
                        display: "none",
                    },
                }}
            >
                {/* LOGO */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
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
                            width: 40,
                            height: 40,
                            minWidth: 40,
                            borderRadius: 2,
                            backgroundColor:
                                "#E76F51",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 20,
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
                                color: "#fff",
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#B8C0CC",
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
                                startIcon={item.icon}
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
                                        : "#B8C0CC",
                                    backgroundColor:
                                        active
                                            ? "#E76F51"
                                            : "transparent",
                                    textTransform:
                                        "none",
                                    fontWeight:
                                        active
                                            ? 700
                                            : 500,
                                    minWidth: 0,
                                    "&:hover": {
                                        backgroundColor:
                                            active
                                                ? "#E76F51"
                                                : "#3A4658",
                                        color: "#fff",
                                    },
                                    "& .MuiButton-startIcon":
                                        {
                                            minWidth: 24,
                                            marginRight:
                                                {
                                                    xs: 0,
                                                    md: 8,
                                                },
                                        },
                                    "@media (max-width: 900px)":
                                        {
                                            justifyContent:
                                                "center",
                                            px: 1,
                                        },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        "@media (max-width: 900px)":
                                            {
                                                display:
                                                    "none",
                                            },
                                    }}
                                >
                                    {item.label}
                                </Box>
                            </Button>
                        );
                    })}
                </Box>

                {/* LOGOUT */}

                <Box
                    sx={{
                        p: 2,
                        borderTop:
                            "1px solid #3A4658",
                    }}
                >
                    <Button
                        fullWidth
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent:
                                "flex-start",
                            px: 1.5,
                            py: 1.25,
                            color: "#B8C0CC",
                            textTransform:
                                "none",
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor:
                                    "#3A4658",
                                color: "#fff",
                            },
                            "@media (max-width: 900px)":
                                {
                                    justifyContent:
                                        "center",
                                    px: 1,
                                },
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                "@media (max-width: 900px)":
                                    {
                                        display:
                                            "none",
                                    },
                            }}
                        >
                            Logout
                        </Box>
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
                    "@media (max-width: 900px)": {
                        marginLeft: "78px",
                        width: "calc(100% - 78px)",
                    },
                    "@media (max-width: 650px)": {
                        marginLeft: 0,
                        width: "100%",
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
                        justifyContent:
                            "space-between",
                        px: {
                            xs: 3,
                            md: 5,
                        },
                        py: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 18,
                                    md: 20,
                                },
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            Applicant Profile
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "#7A7068",
                                mt: 0.2,
                            }}
                        >
                            Review applicant information
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor:
                                "#F4A261",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 800,
                        }}
                    >
                        {initials || (
                            <Person />
                        )}
                    </Box>
                </Box>

                {/* PAGE */}

                <Box
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 3,
                            md: 5,
                        },
                        maxWidth: 1150,
                        margin: "0 auto",
                    }}
                >
                    {/* BACK */}

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                `/employer/jobs/${jobId}/applicants`
                            )
                        }
                        sx={{
                            mb: 3,
                            textTransform: "none",
                            color: "#7A7068",
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor:
                                    "#FFF1D6",
                                color: "#293241",
                            },
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
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
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
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 2.5,
                                    minWidth: 0,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: {
                                            xs: 68,
                                            sm: 84,
                                        },
                                        height: {
                                            xs: 68,
                                            sm: 84,
                                        },
                                        backgroundColor:
                                            "#E76F51",
                                        fontSize: {
                                            xs: 23,
                                            sm: 28,
                                        },
                                        fontWeight:
                                            800,
                                        flexShrink: 0,
                                    }}
                                >
                                    {initials ||
                                        <Person />}
                                </Avatar>

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 23,
                                                md: 30,
                                            },
                                            fontWeight: 800,
                                            color: "#293241",
                                            lineHeight: 1.2,
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {fullName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.7,
                                            color: "#7A7068",
                                            fontSize: 14,
                                        }}
                                    >
                                        Applicant for{" "}
                                        <Box
                                            component="strong"
                                            sx={{
                                                color:
                                                    "#293241",
                                            }}
                                        >
                                            {job?.JobTitle ||
                                                "this position"}
                                        </Box>
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
                                            sx={{
                                                ...statusStyle,
                                                fontWeight: 700,
                                                borderRadius:
                                                    1.5,
                                            }}
                                        />

                                        <Chip
                                            size="small"
                                            icon={
                                                <CalendarToday
                                                    sx={{
                                                        fontSize:
                                                            15,
                                                    }}
                                                />
                                            }
                                            label={`Applied ${formatDate(
                                                applicant.appliedOn
                                            )}`}
                                            sx={{
                                                backgroundColor:
                                                    "#FFF1D6",
                                                color:
                                                    "#6D6258",
                                                fontWeight: 600,
                                                borderRadius:
                                                    1.5,
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
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
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
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                                mt: 3,
                            }}
                        >
                            <InfoCard
                                icon={<Email />}
                                label="Email"
                                value={
                                    applicant.email ||
                                    "Not provided"
                                }
                            />

                            <InfoCard
                                icon={<Phone />}
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
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
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
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 3,
                                mt: 3,
                            }}
                        >
                            <ProfileSection
                                icon={<Code />}
                                title="Skills"
                                value={
                                    applicant.skills ||
                                    "No skills provided."
                                }
                            />

                            <ProfileSection
                                icon={<School />}
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
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
                            mb: 3,
                        }}
                    >
                        <SectionTitle
                            icon={<Description />}
                            title="Curriculum Vitae"
                            subtitle="CV submitted with this application."
                        />

                        <Box
                            sx={{
                                mt: 3,
                                p: {
                                    xs: 2,
                                    sm: 3,
                                },
                                borderRadius: 2,
                                backgroundColor:
                                    "#FFF8EF",
                                border:
                                    "1px solid #E9DED0",
                                display: "flex",
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
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 2,
                                    minWidth: 0,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        backgroundColor:
                                            "#FFF1D6",
                                        color:
                                            "#E76F51",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Description />
                                </Avatar>

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            color: "#293241",
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {applicant.cvTitle ||
                                            "CV"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#7A7068",
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
                                    minHeight: 44,
                                    px: 2.5,
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                    backgroundColor:
                                        "#E76F51",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor:
                                            "#D95D40",
                                        boxShadow:
                                            "none",
                                    },
                                    "&.Mui-disabled":
                                        {
                                            backgroundColor:
                                                "#E9DED0",
                                            color:
                                                "#A39A91",
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
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
                            mb: 3,
                        }}
                    >
                        <SectionTitle
                            icon={<Description />}
                            title="Cover Letter"
                            subtitle="Message submitted by the applicant."
                        />

                        <Box
                            sx={{
                                mt: 3,
                                p: 3,
                                backgroundColor:
                                    "#FFF8EF",
                                borderRadius: 2,
                                borderLeft:
                                    "4px solid #E76F51",
                            }}
                        >
                            <Typography
                                sx={{
                                    whiteSpace:
                                        "pre-wrap",
                                    lineHeight: 1.8,
                                    color: "#5F574F",
                                    fontSize: 14,
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
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
                        }}
                    >
                        <SectionTitle
                            icon={<Work />}
                            title="Application Details"
                            subtitle="Information about the position this applicant applied for."
                        />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                                mt: 3,
                            }}
                        >
                            <InfoCard
                                icon={<Work />}
                                label="Position"
                                value={
                                    job?.JobTitle ||
                                    "Not available"
                                }
                            />

                            <InfoCard
                                icon={<Business />}
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
                                    "#293241",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor:
                                        "#3A4658",
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
                        minWidth: 40,
                        borderRadius: 2,
                        backgroundColor:
                            "#FFF1D6",
                        color: "#E76F51",
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
                            color: "#293241",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#7A7068",
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
                backgroundColor: "#FFF8EF",
                border:
                    "1px solid #E9DED0",
                borderRadius: 2,
                display: "flex",
                gap: 1.5,
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    minWidth: 38,
                    borderRadius: 2,
                    backgroundColor:
                        "#FFF1D6",
                    color: "#E76F51",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
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
                        fontSize: 11,
                        color: "#9A9087",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#3F4854",
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
                backgroundColor: "#FFF8EF",
                border:
                    "1px solid #E9DED0",
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
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        backgroundColor:
                            "#FFF1D6",
                        color: "#E76F51",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#293241",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Typography
                sx={{
                    color: "#5F574F",
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