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

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [cvToDelete, setCvToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

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

            const contentType =
                response.headers["content-type"] ||
                "application/pdf";

            const fileBlob = new Blob(
                [response.data],
                {
                    type: contentType,
                }
            );

            const fileURL =
                URL.createObjectURL(fileBlob);

            const newWindow = window.open(
                fileURL,
                "_blank"
            );

            if (!newWindow) {
                setError(
                    "Your browser blocked the CV window. Please allow pop-ups for CareerBridge."
                );

                URL.revokeObjectURL(fileURL);
                return;
            }

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);
        } catch (error) {
            console.error("View CV error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to open this CV."
            );
        }
    };

    // ==========================
    // OPEN DELETE DIALOG
    // ==========================

    const openDeleteDialog = (cv) => {
        setError("");
        setSuccess("");
        setCvToDelete(cv);
        setDeleteOpen(true);
    };

    // ==========================
    // CLOSE DELETE DIALOG
    // ==========================

    const closeDeleteDialog = () => {
        if (deleting) {
            return;
        }

        setDeleteOpen(false);
        setCvToDelete(null);
    };

    // ==========================
    // DELETE CV
    // ==========================

    const handleDeleteCV = async () => {
        if (!cvToDelete) {
            return;
        }

        try {
            setDeleting(true);
            setError("");
            setSuccess("");

            await axiosAPI.delete(
                `/cvs/${cvToDelete.CVID}`
            );

            setSuccess("CV deleted successfully.");

            setCvs((currentCVs) =>
                currentCVs.filter(
                    (cv) =>
                        cv.CVID !== cvToDelete.CVID
                )
            );

            setDeleteOpen(false);
            setCvToDelete(null);
        } catch (error) {
            console.error("Delete CV error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to delete CV."
            );
        } finally {
            setDeleting(false);
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
                            width: 64,
                            height: 64,
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
                            sx={{
                                color: "#E76F51",
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            color: "#6F665F",
                            fontSize: 14,
                            fontWeight: 600,
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
                                color: "#E76F51",
                                "&:hover": {
                                    backgroundColor:
                                        "transparent",
                                    color: "#D85F43",
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: 30,
                                    sm: 36,
                                    md: 42,
                                },
                                lineHeight: 1.12,
                                fontWeight: 900,
                                color: "#293241",
                                letterSpacing: "-1px",
                                mb: 1,
                            }}
                        >
                            My CVs
                        </Typography>

                        <Typography
                            sx={{
                                color: "#746B63",
                                fontSize: {
                                    xs: 13,
                                    sm: 15,
                                },
                                lineHeight: 1.7,
                                maxWidth: 620,
                            }}
                        >
                            Keep your CVs organized and
                            ready for your next opportunity.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={openUploadDialog}
                        sx={{
                            minHeight: 48,
                            px: {
                                xs: 2,
                                sm: 2.7,
                            },
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: 14,
                            alignSelf: {
                                xs: "stretch",
                                sm: "auto",
                            },
                            backgroundColor: "#E76F51",
                            boxShadow:
                                "0 6px 16px rgba(231, 111, 81, 0.18)",
                            "&:hover": {
                                backgroundColor:
                                    "#D85F43",
                                boxShadow:
                                    "0 8px 20px rgba(231, 111, 81, 0.22)",
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
                        onClose={() => setError("")}
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            border: "1px solid #F1C4BB",
                            backgroundColor: "#FFF3F0",
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
                            border: "1px solid #CFE0C5",
                            backgroundColor: "#F3F8EF",
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
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            backgroundColor: "#F4A261",
                        }}
                    />

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
                                    xs: 46,
                                    sm: 50,
                                },
                                height: {
                                    xs: 46,
                                    sm: 50,
                                },
                                minWidth: {
                                    xs: 46,
                                    sm: 50,
                                },
                                borderRadius: 2,
                                backgroundColor: "#FFF1D6",
                                color: "#E76F51",
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
                                    fontWeight: 800,
                                    color: "#293241",
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
                                    color: "#746B63",
                                    mt: 0.4,
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
                            border: "1px solid #E9DED0",
                            backgroundColor: "#FFFDF9",
                        }}
                    >
                        <Box
                            sx={{
                                width: {
                                    xs: 72,
                                    sm: 84,
                                },
                                height: {
                                    xs: 72,
                                    sm: 84,
                                },
                                borderRadius: "50%",
                                backgroundColor: "#FFF1D6",
                                color: "#E76F51",
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
                                        xs: 38,
                                        sm: 44,
                                    },
                                }}
                            />
                        </Box>

                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: 21,
                                    sm: 25,
                                },
                                fontWeight: 900,
                                color: "#293241",
                                mb: 1,
                            }}
                        >
                            You haven't uploaded any CVs yet
                        </Typography>

                        <Typography
                            sx={{
                                color: "#746B63",
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
                                fontWeight: 800,
                                backgroundColor: "#E76F51",
                                "&:hover": {
                                    backgroundColor:
                                        "#D85F43",
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
                                    color: "#5F554D",
                                    fontWeight: 800,
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
                                            "1px solid #E9DED0",
                                        backgroundColor:
                                            "#FFFDF9",
                                        display: "flex",
                                        flexDirection:
                                            "column",
                                        minWidth: 0,
                                        minHeight: {
                                            xs: 245,
                                            sm: 265,
                                        },
                                        position: "relative",
                                        overflow: "hidden",
                                        transition:
                                            "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                                        "&:hover": {
                                            transform:
                                                "translateY(-3px)",
                                            boxShadow:
                                                "0 12px 28px rgba(91, 71, 55, 0.10)",
                                            borderColor:
                                                "#E7B6A8",
                                        },
                                    }}
                                >
                                    {/* TOP ACCENT */}

                                    <Box
                                        sx={{
                                            position:
                                                "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            backgroundColor:
                                                "#E76F51",
                                        }}
                                    />

                                    {/* CV ICON */}

                                    <Box
                                        sx={{
                                            width: 54,
                                            height: 54,
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            backgroundColor:
                                                "#FFF1D6",
                                            color: "#E76F51",
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
                                            fontWeight: 900,
                                            color: "#293241",
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
                                            fontWeight: 700,
                                            backgroundColor:
                                                "#EDF4E8",
                                            color: "#557E3E",
                                            border:
                                                "1px solid #D5E5CB",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            color: "#7A7068",
                                            fontSize: 13,
                                            mb: 2.5,
                                        }}
                                    >
                                        Uploaded{" "}
                                        {cv.UploadDate
                                            ? new Date(
                                                  cv.UploadDate
                                              ).toLocaleDateString(
                                                  "en-GH",
                                                  {
                                                      day: "numeric",
                                                      month: "short",
                                                      year: "numeric",
                                                  }
                                              )
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
                                            borderColor:
                                                "#E9DED0",
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
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                fontSize: {
                                                    xs: 13,
                                                    sm: 14,
                                                },
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
                                            View CV
                                        </Button>

                                        <IconButton
                                            aria-label="Delete CV"
                                            onClick={() =>
                                                openDeleteDialog(
                                                    cv
                                                )
                                            }
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                flexShrink: 0,
                                                borderRadius: 2,
                                                border:
                                                    "1px solid #E8B9B0",
                                                color: "#C95543",
                                                "&:hover": {
                                                    backgroundColor:
                                                        "#FFF0ED",
                                                    borderColor:
                                                        "#D99184",
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
                        backgroundColor: "#FFFDF9",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        fontWeight: 900,
                        color: "#293241",
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
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                backgroundColor:
                                    "#FFF1D6",
                                color: "#E76F51",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <UploadFile
                                fontSize="small"
                            />
                        </Box>

                        <span>Upload New CV</span>
                    </Box>

                    <IconButton
                        onClick={closeUploadDialog}
                        disabled={uploading}
                        size="small"
                        sx={{
                            color: "#746B63",
                        }}
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
                            color: "#746B63",
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
                                backgroundColor:
                                    "#FFFFFF",
                                "&.Mui-focused fieldset": {
                                    borderColor:
                                        "#E76F51",
                                },
                            },
                            "& .MuiInputLabel-root.Mui-focused":
                                {
                                    color: "#E76F51",
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
                                xs: 78,
                                sm: 86,
                            },
                            px: 2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#5F554D",
                            borderColor: "#DCCFC2",
                            borderStyle: "dashed",
                            borderWidth: 2,
                            overflow: "hidden",
                            backgroundColor: "#FFFBF5",
                            "&:hover": {
                                borderWidth: 2,
                                borderColor:
                                    "#E76F51",
                                backgroundColor:
                                    "#FFF5EA",
                            },
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow:
                                    "ellipsis",
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
                            onChange={
                                handleFileChange
                            }
                        />
                    </Button>

                    <Typography
                        sx={{
                            display: "block",
                            mt: 1.5,
                            color: "#7A7068",
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
                                backgroundColor:
                                    "#F3F8EF",
                                border:
                                    "1px solid #CFE0C5",
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
                            color: "#746B63",
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
                            fontWeight: 800,
                            borderRadius: 2,
                            backgroundColor: "#E76F51",
                            "&:hover": {
                                backgroundColor:
                                    "#D85F43",
                            },
                        }}
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload CV"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==========================
                DELETE CONFIRMATION DIALOG
            ========================== */}

            <Dialog
                open={deleteOpen}
                onClose={closeDeleteDialog}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        backgroundColor: "#FFFDF9",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        fontWeight: 900,
                        color: "#293241",
                    }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#FFF0ED",
                            color: "#C95543",
                            flexShrink: 0,
                        }}
                    >
                        <Delete />
                    </Box>

                    Delete CV?
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{
                            color: "#746B63",
                            fontSize: 14,
                            lineHeight: 1.7,
                        }}
                    >
                        Are you sure you want to delete{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            {cvToDelete?.CVTitle ||
                                "this CV"}
                        </Box>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 2.5,
                        pb: 2.5,
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={closeDeleteDialog}
                        disabled={deleting}
                        sx={{
                            minHeight: 42,
                            px: 2.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#5F554D",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleDeleteCV}
                        disabled={deleting}
                        startIcon={
                            deleting ? (
                                <CircularProgress
                                    size={17}
                                    color="inherit"
                                />
                            ) : (
                                <Delete />
                            )
                        }
                        sx={{
                            minHeight: 42,
                            px: 2.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 800,
                            backgroundColor: "#C95543",
                            "&:hover": {
                                backgroundColor:
                                    "#B54736",
                            },
                        }}
                    >
                        {deleting
                            ? "Deleting..."
                            : "Yes, Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyCVs;