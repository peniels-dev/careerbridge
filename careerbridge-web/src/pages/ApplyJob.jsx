import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    Chip,
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
                setError("");

                // Get job
                const jobResponse = await axiosAPI.get(
                    `/jobs/${id}`
                );

                const jobData =
                    jobResponse.data?.data ||
                    jobResponse.data;

                setJob(jobData);

                // Get saved CVs
                setLoadingCVs(true);

                const cvResponse = await axiosAPI.get("/cvs");

                const cvData =
                    cvResponse.data?.data ||
                    cvResponse.data;

                // Only show proper CV records
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

            // Show success message and KEEP the user on this page
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

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!job) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">
                    Job information could not be loaded.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/jobs")}
                >
                    Back to Jobs
                </Button>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                py: 5,
            }}
        >
            <Container maxWidth="md">

                {/* Back button */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(`/jobs/${id}`)
                    }
                    sx={{
                        mb: 3,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Back to Job Details
                </Button>

                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Apply for this position
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            mb: 1,
                        }}
                    >
                        {job.JobTitle ||
                            job.jobTitle}
                    </Typography>

                    <Typography color="text.secondary">
                        {job.CompanyName ||
                            job.companyName ||
                            "Company"}
                    </Typography>
                </Paper>

                {/* Error message */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* SUCCESS MESSAGE */}
                {success && (
                    <Box sx={{ mb: 3 }}>
                        <Alert severity="success">
                            {success}
                        </Alert>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                mt: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        {/* CV SECTION */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            Select your CV
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Choose one of your saved CVs
                            to submit with this
                            application.
                        </Typography>

                        {loadingCVs ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "center",
                                    py: 4,
                                }}
                            >
                                <CircularProgress
                                    size={30}
                                />
                            </Box>
                        ) : cvs.length === 0 ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#f8fafc",
                                    border:
                                        "1px dashed #cbd5e1",
                                    textAlign: "center",
                                }}
                            >
                                <DescriptionOutlined
                                    sx={{
                                        fontSize: 42,
                                        color:
                                            "text.secondary",
                                        mb: 1,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                    }}
                                >
                                    No CVs found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Upload a CV in My CVs
                                    before applying.
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
                                    }}
                                >
                                    Go to My CVs
                                </Button>
                            </Paper>
                        ) : (
                            <RadioGroup
                                value={selectedCV}
                                onChange={(event) =>
                                    setSelectedCV(
                                        event.target.value
                                    )
                                }
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        gap: 2,
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
                                                elevation={0}
                                                onClick={() =>
                                                    setSelectedCV(
                                                        String(
                                                            cv.CVID
                                                        )
                                                    )
                                                }
                                                sx={{
                                                    p: 2.5,
                                                    borderRadius:
                                                        2.5,
                                                    cursor:
                                                        "pointer",
                                                    border:
                                                        isSelected
                                                            ? "2px solid #1976d2"
                                                            : "1px solid #d9dee7",
                                                    backgroundColor:
                                                        isSelected
                                                            ? "#f0f7ff"
                                                            : "#ffffff",
                                                    transition:
                                                        "all 0.2s ease",

                                                    "&:hover": {
                                                        borderColor:
                                                            "#1976d2",
                                                        boxShadow:
                                                            "0 4px 14px rgba(0,0,0,0.08)",
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
                                                        width:
                                                            "100%",
                                                        m: 0,
                                                        alignItems:
                                                            "flex-start",
                                                    }}
                                                    label={
                                                        <Box
                                                            sx={{
                                                                ml: 1,
                                                                pr: 1,
                                                                width:
                                                                    "100%",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    gap: 2,
                                                                    flexWrap:
                                                                        "wrap",
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    <DescriptionOutlined
                                                                        color="primary"
                                                                    />

                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight:
                                                                                700,
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
                                                                    />
                                                                )}
                                                            </Box>

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    mt: 1,
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

                        <Divider sx={{ my: 4 }} />

                        {/* COVER LETTER */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            Cover Letter
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Tell the employer why you
                            are interested in this
                            position.
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            minRows={7}
                            placeholder="Write your cover letter here..."
                            value={coverLetter}
                            onChange={(event) =>
                                setCoverLetter(
                                    event.target.value
                                )
                            }
                            disabled={applying}
                        />

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<Send />}
                            disabled={
                                applying ||
                                cvs.length === 0 ||
                                Boolean(success)
                            }
                            sx={{
                                mt: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 700,
                            }}
                        >
                            {applying
                                ? "Submitting Application..."
                                : success
                                ? "Application Submitted"
                                : "Submit Application"}
                        </Button>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ApplyJob;