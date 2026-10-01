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
                    backgroundColor: "#FFF8EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            backgroundColor: "#FFF1D6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                        }}
                    >
                        <CircularProgress
                            size={30}
                            thickness={4}
                            sx={{
                                color: "#E76F51",
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            color: "#6F675F",
                            fontWeight: 600,
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
                    backgroundColor: "#FFF8EF",
                    py: {
                        xs: 4,
                        md: 6,
                    },
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                md: 4,
                            },
                            backgroundColor: "#FFFDF9",
                            border: "1px solid #E9DED0",
                            borderRadius: 3,
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
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{
                                color: "#E76F51",
                                fontWeight: 700,
                                textTransform: "none",
                                px: 0,

                                "&:hover": {
                                    backgroundColor:
                                        "transparent",
                                    color: "#D85F43",
                                },
                            }}
                        >
                            Go Back
                        </Button>
                    </Paper>
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
                backgroundColor: "#FFF8EF",
                py: {
                    xs: 3,
                    md: 5,
                },
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
                        color: "#E76F51",

                        "&:hover": {
                            backgroundColor: "transparent",
                            color: "#D85F43",
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
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: {
                            xs: 3,
                            md: 4,
                        },
                        overflow: "hidden",
                        mb: 3,
                    }}
                >
                    {/* Warm header banner */}

                    <Box
                        sx={{
                            height: {
                                xs: 110,
                                sm: 130,
                                md: 155,
                            },
                            backgroundColor: "#293241",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Decorative circles */}

                        <Box
                            sx={{
                                position: "absolute",
                                width: 190,
                                height: 190,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(231,111,81,0.18)",
                                right: {
                                    xs: -80,
                                    md: 60,
                                },
                                top: -100,
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(244,162,97,0.18)",
                                right: {
                                    xs: 70,
                                    md: 220,
                                },
                                bottom: -80,
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                width: 90,
                                height: 90,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(106,153,78,0.15)",
                                left: {
                                    xs: -35,
                                    md: 80,
                                },
                                top: -35,
                            }}
                        />
                    </Box>

                    {/* Header content */}

                    <Box
                        sx={{
                            px: {
                                xs: 2.5,
                                sm: 3.5,
                                md: 5,
                            },
                            pb: {
                                xs: 3,
                                md: 4,
                            },
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
                                mt: {
                                    xs: -5,
                                    md: -6,
                                },
                            }}
                        >
                            {/* COMPANY LOGO */}

                            <Box
                                sx={{
                                    width: {
                                        xs: 100,
                                        md: 120,
                                    },
                                    height: {
                                        xs: 100,
                                        md: 120,
                                    },
                                    minWidth: {
                                        xs: 100,
                                        md: 120,
                                    },
                                    borderRadius: 3,
                                    backgroundColor: "#FFFDF9",
                                    border:
                                        "1px solid #E9DED0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0 8px 22px rgba(41,50,65,0.13)",
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
                                            fontSize: {
                                                xs: 45,
                                                md: 55,
                                            },
                                            color: "#E76F51",
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
                                        fontWeight: 900,
                                        color: "#293241",
                                        fontSize: {
                                            xs: 27,
                                            sm: 32,
                                            md: 38,
                                        },
                                        lineHeight: 1.15,
                                        mb: 1.2,
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
                                                color: "#6A994E",
                                            }}
                                        />

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#6F675F",
                                            }}
                                        >
                                            {company.Address}
                                        </Typography>
                                    </Stack>
                                )}
                            </Box>

                            <Chip
                                label="Company"
                                icon={<Business />}
                                sx={{
                                    fontWeight: 700,
                                    color: "#5A713E",
                                    backgroundColor:
                                        "#EDF4E8",
                                    border:
                                        "1px solid #D8E7CF",

                                    "& .MuiChip-icon": {
                                        color: "#6A994E",
                                    },
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
                            backgroundColor: "#FFFDF9",
                            border:
                                "1px solid #E9DED0",
                            borderRadius: 3,
                            p: {
                                xs: 3,
                                md: 4,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2.5,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#FFF1D6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Business
                                    sx={{
                                        color: "#E76F51",
                                        fontSize: 22,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 900,
                                    color: "#293241",
                                }}
                            >
                                About the Company
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                color: "#6F675F",
                                lineHeight: 1.85,
                                whiteSpace: "pre-line",
                                fontSize: "0.98rem",
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
                            backgroundColor: "#FFFDF9",
                            border:
                                "1px solid #E9DED0",
                            borderRadius: 3,
                            p: {
                                xs: 3,
                                md: 3.5,
                            },
                            height: "fit-content",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                color: "#293241",
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
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            minWidth: 38,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "#FFF1D6",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >
                                        <Email
                                            sx={{
                                                color: "#E76F51",
                                                fontSize: 20,
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9A9188",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                                fontWeight: 700,
                                            }}
                                        >
                                            Email
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#4F4943",
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
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            minWidth: 38,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "#EDF4E8",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >
                                        <Phone
                                            sx={{
                                                color: "#6A994E",
                                                fontSize: 20,
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9A9188",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                                fontWeight: 700,
                                            }}
                                        >
                                            Phone
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#4F4943",
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
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            minWidth: 38,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "#FFF1D6",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >
                                        <LocationOn
                                            sx={{
                                                color: "#E76F51",
                                                fontSize: 20,
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9A9188",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                                fontWeight: 700,
                                            }}
                                        >
                                            Location
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#4F4943",
                                            }}
                                        >
                                            {company.Address}
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
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            minWidth: 38,
                                            borderRadius: 2,
                                            backgroundColor:
                                                "#EDF4E8",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >
                                        <Language
                                            sx={{
                                                color: "#6A994E",
                                                fontSize: 20,
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#9A9188",
                                                display:
                                                    "block",
                                                mb: 0.3,
                                                fontWeight: 700,
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
                                                color: "#E76F51",
                                                fontSize:
                                                    "0.875rem",
                                                fontWeight: 600,
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

                        <Divider
                            sx={{
                                my: 3,
                                borderColor:
                                    "#E9DED0",
                            }}
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#9A9188",
                                lineHeight: 1.6,
                            }}
                        >
                            Contact information provided by
                            the employer.
                        </Typography>
                    </Paper>
                </Box>

                {/* =====================================================
                    BOTTOM NOTE
                ===================================================== */}

                <Box
                    sx={{
                        textAlign: "center",
                        py: 4,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#9A9188",
                        }}
                    >
                        Explore opportunities from{" "}
                        <Box
                            component="span"
                            sx={{
                                color: "#E76F51",
                                fontWeight: 800,
                            }}
                        >
                            {company.CompanyName}
                        </Box>{" "}
                        on CareerBridge.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default PublicCompanyProfile;