import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    DescriptionOutlined,
    Send,
    UploadFile,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

const ApplyJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [cvs, setCvs] = useState([]);
    const [selectedCV, setSelectedCV] = useState("");
    const [coverLetter, setCoverLetter] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingCVs, setLoadingCVs] = useState(true);
    const [applying, setApplying] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setLoadingCVs(true);
                setError("");

                // Load job
                const jobResponse = await axiosAPI.get(
                    `/jobs/${id}`
                );

                const jobData =
                    jobResponse.data?.data ||
                    jobResponse.data;

                setJob(jobData);

                // Load saved CVs
                const cvResponse = await axiosAPI.get("/cvs");

                const cvData =
                    cvResponse.data?.data ||
                    cvResponse.data;

                const validCVs = Array.isArray(cvData)
                    ? cvData.filter(
                          (cv) =>
                              cv.CVID &&
                              cv.FilePath
                      )
                    : [];

                setCvs(validCVs);
            } catch (err) {
                console.error(
                    "Load application page error:",
                    err.response?.data || err
                );

                setError(
                    err.response?.data?.message ||
                        "Failed to load the application page."
                );
            } finally {
                setLoading(false);
                setLoadingCVs(false);
            }
        };

        loadData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedCV) {
            setError(
                "Please select a CV before applying."
            );
            return;
        }

        if (!coverLetter.trim()) {
            setError(
                "Please enter your cover letter."
            );
            return;
        }

        try {
            setApplying(true);

            const response = await axiosAPI.post(
                `/jobs/${id}/apply`,
                {
                    CVID: Number(selectedCV),
                    CoverLetter: coverLetter.trim(),
                }
            );

            console.log(
                "Application response:",
                response.data
            );

            setSuccess(
                "Application submitted successfully! Your application has been sent to the employer."
            );
        } catch (err) {
            console.error(
                "Application error:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to submit application."
            );
        } finally {
            setApplying(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
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
                    <CircularProgress size={42} />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#667085",
                            fontSize: 14,
                        }}
                    >
                        Loading application page...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Job failed to load
    if (!job) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
                    py: {
                        xs: 3,
                        sm: 5,
                    },
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                            },
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            textAlign: "center",
                        }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                textAlign: "left",
                            }}
                        >
                            {error ||
                                "Job information could not be loaded."}
                        </Alert>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/jobs")
                            }
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            Back to Jobs
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    const jobTitle =
        job.JobTitle || job.jobTitle || "Job Position";

    const companyName =
        job.CompanyName ||
        job.companyName ||
        "Company";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 2.5,
                    sm: 4,
                    md: 5,
                },
                overflowX: "hidden",
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* Back button */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(`/jobs/${id}`)
                    }
                    sx={{
                        mb: {
                            xs: 2,
                            sm: 3,
                        },
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#475467",
                        "&:hover": {
                            backgroundColor: "#eef2f6",
                        },
                    }}
                >
                    Back to Job Details
                </Button>

                {/* Job header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 3.5,
                            md: 4,
                        },
                        mb: {
                            xs: 2,
                            sm: 3,
                        },
                        borderRadius: {
                            xs: 2.5,
                            sm: 3,
                        },
                        border: "1px solid #e5e7eb",
                        background:
                            "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
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
                                    color: "#667085",
                                    fontSize: {
                                        xs: 12,
                                        sm: 13,
                                    },
                                    fontWeight: 600,
                                    mb: 1,
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Application
                            </Typography>

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: 25,
                                        sm: 31,
                                        md: 36,
                                    },
                                    lineHeight: 1.2,
                                    fontWeight: 800,
                                    color: "#172033",
                                    letterSpacing:
                                        "-0.6px",
                                    overflowWrap:
                                        "anywhere",
                                }}
                            >
                                {jobTitle}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,
                                    color: "#667085",
                                    fontSize: {
                                        xs: 14,
                                        sm: 15,
                                    },
                                    overflowWrap:
                                        "anywhere",
                                }}
                            >
                                {companyName}
                            </Typography>
                        </Box>

                        <Chip
                            icon={<DescriptionOutlined />}
                            label="Job Application"
                            sx={{
                                flexShrink: 0,
                                fontWeight: 600,
                                backgroundColor: "#eef4ff",
                                color: "#175cd3",
                            }}
                        />
                    </Box>
                </Paper>

                {/* Error */}
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError("")}
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Success */}
                {success && (
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            p: {
                                xs: 2.5,
                                sm: 3,
                            },
                            borderRadius: 3,
                            border: "1px solid #abefc6",
                            backgroundColor: "#f6fef9",
                        }}
                    >
                        <Alert
                            severity="success"
                            sx={{
                                mb: 2,
                                backgroundColor:
                                    "transparent",
                                p: 0,
                            }}
                        >
                            {success}
                        </Alert>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    </Paper>
                )}

                {/* Main application form */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: {
                            xs: 2.5,
                            sm: 3,
                        },
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        {/* Form content */}
                        <Box
                            sx={{
                                p: {
                                    xs: 2.5,
                                    sm: 3.5,
                                    md: 4,
                                },
                            }}
                        >
                            {/* CV section */}
                            <Box>
                                <Typography
                                    component="h2"
                                    sx={{
                                        fontSize: {
                                            xs: 19,
                                            sm: 21,
                                        },
                                        fontWeight: 800,
                                        color: "#172033",
                                        mb: 0.7,
                                    }}
                                >
                                    Select your CV
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#667085",
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                        lineHeight: 1.6,
                                        mb: 3,
                                    }}
                                >
                                    Choose the CV you want
                                    to send with your
                                    application.
                                </Typography>

                                {loadingCVs ? (
                                    <Box
                                        sx={{
                                            py: 5,
                                            display: "flex",
                                            flexDirection:
                                                "column",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >
                                        <CircularProgress
                                            size={32}
                                        />

                                        <Typography
                                            sx={{
                                                mt: 1.5,
                                                fontSize: 13,
                                                color: "#667085",
                                            }}
                                        >
                                            Loading your
                                            CVs...
                                        </Typography>
                                    </Box>
                                ) : cvs.length === 0 ? (
                                    <Box
                                        sx={{
                                            p: {
                                                xs: 2.5,
                                                sm: 3.5,
                                            },
                                            borderRadius: 2.5,
                                            border: "1px dashed #cbd5e1",
                                            backgroundColor:
                                                "#f8fafc",
                                            textAlign: "center",
                                        }}
                                    >
                                        <DescriptionOutlined
                                            sx={{
                                                fontSize: 44,
                                                color: "#98a2b3",
                                                mb: 1,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: 16,
                                                color: "#344054",
                                                mb: 0.8,
                                            }}
                                        >
                                            No CVs found
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#667085",
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                maxWidth: 430,
                                                mx: "auto",
                                                mb: 2.5,
                                            }}
                                        >
                                            You need to
                                            upload a CV
                                            before you can
                                            apply for this
                                            position.
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            startIcon={
                                                <UploadFile />
                                            }
                                            onClick={() =>
                                                navigate(
                                                    "/my-cvs"
                                                )
                                            }
                                            sx={{
                                                textTransform:
                                                    "none",
                                                fontWeight: 700,
                                                borderRadius: 2,
                                                px: 2.5,
                                            }}
                                        >
                                            Go to My CVs
                                        </Button>
                                    </Box>
                                ) : (
                                    <RadioGroup
                                        value={selectedCV}
                                        onChange={(event) =>
                                            setSelectedCV(
                                                event.target
                                                    .value
                                            )
                                        }
                                    >
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                gap: 1.5,
                                            }}
                                        >
                                            {cvs.map((cv) => {
                                                const isSelected =
                                                    String(
                                                        selectedCV
                                                    ) ===
                                                    String(
                                                        cv.CVID
                                                    );

                                                return (
                                                    <Paper
                                                        key={
                                                            cv.CVID
                                                        }
                                                        elevation={
                                                            0
                                                        }
                                                        onClick={() =>
                                                            setSelectedCV(
                                                                String(
                                                                    cv.CVID
                                                                )
                                                            )
                                                        }
                                                        sx={{
                                                            p: {
                                                                xs: 1.5,
                                                                sm: 2,
                                                            },
                                                            borderRadius: 2.5,
                                                            cursor: "pointer",
                                                            border: isSelected
                                                                ? "2px solid #1976d2"
                                                                : "1px solid #d9dee7",
                                                            backgroundColor:
                                                                isSelected
                                                                    ? "#f0f7ff"
                                                                    : "#ffffff",
                                                            transition:
                                                                "all 0.2s ease",
                                                            "&:hover":
                                                                {
                                                                    borderColor:
                                                                        "#1976d2",
                                                                    boxShadow:
                                                                        "0 5px 16px rgba(16, 24, 40, 0.08)",
                                                                },
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value={String(
                                                                cv.CVID
                                                            )}
                                                            control={
                                                                <Radio />
                                                            }
                                                            sx={{
                                                                width: "100%",
                                                                m: 0,
                                                                alignItems:
                                                                    "flex-start",
                                                            }}
                                                            label={
                                                                <Box
                                                                    sx={{
                                                                        ml: 0.5,
                                                                        pr: 0.5,
                                                                        width: "100%",
                                                                        minWidth: 0,
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
                                                                            gap: 1.5,
                                                                            flexDirection:
                                                                                {
                                                                                    xs: "column",
                                                                                    sm: "row",
                                                                                },
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                display:
                                                                                    "flex",
                                                                                alignItems:
                                                                                    "center",
                                                                                gap: 1,
                                                                                minWidth: 0,
                                                                            }}
                                                                        >
                                                                            <DescriptionOutlined
                                                                                color="primary"
                                                                                fontSize="small"
                                                                            />

                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: 700,
                                                                                    fontSize: {
                                                                                        xs: 14,
                                                                                        sm: 15,
                                                                                    },
                                                                                    color: "#344054",
                                                                                    overflowWrap:
                                                                                        "anywhere",
                                                                                }}
                                                                            >
                                                                                {cv.CVTitle ||
                                                                                    "My CV"}
                                                                            </Typography>
                                                                        </Box>

                                                                        {isSelected && (
                                                                            <Chip
                                                                                label="Selected"
                                                                                color="primary"
                                                                                size="small"
                                                                                sx={{
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>

                                                                    <Typography
                                                                        sx={{
                                                                            mt: 0.8,
                                                                            color: "#667085",
                                                                            fontSize: 12,
                                                                        }}
                                                                    >
                                                                        Uploaded{" "}
                                                                        {cv.UploadDate
                                                                            ? new Date(
                                                                                  cv.UploadDate
                                                                              ).toLocaleDateString()
                                                                            : "recently"}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </Paper>
                                                );
                                            })}
                                        </Box>
                                    </RadioGroup>
                                )}
                            </Box>

                            <Divider
                                sx={{
                                    my: {
                                        xs: 3,
                                        sm: 4,
                                    },
                                }}
                            />

                            {/* Cover letter */}
                            <Box>
                                <Typography
                                    component="h2"
                                    sx={{
                                        fontSize: {
                                            xs: 19,
                                            sm: 21,
                                        },
                                        fontWeight: 800,
                                        color: "#172033",
                                        mb: 0.7,
                                    }}
                                >
                                    Cover Letter
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#667085",
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                        lineHeight: 1.6,
                                        mb: 2,
                                    }}
                                >
                                    Tell the employer why
                                    you are interested in
                                    this position and what
                                    makes you a suitable
                                    candidate.
                                </Typography>

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={7}
                                    placeholder="Write your cover letter here..."
                                    value={coverLetter}
                                    onChange={(event) =>
                                        setCoverLetter(
                                            event.target
                                                .value
                                        )
                                    }
                                    disabled={applying}
                                    sx={{
                                        "& .MuiOutlinedInput-root":
                                            {
                                                borderRadius: 2,
                                                backgroundColor:
                                                    "#ffffff",
                                                fontSize: {
                                                    xs: 14,
                                                    sm: 15,
                                                },
                                                lineHeight: 1.6,
                                            },
                                    }}
                                />

                                <Typography
                                    sx={{
                                        mt: 1,
                                        textAlign: "right",
                                        color: "#98a2b3",
                                        fontSize: 12,
                                    }}
                                >
                                    {coverLetter.length}{" "}
                                    characters
                                </Typography>
                            </Box>
                        </Box>

                        {/* Submit section */}
                        <Box
                            sx={{
                                borderTop:
                                    "1px solid #eaecf0",
                                backgroundColor:
                                    "#fcfcfd",
                                p: {
                                    xs: 2.5,
                                    sm: 3,
                                    md: 4,
                                },
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={
                                    applying ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Send />
                                    )
                                }
                                disabled={
                                    applying ||
                                    cvs.length === 0 ||
                                    Boolean(success)
                                }
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: {
                                        xs: "0.95rem",
                                        sm: "1rem",
                                    },
                                    fontWeight: 700,
                                    boxShadow:
                                        "0 4px 12px rgba(25, 118, 210, 0.18)",
                                }}
                            >
                                {applying
                                    ? "Submitting Application..."
                                    : success
                                    ? "Application Submitted"
                                    : "Submit Application"}
                            </Button>

                            <Typography
                                sx={{
                                    mt: 1.5,
                                    textAlign: "center",
                                    color: "#98a2b3",
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                }}
                            >
                                Make sure your CV and
                                cover letter are correct
                                before submitting.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApplyJob;