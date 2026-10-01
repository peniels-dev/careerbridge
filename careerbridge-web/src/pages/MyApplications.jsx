import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Business,
    CalendarToday,
    LocationOn,
    Work,
    Search,
    ArrowForward,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

// =====================================================
// STATUS COLORS
// =====================================================

const getStatusColor = (status) => {
    switch (status) {
        case "Submitted":
            return {
                backgroundColor: "#FFF1D6",
                color: "#B86B00",
            };

        case "Reviewed":
            return {
                backgroundColor: "#F1EEE9",
                color: "#625B54",
            };

        case "Shortlisted":
            return {
                backgroundColor: "#EDF4E8",
                color: "#527C3E",
            };

        case "Accepted":
            return {
                backgroundColor: "#E8F3E3",
                color: "#477235",
            };

        case "Rejected":
            return {
                backgroundColor: "#FCE8E2",
                color: "#C94F3B",
            };

        default:
            return {
                backgroundColor: "#F1EEE9",
                color: "#625B54",
            };
    }
};

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
        return "N/A";
    }

    return formattedDate.toLocaleDateString("en-GH", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// =====================================================
// APPLICATION SKELETON
// =====================================================

const ApplicationSkeleton = () => {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid #E9DED0",
                backgroundColor: "#FFFDF9",
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        gap: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        mb: 2,
                    }}
                >
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <Skeleton
                            variant="text"
                            width="65%"
                            height={32}
                        />

                        <Skeleton
                            variant="text"
                            width="40%"
                            height={24}
                        />
                    </Box>

                    <Skeleton
                        variant="rounded"
                        width={90}
                        height={30}
                    />
                </Box>

                <Divider
                    sx={{
                        my: 2,
                        borderColor: "#E9DED0",
                    }}
                />

                <Skeleton
                    variant="text"
                    width="45%"
                    height={24}
                />

                <Skeleton
                    variant="text"
                    width="50%"
                    height={24}
                />

                <Skeleton
                    variant="text"
                    width="35%"
                    height={22}
                />
            </CardContent>
        </Card>
    );
};

// =====================================================
// APPLICATION DETAIL
// =====================================================

const ApplicationDetail = ({ icon, children }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    backgroundColor: "#FFF1D6",
                    color: "#E76F51",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Typography
                sx={{
                    color: "#625B54",
                    fontSize: {
                        xs: 13,
                        sm: 14,
                    },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {children}
            </Typography>
        </Box>
    );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const MyApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =================================================
    // FETCH APPLICATIONS
    // =================================================

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get(
                "/applications/me"
            );

            const data = response.data?.data;

            setApplications(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(
                "Error fetching applications:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load your applications. Please try again."
            );

            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // =================================================
    // RETRY
    // =================================================

    const handleRetry = () => {
        fetchApplications();
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                overflowX: "hidden",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    py: {
                        xs: 3,
                        sm: 4,
                        md: 5,
                    },
                }}
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        mb: {
                            xs: 3.5,
                            sm: 4.5,
                        },
                    }}
                >
                    {/* TOP NAVIGATION */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                minHeight: 40,
                                px: 1,
                                color: "#625B54",
                                fontWeight: 700,
                                fontSize: {
                                    xs: 13,
                                    sm: 14,
                                },
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor:
                                        "#FFF1D6",
                                    color: "#E76F51",
                                },
                            }}
                        >
                            Dashboard
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Search />}
                            onClick={() =>
                                navigate("/jobs")
                            }
                            sx={{
                                minHeight: {
                                    xs: 42,
                                    sm: 44,
                                },
                                px: {
                                    xs: 2,
                                    sm: 2.5,
                                },
                                borderRadius: 2,
                                backgroundColor:
                                    "#E76F51",
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor:
                                        "#D85F43",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Find More Jobs
                        </Button>
                    </Box>

                    {/* TITLE */}

                    <Box sx={{ mt: 3.5 }}>
                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: 29,
                                    sm: 35,
                                    md: 40,
                                },
                                fontWeight: 900,
                                color: "#293241",
                                lineHeight: 1.15,
                                letterSpacing: "-1px",
                            }}
                        >
                            My Applications
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.2,
                                color: "#6F665F",
                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                                lineHeight: 1.7,
                                maxWidth: 650,
                            }}
                        >
                            Keep track of the jobs you've
                            applied for and see where each
                            application stands.
                        </Typography>
                    </Box>
                </Box>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <Stack spacing={2.5}>
                        {[1, 2, 3].map((item) => (
                            <ApplicationSkeleton
                                key={item}
                            />
                        ))}
                    </Stack>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (
                    <Alert
                        severity="error"
                        sx={{
                            borderRadius: 3,
                            backgroundColor: "#FFFDF9",
                            border:
                                "1px solid #F0C8BF",
                            color: "#7F3328",
                            alignItems: "center",
                            "& .MuiAlert-message": {
                                flex: 1,
                            },
                        }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleRetry}
                                sx={{
                                    fontWeight: 700,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Try Again
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading &&
                    !error &&
                    applications.length === 0 && (
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border:
                                    "1px solid #E9DED0",
                                backgroundColor:
                                    "#FFFDF9",
                            }}
                        >
                            <CardContent
                                sx={{
                                    py: {
                                        xs: 6,
                                        sm: 8,
                                    },
                                    px: 3,
                                    textAlign: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 76,
                                        height: 76,
                                        borderRadius:
                                            "50%",
                                        backgroundColor:
                                            "#FFF1D6",
                                        color: "#E76F51",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        mx: "auto",
                                        mb: 2.5,
                                    }}
                                >
                                    <Work
                                        sx={{
                                            fontSize: 35,
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 21,
                                            sm: 24,
                                        },
                                        fontWeight: 900,
                                        color: "#293241",
                                    }}
                                >
                                    No applications yet
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        maxWidth: 520,
                                        mx: "auto",
                                        color: "#6F665F",
                                        fontSize: 14,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    You haven't applied
                                    for any jobs yet.
                                    Explore available
                                    opportunities and
                                    submit your first
                                    application.
                                </Typography>

                                <Button
                                    variant="contained"
                                    startIcon={<Search />}
                                    endIcon={
                                        <ArrowForward />
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/jobs"
                                        )
                                    }
                                    sx={{
                                        mt: 3,
                                        minHeight: 44,
                                        px: 3,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#E76F51",
                                        fontWeight: 700,
                                        textTransform:
                                            "none",
                                        boxShadow:
                                            "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#D85F43",
                                            boxShadow:
                                                "none",
                                        },
                                    }}
                                >
                                    Find Jobs
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                {/* =================================================
                    APPLICATION LIST
                ================================================= */}

                {!loading &&
                    !error &&
                    applications.length > 0 && (
                        <Stack spacing={2.5}>
                            {applications.map(
                                (application) => {
                                    const status =
                                        application.Status ||
                                        application.status ||
                                        "Submitted";

                                    const statusStyle =
                                        getStatusColor(
                                            status
                                        );

                                    const jobTitle =
                                        application.JobTitle ||
                                        application.jobTitle ||
                                        "Untitled Job";

                                    const companyName =
                                        application.CompanyName ||
                                        application.companyName ||
                                        "Company";

                                    const location =
                                        application.Location ||
                                        application.location ||
                                        "Location not specified";

                                    const cvTitle =
                                        application.CVTitle ||
                                        application.cvTitle ||
                                        "CV submitted";

                                    const createdDate =
                                        application.CreatedDate ||
                                        application.createdDate;

                                    return (
                                        <Card
                                            key={
                                                application.ApplicationID ||
                                                application.applicationId ||
                                                `${application.JobID}-${createdDate}`
                                            }
                                            elevation={0}
                                            sx={{
                                                borderRadius: 3,
                                                border:
                                                    "1px solid #E9DED0",
                                                backgroundColor:
                                                    "#FFFDF9",
                                                overflow:
                                                    "hidden",
                                                transition:
                                                    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                                                "&:hover": {
                                                    transform:
                                                        "translateY(-2px)",
                                                    borderColor:
                                                        "#E1CDBB",
                                                    boxShadow:
                                                        "0 10px 26px rgba(91,72,56,0.08)",
                                                },
                                            }}
                                        >
                                            {/* TOP ACCENT */}

                                            <Box
                                                sx={{
                                                    height: 4,
                                                    backgroundColor:
                                                        status ===
                                                        "Rejected"
                                                            ? "#D85F43"
                                                            : status ===
                                                              "Accepted"
                                                            ? "#6A994E"
                                                            : "#E76F51",
                                                }}
                                            />

                                            <CardContent
                                                sx={{
                                                    p: {
                                                        xs: 2.5,
                                                        sm: 3,
                                                    },
                                                    "&:last-child":
                                                        {
                                                            pb: {
                                                                xs: 2.5,
                                                                sm: 3,
                                                            },
                                                        },
                                                }}
                                            >
                                                {/* JOB TITLE + STATUS */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            {
                                                                xs: "flex-start",
                                                                sm: "center",
                                                            },
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 2,
                                                        flexDirection:
                                                            {
                                                                xs: "column",
                                                                sm: "row",
                                                            },
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
                                                                        xs: 18,
                                                                        sm: 21,
                                                                    },
                                                                fontWeight: 800,
                                                                color: "#293241",
                                                                lineHeight: 1.3,
                                                                wordBreak:
                                                                    "break-word",
                                                            }}
                                                        >
                                                            {
                                                                jobTitle
                                                            }
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 0.75,
                                                                mt: 0.8,
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <Business
                                                                sx={{
                                                                    fontSize: 17,
                                                                    color: "#6A994E",
                                                                    flexShrink: 0,
                                                                }}
                                                            />

                                                            <Typography
                                                                sx={{
                                                                    color: "#625B54",
                                                                    fontSize: 14,
                                                                    fontWeight: 600,
                                                                    overflow:
                                                                        "hidden",
                                                                    textOverflow:
                                                                        "ellipsis",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                {
                                                                    companyName
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Chip
                                                        label={
                                                            status
                                                        }
                                                        size="small"
                                                        sx={{
                                                            ...statusStyle,
                                                            fontWeight: 800,
                                                            borderRadius: 2,
                                                            height: 31,
                                                            flexShrink: 0,
                                                            "& .MuiChip-label":
                                                                {
                                                                    px: 1.4,
                                                                },
                                                        }}
                                                    />
                                                </Box>

                                                <Divider
                                                    sx={{
                                                        my: 2.5,
                                                        borderColor:
                                                            "#E9DED0",
                                                    }}
                                                />

                                                {/* DETAILS */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "grid",
                                                        gridTemplateColumns:
                                                            {
                                                                xs: "1fr",
                                                                sm: "repeat(2, minmax(0, 1fr))",
                                                                md: "repeat(3, minmax(0, 1fr))",
                                                            },
                                                        gap: {
                                                            xs: 1.75,
                                                            sm: 2,
                                                        },
                                                    }}
                                                >
                                                    <ApplicationDetail
                                                        icon={
                                                            <LocationOn
                                                                sx={{
                                                                    fontSize: 18,
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        {
                                                            location
                                                        }
                                                    </ApplicationDetail>

                                                    <ApplicationDetail
                                                        icon={
                                                            <CalendarToday
                                                                sx={{
                                                                    fontSize: 17,
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        Applied{" "}
                                                        {formatDate(
                                                            createdDate
                                                        )}
                                                    </ApplicationDetail>

                                                    <ApplicationDetail
                                                        icon={
                                                            <Work
                                                                sx={{
                                                                    fontSize: 18,
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        CV:{" "}
                                                        {
                                                            cvTitle
                                                        }
                                                    </ApplicationDetail>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                }
                            )}
                        </Stack>
                    )}
            </Container>
        </Box>
    );
};

export default MyApplications;