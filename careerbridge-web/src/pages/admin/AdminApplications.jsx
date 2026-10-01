import { useEffect, useMemo, useState } from "react";

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
    IconButton,
    Paper,
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
    ArrowBack,
    Business,
    Close,
    Description,
    Email,
    Person,
    Refresh,
    Visibility,
    Work,
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
        setSelectedApplication(application);
        setDetailsOpen(true);
    };

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedApplication(null);
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

    const getStatusSx = (status) => {
        switch (status) {
            case "Submitted":
                return {
                    color: "#A65F00",
                    backgroundColor: "#FFF1D6",
                };

            case "Reviewed":
                return {
                    color: "#5F554D",
                    backgroundColor: "#F1ECE7",
                };

            case "Shortlisted":
                return {
                    color: "#477A35",
                    backgroundColor: "#EDF4E8",
                };

            case "Accepted":
                return {
                    color: "#477A35",
                    backgroundColor: "#DDEBD6",
                };

            case "Rejected":
                return {
                    color: "#B96868",
                    backgroundColor: "#FBE9E6",
                };

            default:
                return {
                    color: "#5F554D",
                    backgroundColor: "#F1ECE7",
                };
        }
    };

    const totalApplications = applications.length;

    const uniqueApplicants = useMemo(() => {
        const applicants = applications
            .map(
                (application) =>
                    application.JobSeekerID ||
                    application.ApplicantEmail ||
                    application.ApplicantName
            )
            .filter(Boolean);

        return new Set(applicants).size;
    }, [applications]);

    const jobsWithApplications = useMemo(() => {
        const jobs = applications
            .map(
                (application) =>
                    application.JobID ||
                    application.JobTitle
            )
            .filter(Boolean);

        return new Set(jobs).size;
    }, [applications]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFF8EF",
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <CircularProgress
                        size={42}
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            color: "#7A7068",
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
        <Box
            sx={{
                minHeight: "100%",
                backgroundColor: "#FFF8EF",
            }}
        >
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
                            fontWeight: 900,
                            color: "#293241",
                            letterSpacing: "-0.8px",
                        }}
                    >
                        Applications
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.75,
                            color: "#7A7068",
                        }}
                    >
                        Monitor job applications submitted
                        across CareerBridge.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchApplications}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: "#DCCFC2",
                        color: "#5F554D",
                        px: 2.2,
                        backgroundColor: "#FFFDF9",

                        "&:hover": {
                            borderColor: "#E76F51",
                            color: "#E76F51",
                            backgroundColor: "#FFF8EF",
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
                        borderRadius: 2,
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
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFF1D6",
                                color: "#E76F51",
                            }}
                        >
                            <Description />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Total Applications
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color: "#293241",
                                }}
                            >
                                {totalApplications}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#EDF4E8",
                                color: "#6A994E",
                            }}
                        >
                            <Person />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Applicants
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color: "#293241",
                                }}
                            >
                                {uniqueApplicants}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFE5CC",
                                color: "#D9822B",
                            }}
                        >
                            <Work />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Jobs With Applications
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color: "#293241",
                                }}
                            >
                                {jobsWithApplications}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Box>

            {/* APPLICATION TABLE */}

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #E9DED0",
                    overflow: "hidden",
                    backgroundColor: "#FFFDF9",
                }}
            >
                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: "#293241",
                        }}
                    >
                        All Applications
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 0.5,
                            color: "#7A7068",
                        }}
                    >
                        Review applications submitted by job
                        seekers.
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#E9DED0",
                    }}
                />

                {applications.length === 0 ? (
                    <Box
                        sx={{
                            py: 8,
                            px: 3,
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                mx: "auto",
                                mb: 2,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFF1D6",
                                color: "#E76F51",
                            }}
                        >
                            <Description
                                sx={{
                                    fontSize: 30,
                                }}
                            />
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                color: "#293241",
                            }}
                        >
                            No applications yet
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                color: "#7A7068",
                            }}
                        >
                            Applications will appear here when
                            job seekers apply for jobs.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer
                        sx={{
                            overflowX: "auto",
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {[
                                        "Applicant",
                                        "Job",
                                        "Company",
                                        "Applied",
                                        "Status",
                                    ].map((heading) => (
                                        <TableCell
                                            key={heading}
                                            sx={{
                                                fontWeight: 800,
                                                color: "#5F554D",
                                                backgroundColor:
                                                    "#FFF8EF",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {heading}
                                        </TableCell>
                                    ))}

                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#5F554D",
                                            backgroundColor:
                                                "#FFF8EF",
                                            borderBottom:
                                                "1px solid #E9DED0",
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
                                            sx={{
                                                "&:last-child td": {
                                                    borderBottom:
                                                        "none",
                                                },

                                                "&:hover": {
                                                    backgroundColor:
                                                        "#FFFBF6",
                                                },
                                            }}
                                        >
                                            {/* APPLICANT */}

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    sx={{
                                                        alignItems:
                                                            "center",
                                                        minWidth: 190,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            fontSize:
                                                                "0.9rem",
                                                            fontWeight: 800,
                                                            backgroundColor:
                                                                "#E76F51",
                                                            color: "#fff",
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
                                                                fontWeight: 800,
                                                                color: "#293241",
                                                            }}
                                                        >
                                                            {
                                                                application.ApplicantName
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#7A7068",
                                                            }}
                                                        >
                                                            {
                                                                application.ApplicantEmail
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            {/* JOB */}

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        alignItems:
                                                            "center",
                                                        minWidth: 170,
                                                    }}
                                                >
                                                    <Work
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#E76F51",
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: "#293241",
                                                        }}
                                                    >
                                                        {
                                                            application.JobTitle
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            {/* COMPANY */}

                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{
                                                        alignItems:
                                                            "center",
                                                        minWidth: 150,
                                                    }}
                                                >
                                                    <Business
                                                        sx={{
                                                            fontSize: 19,
                                                            color: "#6A994E",
                                                        }}
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#5F554D",
                                                        }}
                                                    >
                                                        {
                                                            application.CompanyName
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            {/* APPLIED */}

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#7A7068",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {formatDate(
                                                        application.ApplicationDate
                                                    )}
                                                </Typography>
                                            </TableCell>

                                            {/* STATUS */}

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        application.Status ||
                                                        "Unknown"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        ...getStatusSx(
                                                            application.Status
                                                        ),
                                                        fontWeight: 800,
                                                    }}
                                                />
                                            </TableCell>

                                            {/* ACTION */}

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
                                                            color: "#E76F51",
                                                            backgroundColor:
                                                                "#FFF1D6",
                                                            border: "1px solid #F4D3B5",

                                                            "&:hover":
                                                                {
                                                                    backgroundColor:
                                                                        "#FFE5CC",
                                                                },
                                                        }}
                                                    >
                                                        <Visibility fontSize="small" />
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
            </Paper>

            {/* APPLICATION DETAILS DIALOG */}

            <Dialog
                open={detailsOpen}
                onClose={closeDetails}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                        backgroundColor: "#FFFDF9",
                    },
                }}
            >
                {selectedApplication && (
                    <>
                        <DialogTitle
                            sx={{
                                p: {
                                    xs: 2.5,
                                    sm: 3,
                                },
                                backgroundColor: "#293241",
                                color: "#fff",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 900,
                                        }}
                                    >
                                        Application Details
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 0.5,
                                            color: "rgba(255,255,255,0.65)",
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
                                        color: "#fff",

                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255,255,255,0.1)",
                                        },
                                    }}
                                >
                                    <Close />
                                </IconButton>
                            </Box>
                        </DialogTitle>

                        <DialogContent
                            sx={{
                                p: {
                                    xs: 2.5,
                                    sm: 3,
                                },
                            }}
                        >
                            {/* APPLICANT */}

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#9A8F86",
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
                                            backgroundColor:
                                                "#E76F51",
                                            color: "#fff",
                                        }}
                                    >
                                        {selectedApplication.ApplicantName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 900,
                                                color: "#293241",
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
                                            <Email
                                                sx={{
                                                    fontSize: 17,
                                                    color: "#7A7068",
                                                }}
                                            />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#7A7068",
                                                    wordBreak:
                                                        "break-word",
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

                            <Divider
                                sx={{
                                    mb: 3,
                                    borderColor: "#E9DED0",
                                }}
                            />

                            {/* POSITION */}

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#9A8F86",
                                        fontWeight: 800,
                                        letterSpacing: 1,
                                    }}
                                >
                                    Position
                                </Typography>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        borderRadius: 2.5,
                                        backgroundColor:
                                            "#FFF8EF",
                                        border:
                                            "1px solid #E9DED0",
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
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                backgroundColor:
                                                    "#FFF1D6",
                                                color: "#E76F51",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Work />
                                        </Box>

                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 900,
                                                    color: "#293241",
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
                                                <Business
                                                    sx={{
                                                        fontSize: 17,
                                                        color: "#6A994E",
                                                    }}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#7A7068",
                                                    }}
                                                >
                                                    {
                                                        selectedApplication.CompanyName
                                                    }
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Box>

                            {/* APPLICATION INFORMATION */}

                            <Box>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#9A8F86",
                                        fontWeight: 800,
                                        letterSpacing: 1,
                                    }}
                                >
                                    Application Information
                                </Typography>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "repeat(2, minmax(0, 1fr))",
                                        },
                                        gap: 2,
                                        mt: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            backgroundColor:
                                                "#FFF8EF",
                                            border:
                                                "1px solid #E9DED0",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#7A7068",
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
                                                size="small"
                                                sx={{
                                                    ...getStatusSx(
                                                        selectedApplication.Status
                                                    ),
                                                    fontWeight: 800,
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            backgroundColor:
                                                "#FFF8EF",
                                            border:
                                                "1px solid #E9DED0",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#7A7068",
                                            }}
                                        >
                                            Applied On
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontWeight: 800,
                                                color: "#293241",
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
                                        borderRadius: 2.5,
                                        backgroundColor:
                                            "#FFF8EF",
                                        border:
                                            "1px solid #E9DED0",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#7A7068",
                                        }}
                                    >
                                        Submitted
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontWeight: 800,
                                            color: "#293241",
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
                                p: {
                                    xs: 2,
                                    sm: 2.5,
                                },
                                borderTop:
                                    "1px solid #E9DED0",
                                backgroundColor: "#FFFDF9",
                            }}
                        >
                            <Button
                                onClick={closeDetails}
                                startIcon={<ArrowBack />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    color: "#5F554D",

                                    "&:hover": {
                                        backgroundColor:
                                            "#FFF8EF",
                                        color: "#E76F51",
                                    },
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

