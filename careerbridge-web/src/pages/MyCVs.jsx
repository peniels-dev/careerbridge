import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Stack,
    Divider,
} from "@mui/material";

import {
    UploadFile,
    Visibility,
    Delete,
    Description,
    Close,
    Add,
    ArrowBack,
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

            setCvs(response.data.data || []);
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
        const file = event.target.files[0];

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

        if (!cvTitle) {
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
            formData.append("cvTitle", cvTitle);

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
    // LOADING
    // ==========================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#f5f7fb",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
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
            <Container maxWidth="lg">

                {/* ==========================
                    TOP NAVIGATION
                ========================== */}

                <Box
                    sx={{
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
                        mb: 4,
                    }}
                >
                    <Box>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                mb: 1.5,
                                textTransform: "none",
                                fontWeight: 700,
                                color: "#2563eb",
                                px: 0,
                                "&:hover": {
                                    backgroundColor:
                                        "transparent",
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#111827",
                                mb: 0.8,
                            }}
                        >
                            My CVs
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#6b7280",
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
                        Upload New CV
                    </Button>
                </Box>

                {/* ==========================
                    ALERTS
                ========================== */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                        onClose={() => setSuccess("")}
                    >
                        {success}
                    </Alert>
                )}

                {/* ==========================
                    PAGE INTRO CARD
                ========================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        backgroundColor: "white",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                minWidth: 48,
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

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                Keep your CVs organized
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#6b7280",
                                    mt: 0.3,
                                }}
                            >
                                Upload different versions of
                                your CV for different types of
                                opportunities.
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* ==========================
                    NO CVS
                ========================== */}

                {cvs.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 4,
                                sm: 7,
                            },
                            textAlign: "center",
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 3,
                            }}
                        >
                            <Description
                                sx={{ fontSize: 42 }}
                            />
                        </Box>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: "#111827",
                                mb: 1,
                            }}
                        >
                            You haven't uploaded any CVs yet
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6b7280",
                                maxWidth: 500,
                                mx: "auto",
                                lineHeight: 1.7,
                                mb: 3,
                            }}
                        >
                            Upload your CV so you can quickly
                            select it when applying for jobs on
                            CareerBridge.
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
                                backgroundColor: "#2563eb",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#1d4ed8",
                                    boxShadow: "none",
                                },
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

                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#6b7280",
                                    fontWeight: 600,
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
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            {cvs.map((cv) => (
                                <Paper
                                    key={cv.CVID}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border:
                                            "1px solid #e5e7eb",
                                        backgroundColor:
                                            "white",
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        minHeight: 260,
                                        transition:
                                            "all 0.2s ease",
                                        "&:hover": {
                                            transform:
                                                "translateY(-3px)",
                                            boxShadow:
                                                "0 8px 25px rgba(0,0,0,0.07)",
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

                                    {/* CV TITLE */}

                                    <Typography
                                        variant="h6"
                                        sx={{
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
                                                "#f3f4f6",
                                        }}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#6b7280",
                                            mb: 3,
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

                                    <Divider sx={{ mb: 2 }} />

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
                                                backgroundColor:
                                                    "#2563eb",
                                                boxShadow:
                                                    "none",
                                                "&:hover": {
                                                    backgroundColor:
                                                        "#1d4ed8",
                                                    boxShadow:
                                                        "none",
                                                },
                                            }}
                                        >
                                            View CV
                                        </Button>

                                        <IconButton
                                            onClick={() =>
                                                handleDeleteCV(
                                                    cv.CVID
                                                )
                                            }
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 2,
                                                border:
                                                    "1px solid #fecaca",
                                                color: "#dc2626",
                                                "&:hover": {
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
                onClose={() => {
                    if (!uploading) {
                        setUploadOpen(false);
                    }
                }}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        fontWeight: 800,
                        color: "#111827",
                    }}
                >
                    Upload New CV

                    <IconButton
                        onClick={() =>
                            setUploadOpen(false)
                        }
                        disabled={uploading}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#6b7280",
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
                        onChange={(e) =>
                            setCvTitle(e.target.value)
                        }
                        sx={{ mb: 3 }}
                    />

                    <Button
                        component="label"
                        variant="outlined"
                        fullWidth
                        startIcon={<UploadFile />}
                        sx={{
                            minHeight: 70,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderStyle: "dashed",
                            borderWidth: 2,
                            color: "#2563eb",
                            "&:hover": {
                                borderWidth: 2,
                                backgroundColor: "#eff6ff",
                            },
                        }}
                    >
                        {cvFile
                            ? cvFile.name
                            : "Choose CV File"}

                        <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                    </Button>

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 1.5,
                            color: "#6b7280",
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
                            }}
                        >
                            {cvFile.name} selected
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={() =>
                            setUploadOpen(false)
                        }
                        disabled={uploading}
                        sx={{
                            minHeight: 44,
                            px: 3,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            color: "#6b7280",
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
                            backgroundColor: "#2563eb",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#1d4ed8",
                                boxShadow: "none",
                            },
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