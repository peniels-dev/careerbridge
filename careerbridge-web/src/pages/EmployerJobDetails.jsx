import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
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
    LocationOn,
    CalendarToday,
    AccessTime,
    Category,
    Edit,
    Lock,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const EmployerJobDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, logout } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [closing, setClosing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openCloseDialog, setOpenCloseDialog] = useState(false);

    // =====================================================
    // GET LOGGED-IN USER ID
    // =====================================================

    const loggedInUserId =
        user?.UserID ??
        user?.userId ??
        user?.id ??
        null;

    // =====================================================
    // CHECK WHETHER THIS EMPLOYER POSTED THE JOB
    // =====================================================

    const canManageJob =
        job &&
        loggedInUserId !== null &&
        Number(job.PostedByUserID) === Number(loggedInUserId);

    // =====================================================
    // LOAD JOB
    // =====================================================

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axiosAPI.get(`/jobs/${id}`);

            const jobData = response.data?.data;

            if (!jobData) {
                setError("Job information could not be found.");
                return;
            }

            setJob(jobData);

            console.log("EMPLOYER JOB PERMISSION CHECK:", {
                jobID: jobData.JobID,
                jobTitle: jobData.JobTitle,
                postedByUserID: jobData.PostedByUserID,
                postedByName: jobData.PostedByName,
                loggedInUserID: loggedInUserId,
                canManage:
                    Number(jobData.PostedByUserID) ===
                    Number(loggedInUserId),
            });
        } catch (err) {
            console.error("Unable to load job:", err);

            if (err.response?.status === 404) {
                setError("This job could not be found.");
            } else {
                setError(
                    err.response?.data?.message ||
                        "Unable to load this job."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // =====================================================
    // JOB STATUS
    // =====================================================

    const isOpen =
        job?.Status === true ||
        job?.Status === 1;

    // =====================================================
    // VIEW APPLICANTS
    // =====================================================

    const handleViewApplicants = () => {
        if (!canManageJob) {
            return;
        }

        navigate(`/employer/jobs/${id}/applicants`);
    };

    // =====================================================
    // EDIT JOB
    // =====================================================

    const handleEditJob = () => {
        if (!canManageJob) {
            return;
        }

        navigate(`/employer/jobs/${id}/edit`);
    };

    // =====================================================
    // CLOSE JOB
    // =====================================================

    const handleCloseJob = async () => {
        if (!canManageJob) {
            setError(
                "You can only manage jobs that you posted."
            );
            setOpenCloseDialog(false);
            return;
        }

        try {
            setClosing(true);
            setError("");
            setSuccess("");

            const response = await axiosAPI.patch(
                `/jobs/${id}/close`
            );

            setSuccess(
                response.data?.message ||
                    "Job closed successfully!"
            );

            setJob((previousJob) => ({
                ...previousJob,
                Status: false,
            }));

            setOpenCloseDialog(false);
        } catch (err) {
            console.error(
                "Unable to close job:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to close job."
            );

            setOpenCloseDialog(false);
        } finally {
            setClosing(false);
        }
    };

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
                        Loading job details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f6f8fb",
                display: "flex",
            }}
        >
            {/* =================================================
                SIDEBAR
            ================================================= */}

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
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    flexDirection: "column",
                    zIndex: 1000,
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

                {/* MENU */}

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
                            navigate(
                                "/employer-dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Work />}
                        text="My Job Postings"
                        active
                        onClick={() =>
                            navigate(
                                "/employer/jobs"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<Add />}
                        text="Post a Job"
                        onClick={() =>
                            navigate(
                                "/employer/post-job"
                            )
                        }
                    />

                    <SidebarItem
                        icon={<People />}
                        text="Applicants"
                        onClick={() =>
                            navigate(
                                "/employer/jobs"
                            )
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
                            navigate(
                                "/company-profile"
                            )
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
                            justifyContent:
                                "flex-start",
                            color: "#9ca3af",
                            textTransform:
                                "none",
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

            {/* =================================================
                MAIN AREA
            ================================================= */}

            <Box
                sx={{
                    marginLeft: {
                        xs: 0,
                        md: "250px",
                    },
                    width: {
                        xs: "100%",
                        md: "calc(100% - 250px)",
                    },
                }}
            >
                {/* TOP BAR */}

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
                            xs: 2,
                            sm: 3,
                            md: 5,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#667085",
                            fontWeight: 600,
                        }}
                    >
                        {job?.CompanyName ||
                            "Your Company"}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
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
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                fontWeight: 700,
                                fontSize: 13,
                            }}
                        >
                            {(
                                (user?.FirstName ||
                                    user?.firstName ||
                                    "").charAt(
                                    0
                                ) +
                                (user?.LastName ||
                                    user?.lastName ||
                                    "").charAt(
                                    0
                                )
                            ).toUpperCase() || "E"}
                        </Box>

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
                                }}
                            >
                                {user?.FirstName ||
                                    user?.firstName ||
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

                {/* CONTENT */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                            md: 5,
                        },
                        py: {
                            xs: 2.5,
                            sm: 4,
                        },
                        maxWidth: 1200,
                        margin: "0 auto",
                    }}
                >
                    {/* BACK BUTTON */}

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/employer/jobs"
                            )
                        }
                        sx={{
                            textTransform:
                                "none",
                            color: "#667085",
                            mb: 3,
                            fontWeight: 600,
                        }}
                    >
                        Back to My Job Postings
                    </Button>

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

                    {/* SUCCESS */}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* JOB NOT FOUND */}

                    {!job && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                border:
                                    "1px solid #e5e7eb",
                            }}
                        >
                            <Alert severity="info">
                                Job not found.
                            </Alert>
                        </Paper>
                    )}

                    {/* JOB */}

                    {job && (
                        <>
                            {/* =================================================
                                JOB HEADER
                            ================================================= */}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        sm: 3,
                                        md: 4,
                                    },
                                    borderRadius: 3,
                                    border:
                                        "1px solid #e5e7eb",
                                    backgroundColor:
                                        "#fff",
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "flex-start",
                                        gap: 3,
                                        flexWrap:
                                            "wrap",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            minWidth: 0,
                                            flex: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize:
                                                    {
                                                        xs: 25,
                                                        md: 32,
                                                    },
                                                fontWeight:
                                                    800,
                                                color:
                                                    "#101828",
                                                overflowWrap:
                                                    "anywhere",
                                            }}
                                        >
                                            {job.JobTitle}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                color:
                                                    "#667085",
                                                fontSize: 14,
                                            }}
                                        >
                                            {job.CompanyName ||
                                                "Your Company"}
                                        </Typography>

                                        {/* POSTED BY */}

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                color:
                                                    "#98a2b3",
                                                fontSize: 12,
                                            }}
                                        >
                                            Posted by{" "}
                                            <strong>
                                                {job.PostedByName ||
                                                    "Unknown employer"}
                                            </strong>
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={
                                            isOpen
                                                ? "Open"
                                                : "Closed"
                                        }
                                        sx={{
                                            fontWeight:
                                                700,
                                            backgroundColor:
                                                isOpen
                                                    ? "#ecfdf3"
                                                    : "#f2f4f7",
                                            color:
                                                isOpen
                                                    ? "#027a48"
                                                    : "#667085",
                                        }}
                                    />
                                </Box>

                                <Divider
                                    sx={{
                                        my: 3,
                                    }}
                                />

                                <Box
                                    sx={{
                                        display:
                                            "grid",
                                        gridTemplateColumns:
                                            {
                                                xs: "1fr",
                                                sm: "repeat(2, 1fr)",
                                                md: "repeat(4, 1fr)",
                                            },
                                        gap: 2,
                                    }}
                                >
                                    <DetailItem
                                        icon={
                                            <LocationOn />
                                        }
                                        label="Location"
                                        value={
                                            job.Location ||
                                            "Not specified"
                                        }
                                    />

                                    <DetailItem
                                        icon={
                                            <AccessTime />
                                        }
                                        label="Job Type"
                                        value={
                                            job.JobType ||
                                            "Not specified"
                                        }
                                    />

                                    <DetailItem
                                        icon={
                                            <CalendarToday />
                                        }
                                        label="Posted"
                                        value={formatDate(
                                            job.PostedDate
                                        )}
                                    />

                                    <DetailItem
                                        icon={
                                            <CalendarToday />
                                        }
                                        label="Deadline"
                                        value={formatDate(
                                            job.ApplicationDeadline
                                        )}
                                    />
                                </Box>
                            </Paper>

                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        sm: 3,
                                        md: 4,
                                    },
                                    borderRadius: 3,
                                    border:
                                        "1px solid #e5e7eb",
                                    backgroundColor:
                                        "#fff",
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 800,
                                        mb: 2,
                                    }}
                                >
                                    Job Description
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                        color: "#475467",
                                        whiteSpace:
                                            "pre-line",
                                    }}
                                >
                                    {job.Description ||
                                        "No description provided."}
                                </Typography>
                            </Paper>

                            {/* =================================================
                                REQUIREMENTS
                            ================================================= */}

                            {job.Requirements && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: {
                                            xs: 2.5,
                                            sm: 3,
                                            md: 4,
                                        },
                                        borderRadius: 3,
                                        border:
                                            "1px solid #e5e7eb",
                                        backgroundColor:
                                            "#fff",
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: 800,
                                            mb: 2,
                                        }}
                                    >
                                        Requirements
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            lineHeight: 1.8,
                                            color: "#475467",
                                            whiteSpace:
                                                "pre-line",
                                        }}
                                    >
                                        {
                                            job.Requirements
                                        }
                                    </Typography>
                                </Paper>
                            )}

                            {/* =================================================
                                CATEGORY
                            ================================================= */}

                            {job.CategoryName && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border:
                                            "1px solid #e5e7eb",
                                        backgroundColor:
                                            "#fff",
                                        mb: 3,
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
                                        <Category
                                            sx={{
                                                color:
                                                    "#2563eb",
                                            }}
                                        />

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        12,
                                                    color:
                                                        "#667085",
                                                }}
                                            >
                                                Category
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        700,
                                                    mt: 0.3,
                                                }}
                                            >
                                                {
                                                    job.CategoryName
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            )}

                            {/* =================================================
                                MANAGEMENT
                            ================================================= */}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        sm: 3,
                                    },
                                    borderRadius: 3,
                                    border:
                                        "1px solid #e5e7eb",
                                    backgroundColor:
                                        "#fff",
                                }}
                            >
                                <Box
                                    sx={{
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
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize:
                                                    16,
                                                fontWeight:
                                                    800,
                                            }}
                                        >
                                            Job Management
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize:
                                                    13,
                                                color:
                                                    "#667085",
                                                mt: 0.5,
                                            }}
                                        >
                                            {canManageJob
                                                ? "You posted this job and can manage it."
                                                : "This job was posted by another employer in your company."}
                                        </Typography>
                                    </Box>

                                    {/* ONLY THE ORIGINAL POSTER CAN MANAGE */}

                                    {canManageJob ? (
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
                                                variant="outlined"
                                                startIcon={
                                                    <People />
                                                }
                                                onClick={
                                                    handleViewApplicants
                                                }
                                                sx={{
                                                    textTransform:
                                                        "none",
                                                    borderRadius:
                                                        2,
                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                View Applicants
                                            </Button>

                                            <Button
                                                variant="contained"
                                                startIcon={
                                                    <Edit />
                                                }
                                                onClick={
                                                    handleEditJob
                                                }
                                                sx={{
                                                    textTransform:
                                                        "none",
                                                    borderRadius:
                                                        2,
                                                    fontWeight:
                                                        700,
                                                    boxShadow:
                                                        "none",
                                                    "&:hover":
                                                        {
                                                            boxShadow:
                                                                "none",
                                                        },
                                                }}
                                            >
                                                Edit Job
                                            </Button>

                                            {isOpen && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={
                                                        closing ? (
                                                            <CircularProgress
                                                                size={
                                                                    18
                                                                }
                                                                color="inherit"
                                                            />
                                                        ) : (
                                                            <Lock />
                                                        )
                                                    }
                                                    onClick={() =>
                                                        setOpenCloseDialog(
                                                            true
                                                        )
                                                    }
                                                    disabled={
                                                        closing
                                                    }
                                                    sx={{
                                                        textTransform:
                                                            "none",
                                                        borderRadius:
                                                            2,
                                                        fontWeight:
                                                            700,
                                                    }}
                                                >
                                                    {closing
                                                        ? "Closing..."
                                                        : "Close Job"}
                                                </Button>
                                            )}
                                        </Box>
                                    ) : (
                                        <Chip
                                            label="View only"
                                            variant="outlined"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#667085",
                                            }}
                                        />
                                    )}
                                </Box>
                            </Paper>
                        </>
                    )}
                </Box>
            </Box>

            {/* =================================================
                CLOSE JOB DIALOG
            ================================================= */}

            <Dialog
                open={openCloseDialog}
                onClose={() =>
                    !closing &&
                    setOpenCloseDialog(false)
                }
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                    }}
                >
                    Close this job?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "#667085",
                        }}
                    >
                        Are you sure you want to close{" "}
                        <strong>
                            {job?.JobTitle}
                        </strong>
                        ? Applicants will no longer be
                        able to apply for this position.
                    </DialogContentText>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={() =>
                            setOpenCloseDialog(false)
                        }
                        disabled={closing}
                        sx={{
                            textTransform:
                                "none",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={
                            handleCloseJob
                        }
                        disabled={closing}
                        sx={{
                            textTransform:
                                "none",
                            fontWeight: 700,
                        }}
                    >
                        {closing
                            ? "Closing..."
                            : "Yes, Close Job"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// =====================================================
// SIDEBAR ITEM
// =====================================================

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
                justifyContent:
                    "flex-start",
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
                fontWeight: active
                    ? 700
                    : 500,
                "&:hover": {
                    backgroundColor:
                        active
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

// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = ({
    icon,
    label,
    value,
}) => {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor:
                    "#f9fafb",
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 0.8,
                    color: "#2563eb",
                    mb: 0.8,
                }}
            >
                {icon}

                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#667085",
                    }}
                >
                    {label}
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#101828",
                    overflowWrap:
                        "anywhere",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default EmployerJobDetails;