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
    Grid,
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
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";


const getStatusColor = (status) => {
    switch (status) {
        case "Submitted":
            return {
                backgroundColor: "#eff6ff",
                color: "#2563eb",
            };

        case "Reviewed":
            return {
                backgroundColor: "#f3f4f6",
                color: "#475467",
            };

        case "Shortlisted":
            return {
                backgroundColor: "#ecfdf3",
                color: "#027a48",
            };

        case "Accepted":
            return {
                backgroundColor: "#ecfdf3",
                color: "#027a48",
            };

        case "Rejected":
            return {
                backgroundColor: "#fef3f2",
                color: "#d92d20",
            };

        default:
            return {
                backgroundColor: "#f2f4f7",
                color: "#475467",
            };
    }
};


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


const ApplicationSkeleton = () => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                border: "1px solid #eaecf0",
                boxShadow:
                    "0 2px 10px rgba(16, 24, 40, 0.04)",
            }}
        >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
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

                <Divider sx={{ my: 2 }} />

                <Skeleton
                    variant="text"
                    width="35%"
                    height={22}
                />
            </CardContent>
        </Card>
    );
};


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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#667085",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Typography
                sx={{
                    color: "#475467",
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


const MyApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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


    const handleRetry = () => {
        fetchApplications();
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
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
                {/* Header */}
                <Box
                    sx={{
                        mb: {
                            xs: 3,
                            sm: 4,
                        },
                    }}
                >
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
                                color: "#475467",
                                fontWeight: 700,
                                fontSize: {
                                    xs: 13,
                                    sm: 14,
                                },
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor:
                                        "#eef2f6",
                                    color: "#2563eb",
                                },
                            }}
                        >
                            Dashboard
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Work />}
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
                                backgroundColor: "#2563eb",
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow:
                                    "0 2px 6px rgba(37, 99, 235, 0.2)",
                                "&:hover": {
                                    backgroundColor:
                                        "#1d4ed8",
                                },
                            }}
                        >
                            Find More Jobs
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: 26,
                                    sm: 30,
                                    md: 34,
                                },
                                fontWeight: 800,
                                color: "#101828",
                                lineHeight: 1.2,
                            }}
                        >
                            My Applications
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                color: "#667085",
                                fontSize: {
                                    xs: 14,
                                    sm: 16,
                                },
                            }}
                        >
                            Track the jobs you have applied
                            for and check their current
                            status.
                        </Typography>
                    </Box>
                </Box>


                {/* Loading */}
                {loading && (
                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                        }}
                    >
                        {[1, 2, 3].map((item) => (
                            <Grid
                                item
                                xs={12}
                                key={item}
                            >
                                <ApplicationSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                )}


                {/* Error */}
                {!loading && error && (
                    <Alert
                        severity="error"
                        sx={{
                            borderRadius: 3,
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
                                    textTransform: "none",
                                }}
                            >
                                Try Again
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}


                {/* Empty state */}
                {!loading &&
                    !error &&
                    applications.length === 0 && (
                        <Card
                            sx={{
                                borderRadius: 4,
                                border: "1px solid #eaecf0",
                                boxShadow:
                                    "0 4px 16px rgba(16, 24, 40, 0.04)",
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
                                        width: 72,
                                        height: 72,
                                        borderRadius: "50%",
                                        backgroundColor:
                                            "#eff6ff",
                                        color: "#2563eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            "center",
                                        mx: "auto",
                                        mb: 2.5,
                                    }}
                                >
                                    <Work
                                        sx={{
                                            fontSize: 34,
                                        }}
                                    />
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 20,
                                            sm: 23,
                                        },
                                        fontWeight: 800,
                                        color: "#101828",
                                    }}
                                >
                                    No applications yet
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        maxWidth: 500,
                                        mx: "auto",
                                        color: "#667085",
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    You haven't applied for
                                    any jobs yet. Explore
                                    available opportunities
                                    and submit your first
                                    application.
                                </Typography>

                                <Button
                                    variant="contained"
                                    startIcon={<Work />}
                                    onClick={() =>
                                        navigate("/jobs")
                                    }
                                    sx={{
                                        mt: 3,
                                        minHeight: 44,
                                        px: 3,
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#2563eb",
                                        fontWeight: 700,
                                        textTransform:
                                            "none",
                                        "&:hover": {
                                            backgroundColor:
                                                "#1d4ed8",
                                        },
                                    }}
                                >
                                    Find Jobs
                                </Button>
                            </CardContent>
                        </Card>
                    )}


                {/* Applications */}
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
                                            sx={{
                                                borderRadius: 3,
                                                border: "1px solid #eaecf0",
                                                boxShadow:
                                                    "0 2px 10px rgba(16, 24, 40, 0.04)",
                                                transition:
                                                    "transform 0.2s ease, box-shadow 0.2s ease",
                                                "&:hover": {
                                                    transform:
                                                        "translateY(-2px)",
                                                    boxShadow:
                                                        "0 8px 24px rgba(16, 24, 40, 0.08)",
                                                },
                                            }}
                                        >
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
                                                                        sm: 20,
                                                                    },
                                                                fontWeight: 800,
                                                                color: "#101828",
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
                                                                mt: 0.75,
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <Business
                                                                sx={{
                                                                    fontSize: 17,
                                                                    color: "#667085",
                                                                    flexShrink: 0,
                                                                }}
                                                            />

                                                            <Typography
                                                                sx={{
                                                                    color: "#475467",
                                                                    fontSize: 14,
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
                                                            fontWeight: 700,
                                                            borderRadius: 2,
                                                            height: 30,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                </Box>


                                                <Divider
                                                    sx={{
                                                        my: 2.5,
                                                    }}
                                                />


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