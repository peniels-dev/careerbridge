import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Add,
    ArrowBack,
    Close,
    Delete,
    Description,
    UploadFile,
    Visibility,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";

const MyCVs = () => {
    const navigate = useNavigate();

    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [cvTitle, setCvTitle] = useState("");
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================
    // GET MY CVS
    // ==========================

    const fetchCVs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/cvs");

            setCvs(response.data?.data || []);
        } catch (error) {
            console.error("Get CVs error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load your CVs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCVs();
    }, []);

    // ==========================
    // SELECT FILE
    // ==========================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Only PDF, DOC, and DOCX files are allowed."
            );
            setCvFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("CV file must be smaller than 5MB.");
            setCvFile(null);
            return;
        }

        setError("");
        setCvFile(file);

        if (!cvTitle.trim()) {
            setCvTitle(
                file.name.replace(/\.[^/.]+$/, "")
            );
        }
    };

    // ==========================
    // UPLOAD CV
    // ==========================

    const handleUpload = async () => {
        if (!cvFile) {
            setError("Please select a CV file.");
            return;
        }

        if (!cvTitle.trim()) {
            setError("Please enter a CV title.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append("cv", cvFile);
            formData.append("cvTitle", cvTitle.trim());

            await axiosAPI.post("/cvs", formData);

            setSuccess("CV uploaded successfully.");

            setCvFile(null);
            setCvTitle("");
            setUploadOpen(false);

            await fetchCVs();
        } catch (error) {
            console.error("Upload CV error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to upload CV."
            );
        } finally {
            setUploading(false);
        }
    };

    // ==========================
    // VIEW CV
    // ==========================

    const handleViewCV = async (cvId) => {
        try {
            setError("");

            const response = await axiosAPI.get(
                `/cvs/${cvId}`,
                {
                    responseType: "blob",
                }
            );

            const fileURL = URL.createObjectURL(
                new Blob([response.data])
            );

            window.open(fileURL, "_blank");
        } catch (error) {
            console.error("View CV error:", error);

            setError("Unable to open this CV.");
        }
    };

    // ==========================
    // DELETE CV
    // ==========================

    const handleDeleteCV = async (cvId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this CV?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await axiosAPI.delete(`/cvs/${cvId}`);

            setSuccess("CV deleted successfully.");

            setCvs((currentCVs) =>
                currentCVs.filter(
                    (cv) => cv.CVID !== cvId
                )
            );
        } catch (error) {
            console.error("Delete CV error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to delete CV."
            );
        }
    };

    // ==========================
    // OPEN UPLOAD DIALOG
    // ==========================

    const openUploadDialog = () => {
        setError("");
        setSuccess("");
        setCvFile(null);
        setCvTitle("");
        setUploadOpen(true);
    };

    // ==========================
    // CLOSE UPLOAD DIALOG
    // ==========================

    const closeUploadDialog = () => {
        if (uploading) {
            return;
        }

        setUploadOpen(false);
        setCvFile(null);
        setCvTitle("");
    };

    // ==========================
    // LOADING
    // ==========================

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
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={42} />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#667085",
                            fontSize: 14,
                        }}
                    >
                        Loading your CVs...
                    </Typography>
                </Box>
            </Box>
        );
    }

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
                maxWidth="lg"
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* ==========================
                    PAGE HEADER
                ========================== */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "stretch",
                            sm: "center",
                        },
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 2.5,
                        mb: {
                            xs: 3,
                            sm: 4,
                        },
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                mb: 1.5,
                                px: 0,
                                textTransform: "none",
                                fontWeight: 700,
                                color: "#2563eb",
                                "&:hover": {
                                    backgroundColor:
                                        "transparent",
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: 28,
                                    sm: 34,
                                    md: 40,
                                },
                                lineHeight: 1.15,
                                fontWeight: 800,
                                color: "#111827",
                                letterSpacing: "-0.7px",
                                mb: 1,
                            }}
                        >
                            My CVs
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                fontSize: {
                                    xs: 13,
                                    sm: 15,
                                },
                                lineHeight: 1.6,
                                maxWidth: 620,
                            }}
                        >
                            Manage your CVs and keep them
                            ready for your next opportunity.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={openUploadDialog}
                        sx={{
                            minHeight: 46,
                            px: {
                                xs: 2,
                                sm: 2.5,
                            },
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 14,
                            alignSelf: {
                                xs: "stretch",
                                sm: "auto",
                            },
                            boxShadow:
                                "0 4px 12px rgba(37, 99, 235, 0.18)",
                        }}
                    >
                        Upload New CV
                    </Button>
                </Box>

                {/* ==========================
                    ALERTS
                ========================== */}

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

                {success && (
                    <Alert
                        severity="success"
                        onClose={() => setSuccess("")}
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                    >
                        {success}
                    </Alert>
                )}

                {/* ==========================
                    INFORMATION CARD
                ========================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 3,
                        },
                        mb: {
                            xs: 3,
                            sm: 4,
                        },
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: {
                                    xs: 44,
                                    sm: 48,
                                },
                                height: {
                                    xs: 44,
                                    sm: 48,
                                },
                                minWidth: {
                                    xs: 44,
                                    sm: 48,
                                },
                                borderRadius: 2,
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Description />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#111827",
                                    fontSize: {
                                        xs: 14,
                                        sm: 15,
                                    },
                                }}
                            >
                                Keep your CVs organized
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#667085",
                                    mt: 0.3,
                                    fontSize: {
                                        xs: 12,
                                        sm: 13,
                                    },
                                    lineHeight: 1.6,
                                }}
                            >
                                Upload different versions
                                of your CV for different
                                types of opportunities.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* ==========================
                    NO CVS
                ========================== */}

                {cvs.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 3,
                                sm: 5,
                                md: 7,
                            },
                            textAlign: "center",
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <Box
                            sx={{
                                width: {
                                    xs: 68,
                                    sm: 80,
                                },
                                height: {
                                    xs: 68,
                                    sm: 80,
                                },
                                borderRadius: "50%",
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 2.5,
                            }}
                        >
                            <Description
                                sx={{
                                    fontSize: {
                                        xs: 36,
                                        sm: 42,
                                    },
                                }}
                            />
                        </Box>

                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 20,
                                    sm: 24,
                                },
                                fontWeight: 800,
                                color: "#111827",
                                mb: 1,
                            }}
                        >
                            You haven't uploaded any CVs yet
                        </Typography>

                        <Typography
                            sx={{
                                color: "#667085",
                                maxWidth: 520,
                                mx: "auto",
                                lineHeight: 1.7,
                                fontSize: {
                                    xs: 13,
                                    sm: 14,
                                },
                                mb: 3,
                            }}
                        >
                            Upload your CV so you can
                            quickly select it when applying
                            for jobs on CareerBridge.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<UploadFile />}
                            onClick={openUploadDialog}
                            sx={{
                                minHeight: 44,
                                px: 3,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Upload Your First CV
                        </Button>
                    </Paper>
                ) : (
                    <>
                        {/* ==========================
                            CV COUNT
                        ========================== */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                mb: 2,
                                gap: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#475467",
                                    fontWeight: 700,
                                    fontSize: {
                                        xs: 14,
                                        sm: 15,
                                    },
                                }}
                            >
                                {cvs.length}{" "}
                                {cvs.length === 1
                                    ? "CV"
                                    : "CVs"}{" "}
                                uploaded
                            </Typography>
                        </Box>

                        {/* ==========================
                            CV CARDS
                        ========================== */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))",
                                },
                                gap: {
                                    xs: 2,
                                    sm: 2.5,
                                    md: 3,
                                },
                            }}
                        >
                            {cvs.map((cv) => (
                                <Paper
                                    key={cv.CVID}
                                    elevation={0}
                                    sx={{
                                        p: {
                                            xs: 2.5,
                                            sm: 3,
                                        },
                                        borderRadius: 3,
                                        border:
                                            "1px solid #e5e7eb",
                                        backgroundColor:
                                            "#ffffff",
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        minWidth: 0,
                                        minHeight: {
                                            xs: 235,
                                            sm: 260,
                                        },
                                        transition:
                                            "transform 0.2s ease, box-shadow 0.2s ease",
                                        "&:hover": {
                                            transform:
                                                "translateY(-3px)",
                                            boxShadow:
                                                "0 10px 25px rgba(16, 24, 40, 0.08)",
                                            borderColor:
                                                "#bfdbfe",
                                        },
                                    }}
                                >
                                    {/* CV ICON */}

                                    <Box
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            backgroundColor:
                                                "#eff6ff",
                                            color: "#2563eb",
                                            mb: 2,
                                        }}
                                    >
                                        <Description
                                            sx={{
                                                fontSize: 30,
                                            }}
                                        />
                                    </Box>

                                    {/* TITLE */}

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 17,
                                                sm: 18,
                                            },
                                            fontWeight: 800,
                                            color: "#111827",
                                            mb: 1,
                                            overflow:
                                                "hidden",
                                            textOverflow:
                                                "ellipsis",
                                            whiteSpace:
                                                "nowrap",
                                        }}
                                        title={
                                            cv.CVTitle ||
                                            "Untitled CV"
                                        }
                                    >
                                        {cv.CVTitle ||
                                            "Untitled CV"}
                                    </Typography>

                                    <Chip
                                        label="CV"
                                        size="small"
                                        sx={{
                                            width: "fit-content",
                                            mb: 2,
                                            fontWeight: 600,
                                            backgroundColor:
                                                "#f2f4f7",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            color: "#667085",
                                            fontSize: 13,
                                            mb: 2.5,
                                        }}
                                    >
                                        Uploaded{" "}
                                        {cv.UploadDate
                                            ? new Date(
                                                  cv.UploadDate
                                              ).toLocaleDateString()
                                            : "Unknown"}
                                    </Typography>

                                    <Box
                                        sx={{
                                            flex: 1,
                                        }}
                                    />

                                    <Divider
                                        sx={{
                                            mb: 2,
                                        }}
                                    />

                                    {/* BUTTONS */}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={
                                                <Visibility />
                                            }
                                            onClick={() =>
                                                handleViewCV(
                                                    cv.CVID
                                                )
                                            }
                                            sx={{
                                                minHeight: 42,
                                                textTransform:
                                                    "none",
                                                fontWeight: 700,
                                                borderRadius: 2,
                                                fontSize: {
                                                    xs: 13,
                                                    sm: 14,
                                                },
                                            }}
                                        >
                                            View CV
                                        </Button>

                                        <IconButton
                                            aria-label="Delete CV"
                                            onClick={() =>
                                                handleDeleteCV(
                                                    cv.CVID
                                                )
                                            }
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                flexShrink: 0,
                                                borderRadius: 2,
                                                border:
                                                    "1px solid #fecaca",
                                                color: "#dc2626",
                                                "&:hover":
                                                    {
                                                        backgroundColor:
                                                            "#fef2f2",
                                                        borderColor:
                                                            "#fca5a5",
                                                    },
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </>
                )}
            </Container>

            {/* ==========================
                UPLOAD DIALOG
            ========================== */}

            <Dialog
                open={uploadOpen}
                onClose={closeUploadDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: {
                            xs: 2.5,
                            sm: 3,
                        },
                        m: {
                            xs: 1.5,
                            sm: 3,
                        },
                        width: {
                            xs: "calc(100% - 24px)",
                            sm: "100%",
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        fontWeight: 800,
                        color: "#111827",
                        fontSize: {
                            xs: 19,
                            sm: 21,
                        },
                        pb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            minWidth: 0,
                        }}
                    >
                        <UploadFile
                            color="primary"
                        />

                        <span>Upload New CV</span>
                    </Box>

                    <IconButton
                        onClick={closeUploadDialog}
                        disabled={uploading}
                        size="small"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    sx={{
                        pt: 1.5,
                    }}
                >
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
                        Add a title and select the CV you
                        want to upload.
                    </Typography>

                    <TextField
                        fullWidth
                        label="CV Title"
                        placeholder="e.g. Software Developer CV"
                        value={cvTitle}
                        onChange={(event) =>
                            setCvTitle(
                                event.target.value
                            )
                        }
                        disabled={uploading}
                        sx={{
                            mb: 2.5,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />

                    <Button
                        component="label"
                        variant="outlined"
                        fullWidth
                        startIcon={<UploadFile />}
                        disabled={uploading}
                        sx={{
                            minHeight: {
                                xs: 72,
                                sm: 80,
                            },
                            px: 2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderStyle: "dashed",
                            borderWidth: 2,
                            overflow: "hidden",
                            "&:hover": {
                                borderWidth: 2,
                                backgroundColor:
                                    "#eff6ff",
                            },
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {cvFile
                                ? cvFile.name
                                : "Choose CV File"}
                        </Box>

                        <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                    </Button>

                    <Typography
                        sx={{
                            display: "block",
                            mt: 1.5,
                            color: "#667085",
                            fontSize: 12,
                        }}
                    >
                        PDF, DOC or DOCX • Maximum 5MB
                    </Typography>

                    {cvFile && (
                        <Alert
                            severity="success"
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                overflowWrap:
                                    "anywhere",
                            }}
                        >
                            {cvFile.name} selected
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: {
                            xs: 2.5,
                            sm: 3,
                        },
                        pb: {
                            xs: 2.5,
                            sm: 3,
                        },
                        gap: 1,
                        flexDirection: {
                            xs: "column-reverse",
                            sm: "row",
                        },
                        alignItems: "stretch",
                    }}
                >
                    <Button
                        onClick={closeUploadDialog}
                        disabled={uploading}
                        sx={{
                            minHeight: 44,
                            px: 3,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            color: "#667085",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={uploading}
                        startIcon={
                            uploading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <UploadFile />
                            )
                        }
                        sx={{
                            minHeight: 44,
                            px: 3,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload CV"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyCVs;