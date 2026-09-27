import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Business,
    CalendarToday,
    Description,
    LocationOn,
    Work,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

const MyApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosAPI.get("/applications/me");

                setApplications(response.data?.data || []);
            } catch (err) {
                console.error("Error fetching applications:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load your applications."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Accepted":
                return "success";

            case "Shortlisted":
                return "info";

            case "Reviewed":
                return "warning";

            case "Rejected":
                return "error";

            default:
                return "default";
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-GH", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                py: 5,
            }}
        >
            <Container maxWidth="lg">

                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            color="#172033"
                        >
                            My Applications
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Track the jobs you have applied for.
                        </Typography>
                    </Box>

                   <Button
    variant="contained"
    onClick={() => navigate("/dashboard")}
    sx={{
        minHeight: 44,
        px: 3,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.95rem",
        backgroundColor: "#2563eb",
        boxShadow: "none",
        "&:hover": {
            backgroundColor: "#1d4ed8",
            boxShadow: "none",
        },
    }}
>
    Return to Dashboard
</Button>
                </Stack>

                {/* Loading */}
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 10,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {/* Error */}
                {!loading && error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* No applications */}
                {!loading && !error && applications.length === 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: "1px solid #e4e8f0",
                            textAlign: "center",
                            py: 8,
                        }}
                    >
                        <CardContent>
                            <Work
                                sx={{
                                    fontSize: 60,
                                    color: "#9aa4b2",
                                    mb: 2,
                                }}
                            />

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                gutterBottom
                            >
                                No applications yet
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Start exploring available jobs and submit
                                your first application.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<Work />}
                                onClick={() => navigate("/jobs")}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.2,
                                    textTransform: "none",
                                    fontWeight: 700,
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
                            {applications.map((application) => (
                                <Card
                                    key={application.applicationId}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 4,
                                        border: "1px solid #e4e8f0",
                                        transition: "0.2s",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                                "0 8px 25px rgba(0,0,0,0.07)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={800}
                                                    color="#172033"
                                                >
                                                    {
                                                        application.jobTitle
                                                    }
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    sx={{ mt: 1 }}
                                                >
                                                    <Business
                                                        fontSize="small"
                                                        color="action"
                                                    />

                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            application.companyName
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            <Chip
                                                label={
                                                    application.status ||
                                                    "Submitted"
                                                }
                                                color={getStatusColor(
                                                    application.status
                                                )}
                                                sx={{
                                                    fontWeight: 700,
                                                    alignSelf: {
                                                        xs: "flex-start",
                                                        sm: "center",
                                                    },
                                                }}
                                            />
                                        </Stack>

                                        <Divider sx={{ my: 2.5 }} />

                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            spacing={3}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <LocationOn
                                                    fontSize="small"
                                                    color="action"
                                                />

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    {
                                                        application.location ||
                                                        "Location not specified"
                                                    }
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <CalendarToday
                                                    fontSize="small"
                                                    color="action"
                                                />

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    Applied{" "}
                                                    {formatDate(
                                                        application.appliedOn
                                                    )}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <Description
                                                    fontSize="small"
                                                    color="action"
                                                />

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    {application.cvTitle ||
                                                        "CV submitted"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
            </Container>
        </Box>
    );
};

export default MyApplications;