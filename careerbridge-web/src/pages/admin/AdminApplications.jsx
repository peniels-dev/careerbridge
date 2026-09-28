import { useEffect, useState } from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    ArrowBackRounded,
    BusinessRounded,
    CloseRounded,
    DescriptionRounded,
    EmailRounded,
    PersonRounded,
    RefreshRounded,
    VisibilityRounded,
    WorkRounded,
} from "@mui/icons-material";

import axiosAPI from "../../api/axiosAPI";

function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] =
        useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get(
                "/admin/applications"
            );

            console.log(
                "Admin applications response:",
                response.data
            );

            setApplications(response.data.data || []);
        } catch (error) {
            console.error(
                "Admin applications error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const openDetails = (application) => {
        console.log(
            "Application selected:",
            application
        );

        setSelectedApplication(application);
        setDetailsOpen(true);
    };

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedApplication(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Submitted":
                return "info";

            case "Reviewed":
                return "warning";

            case "Shortlisted":
                return "success";

            case "Accepted":
                return "success";

            case "Rejected":
                return "error";

            default:
                return "default";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                        Loading applications...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    return (
        <Box>
            {/* PAGE HEADER */}
            <Box
                sx={{
                    mb: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    gap: 2,
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
                        Applications
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.7,
                            color: "#64748b",
                        }}
                    >
                        Monitor job applications submitted
                        across CareerBridge.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<RefreshRounded />}
                    onClick={fetchApplications}
                    sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: "#dbe2ea",
                        color: "#334155",
                        "&:hover": {
                            borderColor: "#94a3b8",
                            backgroundColor: "#f8fafc",
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* ERROR */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                    }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchApplications}
                        >
                            Retry
                        </Button>
                    }
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
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Box sx={{ p: 2.5 }}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 46,
                                    height: 46,
                                    backgroundColor: "#eff6ff",
                                    color: "#2563eb",
                                }}
                            >
                                <DescriptionRounded />
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 600,
                                    }}
                                >
                                    Total Applications
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        mt: 0.3,
                                        fontWeight: 800,
                                        color: "#0f172a",
                                    }}
                                >
                                    {applications.length}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Card>

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Box sx={{ p: 2.5 }}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 46,
                                    height: 46,
                                    backgroundColor: "#ecfdf5",
                                    color: "#059669",
                                }}
                            >
                                <PersonRounded />
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 600,
                                    }}
                                >
                                    Applicants
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        mt: 0.3,
                                        fontWeight: 800,
                                        color: "#0f172a",
                                    }}
                                >
                                    {
                                        new Set(
                                            applications.map(
                                                (application) =>
                                                    application.ApplicationID
                                            )
                                        ).size
                                    }
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Card>

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Box sx={{ p: 2.5 }}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 46,
                                    height: 46,
                                    backgroundColor: "#f5f3ff",
                                    color: "#7c3aed",
                                }}
                            >
                                <WorkRounded />
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 600,
                                    }}
                                >
                                    Jobs With Applications
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        mt: 0.3,
                                        fontWeight: 800,
                                        color: "#0f172a",
                                    }}
                                >
                                    {
                                        new Set(
                                            applications.map(
                                                (application) =>
                                                    application.JobTitle
                                            )
                                        ).size
                                    }
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Card>
            </Box>

            {/* APPLICATION TABLE */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "#0f172a",
                        }}
                    >
                        All Applications
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 0.5,
                            color: "#64748b",
                        }}
                    >
                        Review applications submitted by
                        job seekers.
                    </Typography>
                </Box>

                <Divider />

                {applications.length === 0 ? (
                    <Box
                        sx={{
                            py: 8,
                            px: 3,
                            textAlign: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                mx: "auto",
                                mb: 2,
                                backgroundColor: "#f1f5f9",
                                color: "#64748b",
                            }}
                        >
                            <DescriptionRounded />
                        </Avatar>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: "#334155",
                            }}
                        >
                            No applications yet
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#64748b",
                            }}
                        >
                            Applications will appear here
                            when job seekers apply for jobs.
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
                                        Applicant
                                    </TableCell>

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
                                        Applied
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
                                        align="right"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {applications.map(
                                    (application) => (
                                        <TableRow
                                            key={
                                                application.ApplicationID
                                            }
                                            hover
                                        >
                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    sx={{
                                                        alignItems:
                                                            "center",
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            fontSize:
                                                                "0.9rem",
                                                            fontWeight: 700,
                                                            background:
                                                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                                                        }}
                                                    >
                                                        {application.ApplicantName
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </Avatar>

                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: "#1e293b",
                                                            }}
                                                        >
                                                            {
                                                                application.ApplicantName
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#64748b",
                                                            }}
                                                        >
                                                            {
                                                                application.ApplicantEmail
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        alignItems:
                                                            "center",
                                                    }}
                                                >
                                                    <WorkRounded
                                                        sx={{
                                                            fontSize: 20,
                                                            color: "#64748b",
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: "#334155",
                                                        }}
                                                    >
                                                        {
                                                            application.JobTitle
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        alignItems:
                                                            "center",
                                                    }}
                                                >
                                                    <BusinessRounded
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#64748b",
                                                        }}
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#64748b",
                                                        }}
                                                    >
                                                        {
                                                            application.CompanyName
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#64748b",
                                                    }}
                                                >
                                                    {formatDate(
                                                        application.ApplicationDate
                                                    )}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        application.Status ||
                                                        "Unknown"
                                                    }
                                                    color={getStatusColor(
                                                        application.Status
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align="right">
                                                <Tooltip title="View application">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            openDetails(
                                                                application
                                                            )
                                                        }
                                                        sx={{
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: 2,
                                                            color: "#2563eb",
                                                            "&:hover":
                                                                {
                                                                    backgroundColor:
                                                                        "#eff6ff",
                                                                },
                                                        }}
                                                    >
                                                        <VisibilityRounded fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>

            {/* APPLICATION DETAILS DIALOG */}
            <Dialog
                open={detailsOpen}
                onClose={closeDetails}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        overflow: "hidden",
                    },
                }}
            >
                {selectedApplication && (
                    <>
                        <DialogTitle
                            sx={{
                                p: 3,
                                background:
                                    "linear-gradient(135deg, #0f172a, #1e3a8a)",
                                color: "#ffffff",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                        }}
                                    >
                                        Application Details
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 0.5,
                                            color: "#cbd5e1",
                                        }}
                                    >
                                        Application #
                                        {
                                            selectedApplication.ApplicationID
                                        }
                                    </Typography>
                                </Box>

                                <IconButton
                                    onClick={closeDetails}
                                    aria-label="Close application details"
                                    sx={{
                                        color: "#ffffff",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255,255,255,0.1)",
                                        },
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 3 }}>
                            {/* APPLICANT */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 800,
                                        letterSpacing: 1,
                                    }}
                                >
                                    Applicant
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        mt: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            fontSize: "1.2rem",
                                            fontWeight: 800,
                                            background:
                                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                                        }}
                                    >
                                        {selectedApplication.ApplicantName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </Avatar>

                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 800,
                                                color: "#0f172a",
                                            }}
                                        >
                                            {
                                                selectedApplication.ApplicantName
                                            }
                                        </Typography>

                                        <Stack
                                            direction="row"
                                            spacing={0.8}
                                            sx={{
                                                alignItems:
                                                    "center",
                                                mt: 0.3,
                                            }}
                                        >
                                            <EmailRounded
                                                sx={{
                                                    fontSize: 17,
                                                    color: "#64748b",
                                                }}
                                            />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#64748b",
                                                }}
                                            >
                                                {
                                                    selectedApplication.ApplicantEmail
                                                }
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* JOB */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 800,
                                        letterSpacing: 1,
                                    }}
                                >
                                    Position
                                </Typography>

                                <Card
                                    elevation={0}
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        borderRadius: 3,
                                        backgroundColor:
                                            "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            alignItems:
                                                "center",
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

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 800,
                                                    color: "#1e293b",
                                                }}
                                            >
                                                {
                                                    selectedApplication.JobTitle
                                                }
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={0.7}
                                                sx={{
                                                    alignItems:
                                                        "center",
                                                    mt: 0.3,
                                                }}
                                            >
                                                <BusinessRounded
                                                    sx={{
                                                        fontSize: 17,
                                                        color: "#64748b",
                                                    }}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#64748b",
                                                    }}
                                                >
                                                    {
                                                        selectedApplication.CompanyName
                                                    }
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Card>
                            </Box>

                            {/* APPLICATION INFORMATION */}
                            <Box>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 800,
                                        letterSpacing: 1,
                                    }}
                                >
                                    Application Information
                                </Typography>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(2, minmax(0, 1fr))",
                                        gap: 2,
                                        mt: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            backgroundColor:
                                                "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#64748b",
                                            }}
                                        >
                                            Status
                                        </Typography>

                                        <Box sx={{ mt: 1 }}>
                                            <Chip
                                                label={
                                                    selectedApplication.Status ||
                                                    "Unknown"
                                                }
                                                color={getStatusColor(
                                                    selectedApplication.Status
                                                )}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            backgroundColor:
                                                "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#64748b",
                                            }}
                                        >
                                            Applied On
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontWeight: 700,
                                                color: "#1e293b",
                                            }}
                                        >
                                            {formatDate(
                                                selectedApplication.ApplicationDate
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        borderRadius: 3,
                                        backgroundColor:
                                            "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#64748b",
                                        }}
                                    >
                                        Submitted
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontWeight: 700,
                                            color: "#1e293b",
                                        }}
                                    >
                                        {formatDateTime(
                                            selectedApplication.ApplicationDate
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>

                        <DialogActions
                            sx={{
                                p: 2.5,
                                borderTop:
                                    "1px solid #e5e7eb",
                            }}
                        >
                            <Button
                                onClick={closeDetails}
                                startIcon={<ArrowBackRounded />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 2.5,
                                }}
                            >
                                Back to Applications
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}

export default AdminApplications;

