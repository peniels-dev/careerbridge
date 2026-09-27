import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    Divider,
} from "@mui/material";

import {
    ArrowBack,
    Business,
    Email,
    Phone,
    LocationOn,
    Language,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

const PublicCompanyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const backendURL = "http://localhost:5138";

    const getLogoURL = (logoPath) => {
        if (!logoPath) {
            return "";
        }

        if (logoPath.startsWith("http")) {
            return logoPath;
        }

        return `${backendURL}${logoPath}`;
    };

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosAPI.get(
                    `/companies/${id}`
                );

                setCompany(response.data.data);
            } catch (err) {
                console.error(
                    "Fetch public company error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        "Unable to load company profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f5f7fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#6b7280",
                        }}
                    >
                        Loading company profile...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f5f7fb",
                    py: 5,
                }}
            >
                <Container maxWidth="md">
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
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        sx={{
                            minHeight: 44,
                            px: 3,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            backgroundColor: "#2563eb",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#1d4ed8",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Go Back
                    </Button>
                </Container>
            </Box>
        );
    }

    if (!company) {
        return null;
    }

    const logoURL = getLogoURL(company.CompanyLogo);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                py: 5,
            }}
        >
            <Container maxWidth="lg">

                {/* =====================================================
                    BACK BUTTON
                ===================================================== */}

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 3,
                        px: 0,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#2563eb",
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    Back to Job
                </Button>

                {/* =====================================================
                    COMPANY HEADER
                ===================================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        mb: 3,
                    }}
                >
                    {/* Blue banner */}

                    <Box
                        sx={{
                            height: {
                                xs: 120,
                                md: 150,
                            },
                            background:
                                "linear-gradient(135deg, #1e3a8a, #2563eb)",
                        }}
                    />

                    {/* Header content */}

                    <Box
                        sx={{
                            px: {
                                xs: 3,
                                md: 5,
                            },
                            pb: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: {
                                    xs: "column",
                                    md: "row",
                                },
                                alignItems: {
                                    xs: "flex-start",
                                    md: "flex-end",
                                },
                                gap: 3,
                                mt: -6,
                            }}
                        >

                            {/* COMPANY LOGO */}

                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    minWidth: 120,
                                    borderRadius: 3,
                                    backgroundColor: "white",
                                    border:
                                        "1px solid #e5e7eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 5px 18px rgba(0,0,0,0.1)",
                                }}
                            >
                                {logoURL ? (
                                    <Box
                                        component="img"
                                        src={logoURL}
                                        alt={
                                            company.CompanyName
                                        }
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Business
                                        sx={{
                                            fontSize: 55,
                                            color: "#2563eb",
                                        }}
                                    />
                                )}
                            </Box>

                            {/* COMPANY NAME */}

                            <Box
                                sx={{
                                    flex: 1,
                                    pb: {
                                        xs: 0,
                                        md: 1,
                                    },
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#111827",
                                        mb: 1,
                                    }}
                                >
                                    {company.CompanyName}
                                </Typography>

                                {company.Address && (
                                    <Stack
                                        direction="row"
                                        spacing={0.8}
                                        alignItems="center"
                                    >
                                        <LocationOn
                                            sx={{
                                                fontSize: 19,
                                                color: "#6b7280",
                                            }}
                                        />

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#6b7280",
                                            }}
                                        >
                                            {
                                                company.Address
                                            }
                                        </Typography>
                                    </Stack>
                                )}
                            </Box>

                            <Chip
                                label="Company"
                                icon={<Business />}
                                sx={{
                                    fontWeight: 700,
                                    color: "#1d4ed8",
                                    backgroundColor:
                                        "#eff6ff",
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "2fr 1fr",
                        },
                        gap: 3,
                    }}
                >

                    {/* =================================================
                        ABOUT COMPANY
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            p: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: "#111827",
                                mb: 2,
                            }}
                        >
                            About the Company
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6b7280",
                                lineHeight: 1.8,
                                whiteSpace: "pre-line",
                            }}
                        >
                            {company.Description ||
                                "This company has not added a description yet."}
                        </Typography>
                    </Paper>

                    {/* =================================================
                        COMPANY INFORMATION
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            p: 4,
                            height: "fit-content",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: "#111827",
                                mb: 3,
                            }}
                        >
                            Contact Information
                        </Typography>

                        <Stack spacing={2.5}>

                            {/* EMAIL */}

                            {company.Email && (
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="flex-start"
                                >
                                    <Email
                                        sx={{
                                            color: "#2563eb",
                                            mt: 0.3,
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9ca3af",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                            }}
                                        >
                                            Email
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#374151",
                                                wordBreak:
                                                    "break-word",
                                            }}
                                        >
                                            {company.Email}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}

                            {/* PHONE */}

                            {company.Phone && (
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="flex-start"
                                >
                                    <Phone
                                        sx={{
                                            color: "#2563eb",
                                            mt: 0.3,
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9ca3af",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                            }}
                                        >
                                            Phone
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#374151",
                                            }}
                                        >
                                            {company.Phone}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}

                            {/* LOCATION */}

                            {company.Address && (
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="flex-start"
                                >
                                    <LocationOn
                                        sx={{
                                            color: "#2563eb",
                                            mt: 0.3,
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9ca3af",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                            }}
                                        >
                                            Location
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#374151",
                                            }}
                                        >
                                            {
                                                company.Address
                                            }
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}

                            {/* WEBSITE */}

                            {company.CompanyWebsite && (
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="flex-start"
                                >
                                    <Language
                                        sx={{
                                            color: "#2563eb",
                                            mt: 0.3,
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9ca3af",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                            }}
                                        >
                                            Website
                                        </Typography>

                                        <Typography
                                            component="a"
                                            href={
                                                company.CompanyWebsite.startsWith(
                                                    "http"
                                                )
                                                    ? company.CompanyWebsite
                                                    : `https://${company.CompanyWebsite}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: "#2563eb",
                                                fontSize:
                                                    "0.875rem",
                                                textDecoration:
                                                    "none",
                                                wordBreak:
                                                    "break-word",
                                                "&:hover": {
                                                    textDecoration:
                                                        "underline",
                                                },
                                            }}
                                        >
                                            {
                                                company.CompanyWebsite
                                            }
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#9ca3af",
                                lineHeight: 1.6,
                            }}
                        >
                            Contact information provided by
                            the employer.
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default PublicCompanyProfile;