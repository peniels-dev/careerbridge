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
    const [company, setCompany] = useState(null);

    const [loading, setLoading] = useState(true);
    const [closing, setClosing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [openCloseDialog, setOpenCloseDialog] =
        useState(false);

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get(
                `/jobs/${id}`
            );

            setJob(response.data.data);

            try {
                const companyResponse =
                    await axiosAPI.get(
                        "/companies/me"
                    );

                setCompany(
                    companyResponse.data.data
                );
            } catch (companyError) {
                console.error(
                    "Unable to load company:",
                    companyError
                );
            }
        } catch (err) {
            console.error(
                "Unable to load job:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load this job."
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

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const isOpen =
        job?.Status === true ||
        job?.Status === 1;

    const handleViewApplicants = () => {
        navigate(
            `/employer/jobs/${id}/applicants`
        );
    };

    const handleEditJob = () => {
        navigate(
            `/employer/jobs/${id}/edit`
        );
    };

    const handleCloseJob = async () => {
        try {
            setClosing(true);
            setError("");
            setSuccess("");

            const response =
                await axiosAPI.patch(
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

            {/* MAIN AREA */}
            <Box
                sx={{
                    marginLeft: "250px",
                    width: "calc(100% - 250px)",
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
                        px: { xs: 3, md: 5 },
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
                                (user?.firstName?.charAt(
                                    0
                                ) || "") +
                                (user?.lastName?.charAt(
                                    0
                                ) || "")
                            ).toUpperCase() ||
                                "E"}
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

                {/* CONTENT */}
                <Box
                    sx={{
                        px: {
                            xs: 3,
                            md: 5,
                        },
                        py: 4,
                        maxWidth: 1200,
                        margin: "0 auto",
                    }}
                >
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
                        }}
                    >
                        Back to My Job Postings
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

                    {!job && !error && (
                        <Alert severity="info">
                            Job not found.
                        </Alert>
                    )}

                    {job && (
                        <>
                            {/* JOB HEADER */}
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
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize:
                                                    {
                                                        xs: 26,
                                                        md: 32,
                                                    },
                                                fontWeight:
                                                    800,
                                                color:
                                                    "#101828",
                                            }}
                                        >
                                            {
                                                job.JobTitle
                                            }
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                color:
                                                    "#667085",
                                                fontSize: 14,
                                            }}
                                        >
                                            {company?.CompanyName ||
                                                "Your Company"}
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

                            {/* DESCRIPTION */}
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

                            {/* CATEGORY */}
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

                            {/* MANAGEMENT */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
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
                                            Manage your job
                                            posting and
                                            applicants.
                                        </Typography>
                                    </Box>

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
                                </Box>
                            </Paper>
                        </>
                    )}
                </Box>
            </Box>

            {/* CLOSE JOB CONFIRMATION */}
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
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default EmployerJobDetails;