import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Business,
    CameraAlt,
    Dashboard,
    Description,
    Edit,
    ExitToApp,
    People,
    Save,
    Work,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const CompanyProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [company, setCompany] = useState(null);

    const [formData, setFormData] = useState({
        CompanyName: "",
        Email: "",
        Phone: "",
        Address: "",
        Description: "",
        CompanyWebsite: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [logoPreview, setLogoPreview] = useState("");

    const backendURL = "http://localhost:5138";

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // =====================================================
    // LOGO URL
    // =====================================================

    const getLogoURL = (logoPath) => {
        if (!logoPath) {
            return "";
        }

        if (logoPath.startsWith("http")) {
            return logoPath;
        }

        return `${backendURL}${logoPath}`;
    };

    // =====================================================
    // LOAD COMPANY
    // =====================================================

    const fetchCompany = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axiosAPI.get("/companies/me");

            const data = response.data?.data;

            if (data) {
                setCompany(data);

                setFormData({
                    CompanyName: data.CompanyName || "",
                    Email: data.Email || "",
                    Phone: data.Phone || "",
                    Address: data.Address || "",
                    Description: data.Description || "",
                    CompanyWebsite: data.CompanyWebsite || "",
                });

                if (data.CompanyLogo) {
                    setLogoPreview(getLogoURL(data.CompanyLogo));
                }
            }
        } catch (err) {
            // 404 simply means this employer has not created
            // a company profile yet.
            if (err.response?.status === 404) {
                setCompany(null);
                setFormData({
                    CompanyName: "",
                    Email: user?.Email || "",
                    Phone: "",
                    Address: "",
                    Description: "",
                    CompanyWebsite: "",
                });
            } else {
                setError(
                    err.response?.data?.message ||
                        "Unable to load company profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    // =====================================================
    // FORM INPUT
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // CREATE / UPDATE COMPANY
    // =====================================================

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!formData.CompanyName.trim()) {
                setError("Company name is required.");
                setSaving(false);
                return;
            }

            if (!formData.Email.trim()) {
                setError("Company email is required.");
                setSaving(false);
                return;
            }

            let response;

            if (company) {
                // Existing company
                response = await axiosAPI.put(
                    "/companies/me",
                    formData
                );
            } else {
                // New company
                response = await axiosAPI.post(
                    "/companies/me",
                    formData
                );
            }

            const updatedCompany = response.data?.data;

            if (updatedCompany) {
                setCompany(updatedCompany);

                setFormData({
                    CompanyName: updatedCompany.CompanyName || "",
                    Email: updatedCompany.Email || "",
                    Phone: updatedCompany.Phone || "",
                    Address: updatedCompany.Address || "",
                    Description:
                        updatedCompany.Description || "",
                    CompanyWebsite:
                        updatedCompany.CompanyWebsite || "",
                });

                if (updatedCompany.CompanyLogo) {
                    setLogoPreview(
                        getLogoURL(updatedCompany.CompanyLogo)
                    );
                }
            }

            setSuccess(
                company
                    ? "Company profile updated successfully."
                    : "Company profile created successfully."
            );
        } catch (err) {
            console.error("Save company error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to save company profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOGO UPLOAD
    // =====================================================

    const handleLogoChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccess("");

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Only PNG, JPG, JPEG, and WEBP image files are allowed."
            );

            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Company logo must be smaller than 2 MB.");

            event.target.value = "";
            return;
        }

        // Show preview immediately
        const previewURL = URL.createObjectURL(file);
        setLogoPreview(previewURL);

        const formDataToUpload = new FormData();

        formDataToUpload.append("logo", file);

        try {
            setUploadingLogo(true);

            const response = await axiosAPI.post(
                "/companies/me/logo",
                formDataToUpload
            );

            const updatedCompany = response.data?.data;

            if (updatedCompany) {
                setCompany(updatedCompany);

                setFormData({
                    CompanyName: updatedCompany.CompanyName || "",
                    Email: updatedCompany.Email || "",
                    Phone: updatedCompany.Phone || "",
                    Address: updatedCompany.Address || "",
                    Description:
                        updatedCompany.Description || "",
                    CompanyWebsite:
                        updatedCompany.CompanyWebsite || "",
                });

                if (updatedCompany.CompanyLogo) {
                    setLogoPreview(
                        getLogoURL(updatedCompany.CompanyLogo)
                    );
                }
            }

            setSuccess("Company logo uploaded successfully.");
        } catch (err) {
            console.error("Logo upload error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to upload company logo."
            );

            setLogoPreview("");
        } finally {
            setUploadingLogo(false);
            event.target.value = "";
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fb",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // SIDEBAR
    // =====================================================

    const sidebarItem = (icon, label, path, active = false) => (
        <Button
            fullWidth
            onClick={() => navigate(path)}
            startIcon={icon}
            sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                px: 2,
                py: 1.4,
                mb: 0.6,
                borderRadius: 2,
                color: active
                    ? "#ffffff"
                    : "rgba(255,255,255,0.72)",
                backgroundColor: active
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                "&:hover": {
                    backgroundColor:
                        "rgba(255,255,255,0.09)",
                    color: "#ffffff",
                },
            }}
        >
            {label}
        </Button>
    );

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                backgroundColor: "#f5f7fb",
            }}
        >
            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Box
                sx={{
                    width: 250,
                    background:
                        "linear-gradient(180deg, #111827 0%, #172033 100%)",
                    color: "#ffffff",
                    display: {
                        xs: "none",
                        md: "flex",
                    },
                    flexDirection: "column",
                    p: 2,
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                {/* Logo */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        px: 1,
                        py: 2,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background:
                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 20,
                        }}
                    >
                        C
                    </Box>

                    <Box>
                        <Typography
                            fontWeight={800}
                            fontSize={18}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            fontSize={11}
                            color="rgba(255,255,255,0.55)"
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: "rgba(255,255,255,0.4)",
                        px: 1,
                        mb: 1,
                    }}
                >
                    Main Menu
                </Typography>

                {sidebarItem(
                    <Dashboard />,
                    "Dashboard",
                    "/employer-dashboard"
                )}

                {sidebarItem(
                    <Work />,
                    "My Job Postings",
                    "/employer/jobs"
                )}

                {sidebarItem(
                    <Description />,
                    "Post a Job",
                    "/employer/post-job"
                )}

                {sidebarItem(
                    <People />,
                    "Applicants",
                    "/employer/jobs"
                )}

                {sidebarItem(
                    <Business />,
                    "Company Profile",
                    "/company-profile",
                    true
                )}

                <Box sx={{ flexGrow: 1 }} />

                <Divider
                    sx={{
                        borderColor:
                            "rgba(255,255,255,0.1)",
                        mb: 1,
                    }}
                />

                {sidebarItem(
                    <ExitToApp />,
                    "Logout",
                    "#"
                )}

                {/* Override logout navigation */}
                <Box
                    onClick={handleLogout}
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        right: 16,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        borderRadius: 2,
                        color: "rgba(255,255,255,0.72)",
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor:
                                "rgba(255,255,255,0.09)",
                            color: "#ffffff",
                        },
                    }}
                >
                    <ExitToApp fontSize="small" />

                    <Typography fontSize={14}>
                        Logout
                    </Typography>
                </Box>
            </Box>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Box
                sx={{
                    flex: 1,
                    ml: {
                        xs: 0,
                        md: "250px",
                    },
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 4,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                    }}
                >
                    <Box>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate(
                                    "/employer-dashboard"
                                )
                            }
                            sx={{
                                textTransform: "none",
                                mb: 1,
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Typography
                            variant="h4"
                            fontWeight={800}
                            color="#111827"
                        >
                            Company Profile
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {company
                                ? "Manage your company information and branding."
                                : "Create your company profile to start posting jobs."}
                        </Typography>
                    </Box>
                </Box>

                {/* Alerts */}

                <Stack spacing={2} sx={{ mb: 3 }}>
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            onClose={() =>
                                setSuccess("")
                            }
                        >
                            {success}
                        </Alert>
                    )}
                </Stack>

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            height: 150,
                            background:
                                "linear-gradient(135deg, #111827 0%, #2563eb 100%)",
                        }}
                    />

                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 4,
                            },
                            pb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "flex-end",
                                },
                                gap: 2,
                                mt: -6,
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                            }}
                        >
                            {/* Logo */}

                            <Box sx={{ position: "relative" }}>
                                <Avatar
                                    src={logoPreview}
                                    sx={{
                                        width: 110,
                                        height: 110,
                                        bgcolor: "#ffffff",
                                        color: "#2563eb",
                                        border:
                                            "5px solid #ffffff",
                                        boxShadow:
                                            "0 6px 20px rgba(0,0,0,0.15)",
                                        fontSize: 40,
                                    }}
                                >
                                    <Business fontSize="large" />
                                </Avatar>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={
                                        handleLogoChange
                                    }
                                />

                                <Button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploadingLogo}
                                    sx={{
                                        position: "absolute",
                                        bottom: -8,
                                        right: -8,
                                        minWidth: 38,
                                        width: 38,
                                        height: 38,
                                        borderRadius: "50%",
                                        bgcolor: "#2563eb",
                                        color: "#ffffff",
                                        "&:hover": {
                                            bgcolor: "#1d4ed8",
                                        },
                                    }}
                                >
                                    {uploadingLogo ? (
                                        <CircularProgress
                                            size={18}
                                            sx={{
                                                color: "#ffffff",
                                            }}
                                        />
                                    ) : (
                                        <CameraAlt fontSize="small" />
                                    )}
                                </Button>
                            </Box>

                            <Box
                                sx={{
                                    pb: 1,
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                >
                                    {company?.CompanyName ||
                                        "Create Your Company Profile"}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    {company
                                        ? company.Email
                                        : "Add your company information below"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* =================================================
                    COMPANY INFORMATION
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        p: {
                            xs: 2,
                            sm: 4,
                        },
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                        >
                            Company Information
                        </Typography>

                        <Typography
                            color="text.secondary"
                            fontSize={14}
                            sx={{ mt: 0.5 }}
                        >
                            {company
                                ? "Keep your company information up to date."
                                : "Enter your company details below to create your profile."}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2.5,
                        }}
                    >
                        <TextField
                            label="Company Name"
                            name="CompanyName"
                            value={formData.CompanyName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Company Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Phone"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Address"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Company Website"
                            name="CompanyWebsite"
                            value={formData.CompanyWebsite}
                            onChange={handleChange}
                            fullWidth
                            placeholder="https://example.com"
                        />

                        <TextField
                            label="Company Description"
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            minRows={4}
                            sx={{
                                gridColumn: {
                                    xs: "auto",
                                    md: "1 / -1",
                                },
                            }}
                        />
                    </Box>

                    {/* Save */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={
                                company ? (
                                    <Save />
                                ) : (
                                    <Business />
                                )
                            }
                            onClick={handleSave}
                            disabled={saving}
                            sx={{
                                minWidth: 190,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 700,
                                py: 1.3,
                                boxShadow: "none",
                            }}
                        >
                            {saving ? (
                                <CircularProgress
                                    size={22}
                                    sx={{
                                        color: "#ffffff",
                                    }}
                                />
                            ) : company ? (
                                "Save Changes"
                            ) : (
                                "Create Company"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default CompanyProfile;