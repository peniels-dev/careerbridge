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
    Description,
    Send,
    UploadFile,
    Work,
    Business,
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
                    <CircularProgress
                        size={42}
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#746B63",
                            fontSize: 14,
                        }}
                    >
                        Loading application page...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!job) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#FFF8EF",
                    py: {
                        xs: 3,
                        sm: 5,
                    },
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                            },
                            borderRadius: 3,
                            border:
                                "1px solid #E9DED0",
                            backgroundColor:
                                "#FFFDF9",
                            textAlign: "center",
                        }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                textAlign: "left",
                                borderRadius: 2,
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
                                fontWeight: 700,
                                borderRadius: 2,
                                color: "#293241",
                                borderColor: "#DCCFC2",
                                "&:hover": {
                                    borderColor:
                                        "#E76F51",
                                    backgroundColor:
                                        "#FFF1D6",
                                },
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
        job.JobTitle ||
        job.jobTitle ||
        "Job Position";

    const companyName =
        job.CompanyName ||
        job.companyName ||
        "Company";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
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
                        fontWeight: 700,
                        color: "#5F554D",
                        px: 1,
                        "&:hover": {
                            backgroundColor:
                                "#FFF1D6",
                        },
                    }}
                >
                    Back to Job Details
                </Button>

                {/* Page heading */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        sx={{
                            color: "#E76F51",
                            fontSize: 12,
                            fontWeight: 900,
                            letterSpacing: "1.5px",
                            mb: 0.8,
                        }}
                    >
                        CAREERBRIDGE
                    </Typography>

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: 29,
                                sm: 37,
                            },
                            lineHeight: 1.15,
                            fontWeight: 900,
                            color: "#293241",
                            letterSpacing: "-0.8px",
                        }}
                    >
                        Apply for this job
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.8,
                            color: "#746B63",
                            fontSize: 14,
                        }}
                    >
                        Send your CV and application
                        details to the employer.
                    </Typography>
                </Box>

                {/* Job summary */}
                <Paper
                    elevation={0}
                    sx={{
                        position: "relative",
                        p: {
                            xs: 2.5,
                            sm: 3.5,
                        },
                        mb: {
                            xs: 2.5,
                            sm: 3,
                        },
                        borderRadius: 3,
                        border:
                            "1px solid #E9DED0",
                        backgroundColor:
                            "#FFFDF9",
                        overflow: "hidden",
                        boxShadow:
                            "0 8px 24px rgba(95, 75, 55, 0.06)",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 5,
                            backgroundColor:
                                "#E76F51",
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            justifyContent:
                                "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                            pl: 1,
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            <StackRow
                                icon={
                                    <Work
                                        sx={{
                                            fontSize: 18,
                                            color: "#E76F51",
                                        }}
                                    />
                                }
                                text="JOB APPLICATION"
                            />

                            <Typography
                                component="h2"
                                sx={{
                                    mt: 1,
                                    fontSize: {
                                        xs: 23,
                                        sm: 29,
                                    },
                                    lineHeight: 1.2,
                                    fontWeight: 900,
                                    color: "#293241",
                                    overflowWrap:
                                        "anywhere",
                                }}
                            >
                                {jobTitle}
                            </Typography>

                            <StackRow
                                icon={
                                    <Business
                                        sx={{
                                            fontSize: 18,
                                            color: "#6A994E",
                                        }}
                                    />
                                }
                                text={companyName}
                                sx={{
                                    mt: 1,
                                }}
                            />
                        </Box>

                        <Chip
                            label="Ready to apply"
                            sx={{
                                flexShrink: 0,
                                fontWeight: 800,
                                backgroundColor:
                                    "#FFF1D6",
                                color: "#9A5A16",
                                border:
                                    "1px solid #F5D7A8",
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
                            border:
                                "1px solid #C9DFC0",
                            backgroundColor:
                                "#F5FAF2",
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
                                fontWeight: 800,
                                borderRadius: 2,
                                backgroundColor:
                                    "#6A994E",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor:
                                        "#588441",
                                    boxShadow: "none",
                                },
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
                        border:
                            "1px solid #E9DED0",
                        backgroundColor:
                            "#FFFDF9",
                        overflow: "hidden",
                        boxShadow:
                            "0 10px 30px rgba(95, 75, 55, 0.07)",
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
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
                                <SectionHeading
                                    icon={
                                        <Description />
                                    }
                                    title="Select your CV"
                                />

                                <Typography
                                    sx={{
                                        color: "#746B63",
                                        fontSize: {
                                            xs: 13,
                                            sm: 14,
                                        },
                                        lineHeight: 1.6,
                                        mb: 3,
                                    }}
                                >
                                    Choose the CV you
                                    want to send with
                                    your application.
                                </Typography>

                                {loadingCVs ? (
                                    <Box
                                        sx={{
                                            py: 5,
                                            display:
                                                "flex",
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
                                            sx={{
                                                color: "#E76F51",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                mt: 1.5,
                                                fontSize: 13,
                                                color: "#746B63",
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
                                            border:
                                                "1px dashed #D8C8B8",
                                            backgroundColor:
                                                "#FFF8EF",
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                mx: "auto",
                                                mb: 1.5,
                                                borderRadius:
                                                    "50%",
                                                backgroundColor:
                                                    "#FFF1D6",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                            }}
                                        >
                                            <Description
                                                sx={{
                                                    fontSize: 30,
                                                    color: "#E76F51",
                                                }}
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 16,
                                                color: "#293241",
                                                mb: 0.8,
                                            }}
                                        >
                                            No CVs found
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#746B63",
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                maxWidth: 430,
                                                mx: "auto",
                                                mb: 2.5,
                                            }}
                                        >
                                            Upload a CV
                                            before you
                                            can apply for
                                            this position.
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
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                px: 2.5,
                                                backgroundColor:
                                                    "#E76F51",
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
                                            {cvs.map(
                                                (cv) => {
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
                                                                border:
                                                                    isSelected
                                                                        ? "2px solid #E76F51"
                                                                        : "1px solid #E9DED0",
                                                                backgroundColor:
                                                                    isSelected
                                                                        ? "#FFF8EF"
                                                                        : "#FFFDF9",
                                                                transition:
                                                                    "all 0.2s ease",
                                                                "&:hover":
                                                                    {
                                                                        borderColor:
                                                                            "#E76F51",
                                                                        backgroundColor:
                                                                            "#FFF8EF",
                                                                    },
                                                            }}
                                                        >
                                                            <FormControlLabel
                                                                value={String(
                                                                    cv.CVID
                                                                )}
                                                                control={
                                                                    <Radio
                                                                        sx={{
                                                                            color: "#D0C2B5",
                                                                            "&.Mui-checked":
                                                                                {
                                                                                    color: "#E76F51",
                                                                                },
                                                                        }}
                                                                    />
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
                                                                                <Description
                                                                                    sx={{
                                                                                        fontSize: 19,
                                                                                        color: "#E76F51",
                                                                                        flexShrink: 0,
                                                                                    }}
                                                                                />

                                                                                <Typography
                                                                                    sx={{
                                                                                        fontWeight: 800,
                                                                                        fontSize:
                                                                                            {
                                                                                                xs: 14,
                                                                                                sm: 15,
                                                                                            },
                                                                                        color: "#293241",
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
                                                                                    size="small"
                                                                                    sx={{
                                                                                        fontWeight: 800,
                                                                                        backgroundColor:
                                                                                            "#EDF4E8",
                                                                                        color: "#527A3D",
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Box>

                                                                        <Typography
                                                                            sx={{
                                                                                mt: 0.8,
                                                                                color: "#81776E",
                                                                                fontSize: 12,
                                                                            }}
                                                                        >
                                                                            Uploaded{" "}
                                                                            {cv.UploadDate
                                                                                ? new Date(
                                                                                      cv.UploadDate
                                                                                  ).toLocaleDateString(
                                                                                      "en-GH"
                                                                                  )
                                                                                : "recently"}
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                            />
                                                        </Paper>
                                                    );
                                                }
                                            )}
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
                                    borderColor:
                                        "#E9DED0",
                                }}
                            />

                            {/* Cover letter */}
                            <Box>
                                <SectionHeading
                                    icon={<Send />}
                                    title="Cover Letter"
                                />

                                <Typography
                                    sx={{
                                        color: "#746B63",
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
                                                    "#FFFDF9",
                                                fontSize: {
                                                    xs: 14,
                                                    sm: 15,
                                                },
                                                lineHeight: 1.6,
                                                "& fieldset":
                                                    {
                                                        borderColor:
                                                            "#DCCFC2",
                                                    },
                                                "&:hover fieldset":
                                                    {
                                                        borderColor:
                                                            "#C8B8A8",
                                                    },
                                                "&.Mui-focused fieldset":
                                                    {
                                                        borderColor:
                                                            "#E76F51",
                                                        borderWidth: 2,
                                                    },
                                            },
                                    }}
                                />

                                <Typography
                                    sx={{
                                        mt: 1,
                                        textAlign: "right",
                                        color: "#81776E",
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
                                    "1px solid #E9DED0",
                                backgroundColor:
                                    "#FFF8EF",
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
                                    textTransform:
                                        "none",
                                    fontSize: {
                                        xs: "0.95rem",
                                        sm: "1rem",
                                    },
                                    fontWeight: 800,
                                    backgroundColor:
                                        "#E76F51",
                                    boxShadow:
                                        "0 5px 14px rgba(231, 111, 81, 0.2)",
                                    "&:hover": {
                                        backgroundColor:
                                            "#D85F43",
                                        boxShadow:
                                            "0 6px 16px rgba(231, 111, 81, 0.25)",
                                    },
                                    "&.Mui-disabled":
                                        {
                                            backgroundColor:
                                                "#DCCFC2",
                                            color: "#81776E",
                                        },
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
                                    color: "#81776E",
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

const SectionHeading = ({ icon, title }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1,
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    backgroundColor: "#FFF1D6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {icon &&
                    typeof icon === "object" &&
                    {
                        ...icon.props,
                        props: {
                            ...icon.props,
                            sx: {
                                ...(icon.props?.sx || {}),
                                color: "#E76F51",
                                fontSize: 21,
                            },
                        },
                    }}
            </Box>

            <Typography
                component="h2"
                sx={{
                    fontSize: {
                        xs: 19,
                        sm: 21,
                    },
                    fontWeight: 900,
                    color: "#293241",
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

const StackRow = ({ icon, text, sx = {} }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                ...sx,
            }}
        >
            {icon}

            <Typography
                sx={{
                    color: "#746B63",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.7px",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default ApplyJob;