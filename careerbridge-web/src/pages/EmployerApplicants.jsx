import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    Select,
    MenuItem,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    CheckCircle,
    Person,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const EmployerApplicants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [success, setSuccess] = useState("");
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    // =====================================================
    // LOAD APPLICANTS
    // =====================================================

    const loadApplicants = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get(
                `/jobs/${id}/applicants`
            );

            console.log(
                "Applicants response:",
                response.data
            );

            setJob(
                response.data?.data?.job || null
            );

            setApplicants(
                response.data?.data?.applicants || []
            );
        } catch (err) {
            console.error(
                "Load applicants error:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load applicants."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD JOB DETAILS
    // =====================================================

    const loadJob = async () => {
        try {
            const response = await axiosAPI.get(
                `/jobs/${id}`
            );

            setJob((currentJob) => {
                return (
                    currentJob ||
                    response.data?.data ||
                    response.data?.job ||
                    null
                );
            });
        } catch (err) {
            console.error(
                "Load job error:",
                err.response?.data || err
            );
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        if (id) {
            loadApplicants();
            loadJob();
        }
    }, [id]);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // =====================================================
    // VIEW APPLICANT CV
    // =====================================================

    const handleViewCV = async (applicant) => {
        try {
            setError("");

            if (!applicant.applicationId) {
                setError(
                    "Unable to open this applicant's CV."
                );
                return;
            }

            const response = await axiosAPI.get(
                `/applications/${applicant.applicationId}/cv`,
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
    // UPDATE APPLICATION STATUS
    // =====================================================

    const handleStatusChange = async (
        applicationId,
        newStatus
    ) => {
        try {
            setUpdatingId(applicationId);
            setError("");
            setSuccess("");

            await axiosAPI.patch(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus,
                }
            );

            setApplicants((previous) =>
                previous.map((applicant) =>
                    Number(
                        applicant.applicationId
                    ) === Number(applicationId)
                        ? {
                              ...applicant,
                              status: newStatus,
                          }
                        : applicant
                )
            );

            setSelectedApplicant((current) => {
                if (
                    current &&
                    Number(
                        current.applicationId
                    ) === Number(applicationId)
                ) {
                    return {
                        ...current,
                        status: newStatus,
                    };
                }

                return current;
            });

            setSuccess(
                `Application status changed to "${newStatus}".`
            );

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(
                "Update status error:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update application status."
            );
        } finally {
            setUpdatingId(null);
        }
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
            path: `/employer/jobs/${id}/applicants`,
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
                        Loading applicants...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

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
                            backgroundColor: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
                            item.label === "Applicants";

                        return (
                            <Button
                                key={item.label}
                                fullWidth
                                startIcon={item.icon}
                                onClick={() =>
                                    navigate(item.path)
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
                                    fontWeight: active
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
                        startIcon={<Logout />}
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

            {/* MAIN CONTENT */}

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
                        justifyContent:
                            "space-between",
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
                        Applicants
                    </Typography>

                    <Chip
                        icon={<People />}
                        label={`${applicants.length} ${
                            applicants.length === 1
                                ? "Applicant"
                                : "Applicants"
                        }`}
                        sx={{
                            fontWeight: 700,
                            backgroundColor:
                                "#eff6ff",
                            color: "#2563eb",
                        }}
                    />
                </Box>

                {/* PAGE CONTENT */}

                <Box
                    sx={{
                        p: {
                            xs: 3,
                            md: 5,
                        },
                        maxWidth: 1250,
                        margin: "0 auto",
                    }}
                >
                    {/* BACK */}

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/employer/jobs"
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
                        Back to My Job Postings
                    </Button>

                    {/* ALERTS */}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                            }}
                            onClose={() =>
                                setError("")
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            icon={<CheckCircle />}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* JOB HEADER */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            mb: 4,
                            borderRadius: 3,
                            border:
                                "1px solid #e5e7eb",
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 25,
                                    md: 32,
                                },
                                fontWeight: 800,
                                color: "#101828",
                            }}
                        >
                            {job?.JobTitle ||
                                job?.jobTitle ||
                                "Job Applicants"}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                color: "#667085",
                                fontSize: 14,
                            }}
                        >
                            Review and manage
                            candidates who applied
                            for this position.
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2.5,
                                mt: 3,
                            }}
                        >
                            <InfoItem
                                icon={<LocationOn />}
                                text={
                                    job?.Location ||
                                    job?.location ||
                                    "Location not specified"
                                }
                            />

                            <InfoItem
                                icon={
                                    <CalendarToday />
                                }
                                text={`Posted ${formatDate(
                                    job?.PostedDate ||
                                        job?.postedDate
                                )}`}
                            />

                            <InfoItem
                                icon={<People />}
                                text={`${applicants.length} ${
                                    applicants.length ===
                                    1
                                        ? "applicant"
                                        : "applicants"
                                }`}
                            />
                        </Box>
                    </Paper>

                    {/* EMPTY STATE */}

                    {applicants.length === 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: {
                                    xs: 5,
                                    md: 8,
                                },
                                textAlign: "center",
                                border:
                                    "1px solid #e5e7eb",
                                borderRadius: 3,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    mx: "auto",
                                    mb: 2,
                                    backgroundColor:
                                        "#eff6ff",
                                    color: "#2563eb",
                                }}
                            >
                                <People />
                            </Avatar>

                            <Typography
                                sx={{
                                    fontSize: 21,
                                    fontWeight: 800,
                                    color: "#101828",
                                }}
                            >
                                No applicants yet
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,
                                    mb: 3,
                                    color: "#667085",
                                }}
                            >
                                Applications for this
                                position will appear
                                here once candidates
                                apply.
                            </Typography>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        "/employer/jobs"
                                    )
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    borderRadius: 2,
                                    fontWeight: 700,
                                }}
                            >
                                View My Jobs
                            </Button>
                        </Paper>
                    )}

                    {/* APPLICANTS */}

                    {applicants.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection:
                                    "column",
                                gap: 3,
                            }}
                        >
                            {applicants.map(
                                (applicant) => (
                                    <ApplicantCard
                                        key={
                                            applicant.applicationId
                                        }
                                        applicant={
                                            applicant
                                        }
                                        updatingId={
                                            updatingId
                                        }
                                        handleViewCV={
                                            handleViewCV
                                        }
                                        handleStatusChange={
                                            handleStatusChange
                                        }
                                        getStatusColor={
                                            getStatusColor
                                        }
                                        formatDate={
                                            formatDate
                                        }
                                        onViewDetails={() =>
                                            setSelectedApplicant(
                                                applicant
                                            )
                                        }
                                        onViewProfile={() =>
                                            navigate(
                                                `/employer/jobs/${id}/applicants/${applicant.applicationId}/profile`
                                            )
                                        }
                                    />
                                )
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* APPLICANT DETAILS DIALOG */}

            <Dialog
                open={Boolean(
                    selectedApplicant
                )}
                onClose={() =>
                    setSelectedApplicant(null)
                }
                maxWidth="md"
                fullWidth
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
                                        width: 60,
                                        height: 60,
                                        backgroundColor:
                                            "#2563eb",
                                        fontWeight: 700,
                                    }}
                                >
                                    {selectedApplicant.firstName?.charAt(
                                        0
                                    )}
                                </Avatar>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {
                                            selectedApplicant.firstName
                                        }{" "}
                                        {
                                            selectedApplicant.lastName
                                        }
                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={
                                            selectedApplicant.status ||
                                            "Submitted"
                                        }
                                        color={getStatusColor(
                                            selectedApplicant.status
                                        )}
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    mb: 1.5,
                                }}
                            >
                                Cover Letter
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 2,
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    sx={{
                                        whiteSpace:
                                            "pre-wrap",
                                        lineHeight: 1.7,
                                        color: "#475467",
                                    }}
                                >
                                    {selectedApplicant.coverLetter ||
                                        "No cover letter provided."}
                                </Typography>
                            </Paper>

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    mb: 1.5,
                                }}
                            >
                                Application Information
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        {
                                            xs: "1fr",
                                            sm: "repeat(2, 1fr)",
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
                                    icon={
                                        <LocationOn />
                                    }
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
                                        selectedApplicant.appliedOn
                                    )}
                                />
                            </Box>
                        </DialogContent>

                        <DialogActions
                            sx={{
                                p: 2,
                                gap: 1,
                            }}
                        >
                            {/* VIEW FULL PROFILE */}

                            <Button
                                variant="contained"
                                startIcon={<Person />}
                                onClick={() => {
                                    setSelectedApplicant(
                                        null
                                    );

                                    navigate(
                                        `/employer/jobs/${id}/applicants/${selectedApplicant.applicationId}/profile`
                                    );
                                }}
                                sx={{
                                    minHeight: 44,
                                    px: 2.5,
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
                                View Profile
                            </Button>

                            <Button
                                onClick={() =>
                                    handleViewCV(
                                        selectedApplicant
                                    )
                                }
                                startIcon={
                                    <Visibility />
                                }
                                variant="outlined"
                                disabled={
                                    !selectedApplicant.cvId
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
                                    setSelectedApplicant(
                                        null
                                    )
                                }
                                variant="contained"
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
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

// =====================================================
// APPLICANT CARD
// =====================================================

const ApplicantCard = ({
    applicant,
    updatingId,
    handleViewCV,
    handleStatusChange,
    getStatusColor,
    formatDate,
    onViewDetails,
    onViewProfile,
}) => {
    const statusSelectRef = useRef(null);

    const fullName =
        `${applicant.firstName || ""} ${
            applicant.lastName || ""
        }`.trim();

    const handleSelectChange = (event) => {
        handleStatusChange(
            applicant.applicationId,
            event.target.value
        );
    };

    const handleSelectClose = () => {
        requestAnimationFrame(() => {
            if (
                statusSelectRef.current &&
                document.activeElement
            ) {
                statusSelectRef.current.focus();
            }
        });
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2.5,
                    md: 3,
                },
                border:
                    "1px solid #e5e7eb",
                borderRadius: 3,
                transition: "0.2s ease",
                "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow:
                        "0 8px 24px rgba(15, 23, 42, 0.06)",
                },
            }}
        >
            {/* APPLICANT HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "flex-start",
                    gap: 2,
                    flexWrap: "wrap",
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
                            width: 56,
                            height: 56,
                            backgroundColor:
                                "#2563eb",
                            fontWeight: 700,
                        }}
                    >
                        {applicant.firstName?.charAt(
                            0
                        )}
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 800,
                                color: "#101828",
                            }}
                        >
                            {fullName ||
                                "Applicant"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#667085",
                                mt: 0.3,
                            }}
                        >
                            Application #
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
                    color={getStatusColor(
                        applicant.status
                    )}
                    variant="outlined"
                    sx={{
                        fontWeight: 700,
                    }}
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* CONTACT */}

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
                <ContactItem
                    icon={<Email />}
                    label="Email"
                    value={
                        applicant.email ||
                        "Not provided"
                    }
                />

                <ContactItem
                    icon={<Phone />}
                    label="Phone"
                    value={
                        applicant.phone ||
                        "Not provided"
                    }
                />

                <ContactItem
                    icon={<LocationOn />}
                    label="Location"
                    value={
                        applicant.location ||
                        "Not provided"
                    }
                />
            </Box>

            {/* APPLICATION INFO */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {/* APPLIED */}

                <Box
                    sx={{
                        p: 2,
                        backgroundColor:
                            "#f8fafc",
                        borderRadius: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <CalendarToday
                            fontSize="small"
                            sx={{
                                color: "#2563eb",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            Applied
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#667085",
                        }}
                    >
                        {formatDate(
                            applicant.appliedOn
                        )}
                    </Typography>
                </Box>

                {/* CV */}

                <Box
                    sx={{
                        p: 2,
                        backgroundColor:
                            "#f8fafc",
                        borderRadius: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Description
                            fontSize="small"
                            sx={{
                                color: "#2563eb",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            CV
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#667085",
                            mb: 1.5,
                            wordBreak:
                                "break-word",
                        }}
                    >
                        {applicant.cvTitle ||
                            "CV uploaded"}
                    </Typography>

                    {applicant.cvId ? (
                        <Button
                            size="small"
                            variant="outlined"
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
                            }}
                        >
                            Open CV
                        </Button>
                    ) : (
                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "#d92d20",
                            }}
                        >
                            CV unavailable
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* COVER LETTER */}

            <Box
                sx={{
                    mt: 2,
                    p: 2.5,
                    backgroundColor:
                        "#f8fafc",
                    borderRadius: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 700,
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
                        display:
                            "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient:
                            "vertical",
                        overflow: "hidden",
                    }}
                >
                    {applicant.coverLetter ||
                        "No cover letter provided."}
                </Typography>

                {applicant.coverLetter && (
                    <Button
                        size="small"
                        onClick={
                            onViewDetails
                        }
                        sx={{
                            mt: 1,
                            px: 0,
                            textTransform:
                                "none",
                            fontWeight: 700,
                        }}
                    >
                        View full application
                    </Button>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* ACTIONS */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 800,
                        }}
                    >
                        Application Status
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#667085",
                            mt: 0.4,
                        }}
                    >
                        Update the candidate's
                        current stage.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                    }}
                >
                    {/* VIEW PROFILE BUTTON */}

                    <Button
                        variant="contained"
                        startIcon={<Person />}
                        onClick={onViewProfile}
                        sx={{
                            minHeight: 44,
                            px: 2.5,
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
                        View Profile
                    </Button>

                    {/* STATUS SELECT */}

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 180,
                        }}
                    >
                    <Select
    value={applicant.status || "Submitted"}
    inputRef={statusSelectRef}
    onChange={handleSelectChange}
    onClose={handleSelectClose}
    disabled={
        updatingId === applicant.applicationId ||
        applicant.status === "Accepted" ||
        applicant.status === "Rejected"
    }
>
    {/* CURRENT STATUS */}
    <MenuItem
        value={applicant.status || "Submitted"}
        disabled
    >
        {applicant.status || "Submitted"}
    </MenuItem>

    {/* SUBMITTED → REVIEWED */}
    {(!applicant.status ||
        applicant.status === "Submitted") && (
        <MenuItem value="Reviewed">
            Reviewed
        </MenuItem>
    )}

    {/* REVIEWED → SHORTLISTED */}
    {applicant.status === "Reviewed" && (
        <MenuItem value="Shortlisted">
            Shortlisted
        </MenuItem>
    )}

    {/* SHORTLISTED → ACCEPTED / REJECTED */}
    {applicant.status === "Shortlisted" && (
        <>
            <MenuItem value="Accepted">
                Accepted
            </MenuItem>

            <MenuItem value="Rejected">
                Rejected
            </MenuItem>
        </>
    )}
</Select>
                    </FormControl>

                    {updatingId ===
                        applicant.applicationId && (
                        <CircularProgress
                            size={22}
                        />
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

// =====================================================
// SMALL COMPONENTS
// =====================================================

const InfoItem = ({
    icon,
    text,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                color: "#667085",
            }}
        >
            {icon}

            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 600,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

const ContactItem = ({
    icon,
    label,
    value,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                alignItems:
                    "flex-start",
            }}
        >
            <Box
                sx={{
                    color: "#2563eb",
                    mt: 0.2,
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        color: "#98a2b3",
                        mb: 0.3,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        color: "#344054",
                        fontWeight: 600,
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

const InfoBox = ({
    icon,
    label,
    value,
}) => {
    return (
        <Box
            sx={{
                p: 2,
                backgroundColor:
                    "#f8fafc",
                borderRadius: 2,
                display: "flex",
                gap: 1.5,
            }}
        >
            <Box
                sx={{
                    color: "#2563eb",
                }}
            >
                {icon}
            </Box>

            <Box>
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
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#344054",
                        mt: 0.3,
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default EmployerApplicants;