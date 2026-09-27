import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    Chip
} from "@mui/material";

import {
    Dashboard,
    Work,
    Add,
    People,
    Business,
    ExitToApp,
    ArrowBack,
    Edit,
    Language,
    Email,
    Phone,
    LocationOn,
    Save
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";

const CompanyProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const fileInputRef = useRef(null);

    const [company, setCompany] = useState(null);

    const [formData, setFormData] = useState({
        CompanyName: "",
        Email: "",
        Phone: "",
        Address: "",
        Description: "",
        CompanyWebsite: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [logoPreview, setLogoPreview] = useState("");

    // =====================================================
    // BACKEND SERVER URL
    // =====================================================

    const backendURL = "http://localhost:5138";
    // =====================================================
    // GET LOGO URL
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
    // FETCH COMPANY
    // =====================================================

    const fetchCompany = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/companies/me");

            const companyData = response.data.data;

            setCompany(companyData);

            setFormData({
                CompanyName: companyData.CompanyName || "",
                Email: companyData.Email || "",
                Phone: companyData.Phone || "",
                Address: companyData.Address || "",
                Description: companyData.Description || "",
                CompanyWebsite:
                    companyData.CompanyWebsite || ""
            });

            if (companyData.CompanyLogo) {
                setLogoPreview(
                    getLogoURL(companyData.CompanyLogo)
                );
            }

        } catch (err) {
            console.error("Fetch company error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load company profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD COMPANY WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {
        fetchCompany();
    }, []);

    // =====================================================
    // HANDLE INPUT CHANGES
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =====================================================
    // SAVE COMPANY DETAILS
    // =====================================================

    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.CompanyName.trim()) {
            setError("Company name is required.");
            return;
        }

        if (!formData.Email.trim()) {
            setError("Company email is required.");
            return;
        }

        try {
            setSaving(true);

            const response = await axiosAPI.put(
                "/companies/me",
                formData
            );

            setCompany(response.data.data);

            setFormData({
                CompanyName:
                    response.data.data.CompanyName || "",
                Email:
                    response.data.data.Email || "",
                Phone:
                    response.data.data.Phone || "",
                Address:
                    response.data.data.Address || "",
                Description:
                    response.data.data.Description || "",
                CompanyWebsite:
                    response.data.data.CompanyWebsite || ""
            });

            setSuccess(
                "Company profile updated successfully."
            );

        } catch (err) {
            console.error("Update company error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update company profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // OPEN FILE SELECTOR
    // =====================================================

    const handleChooseLogo = () => {
        fileInputRef.current?.click();
    };

    // =====================================================
    // UPLOAD COMPANY LOGO
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
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Please select a PNG, JPG, JPEG, or WEBP image."
            );

            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError(
                "Company logo must be 2 MB or smaller."
            );

            event.target.value = "";
            return;
        }

        try {
            setUploadingLogo(true);

            const previewURL =
                URL.createObjectURL(file);

            setLogoPreview(previewURL);

            const uploadData = new FormData();

            uploadData.append("logo", file);

            const response = await axiosAPI.post(
                "/companies/me/logo",
                uploadData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const updatedCompany =
                response.data.data;

            setCompany(updatedCompany);

            if (updatedCompany.CompanyLogo) {
                setLogoPreview(
                    getLogoURL(
                        updatedCompany.CompanyLogo
                    )
                );
            }

            setSuccess(
                "Company logo updated successfully."
            );

        } catch (err) {
            console.error(
                "Upload company logo error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to upload company logo."
            );

            if (company?.CompanyLogo) {
                setLogoPreview(
                    getLogoURL(
                        company.CompanyLogo
                    )
                );
            } else {
                setLogoPreview("");
            }

        } finally {
            setUploadingLogo(false);

            event.target.value = "";
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f7fb"
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "text.secondary"
                        }}
                    >
                        Loading company profile...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                display: "flex"
            }}
        >

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#111827",
                    color: "white",
                    minHeight: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                {/* Logo */}
                <Box
                    sx={{
                        px: 3,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#2563eb"
                        }}
                    >
                        <Business />
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: 18
                            }}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#9ca3af"
                            }}
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor: "#374151"
                    }}
                />

                {/* Navigation */}
                <Box
                    sx={{
                        px: 2,
                        py: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >

                    <Button
                        startIcon={<Dashboard />}
                        onClick={() =>
                            navigate("/employer-dashboard")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#d1d5db",
                            textTransform: "none",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#1f2937",
                                color: "white"
                            }
                        }}
                    >
                        Dashboard
                    </Button>

                    <Button
                        startIcon={<Work />}
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#d1d5db",
                            textTransform: "none",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#1f2937",
                                color: "white"
                            }
                        }}
                    >
                        My Job Postings
                    </Button>

                    <Button
                        startIcon={<Add />}
                        onClick={() =>
                            navigate("/employer/post-job")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#d1d5db",
                            textTransform: "none",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#1f2937",
                                color: "white"
                            }
                        }}
                    >
                        Post a Job
                    </Button>

                    <Button
                        startIcon={<People />}
                        onClick={() =>
                            navigate("/employer/jobs")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "#d1d5db",
                            textTransform: "none",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#1f2937",
                                color: "white"
                            }
                        }}
                    >
                        Applicants
                    </Button>

                    <Button
                        startIcon={<Business />}
                        onClick={() =>
                            navigate("/company-profile")
                        }
                        sx={{
                            justifyContent: "flex-start",
                            color: "white",
                            backgroundColor: "#1f2937",
                            textTransform: "none",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2
                        }}
                    >
                        Company Profile
                    </Button>

                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ px: 2, pb: 3 }}>

                    <Button
                        fullWidth
                        startIcon={<ExitToApp />}
                        onClick={handleLogout}
                        sx={{
                            justifyContent: "flex-start",
                            color: "#fca5a5",
                            textTransform: "none",
                            px: 2,
                            py: 1.3,
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#7f1d1d",
                                color: "white"
                            }
                        }}
                    >
                        Logout
                    </Button>

                </Box>

            </Box>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <Box
                sx={{
                    marginLeft: "250px",
                    width: "calc(100% - 250px)",
                    minHeight: "100vh",
                    px: {
                        xs: 3,
                        md: 5
                    },
                    py: 4
                }}
            >

                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 4
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >

                        <Tooltip title="Back to dashboard">
                            <IconButton
                                onClick={() =>
                                    navigate(
                                        "/employer-dashboard"
                                    )
                                }
                                sx={{
                                    backgroundColor:
                                        "white",
                                    border:
                                        "1px solid #e5e7eb"
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                        </Tooltip>

                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: "#111827"
                                }}
                            >
                                Company Profile
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#6b7280",
                                    mt: 0.5
                                }}
                            >
                                Manage your company information
                                and branding.
                            </Typography>
                        </Box>

                    </Box>

                    <Chip
                        icon={<Business />}
                        label="Employer"
                        sx={{
                            fontWeight: 600
                        }}
                    />

                </Box>

                {/* Alerts */}
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError("")}
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        severity="success"
                        onClose={() => setSuccess("")}
                        sx={{ mb: 3 }}
                    >
                        {success}
                    </Alert>
                )}

                {/* =====================================================
                    PROFILE HEADER
                ===================================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        mb: 3,
                        overflow: "hidden"
                    }}
                >

                    <Box
                        sx={{
                            height: 120,
                            background:
                                "linear-gradient(135deg, #1e3a8a, #2563eb)"
                        }}
                    />

                    <Box
                        sx={{
                            px: {
                                xs: 3,
                                md: 5
                            },
                            pb: 4
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 3,
                                marginTop: -6
                            }}
                        >

                            <Box
                                sx={{
                                    position: "relative"
                                }}
                            >

                                <Avatar
                                    src={logoPreview}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        backgroundColor:
                                            "#eff6ff",
                                        color: "#2563eb",
                                        border:
                                            "5px solid white",
                                        boxShadow:
                                            "0 4px 15px rgba(0,0,0,0.12)",
                                        fontSize: 48
                                    }}
                                >
                                    {!logoPreview && (
                                        <Business
                                            fontSize="inherit"
                                        />
                                    )}
                                </Avatar>

                                <Tooltip title="Change company logo">
                                    <IconButton
                                        onClick={
                                            handleChooseLogo
                                        }
                                        disabled={
                                            uploadingLogo
                                        }
                                        sx={{
                                            position:
                                                "absolute",
                                            right: -4,
                                            bottom: -4,
                                            backgroundColor:
                                                "#2563eb",
                                            color: "white",
                                            width: 38,
                                            height: 38,
                                            border:
                                                "3px solid white",
                                            "&:hover": {
                                                backgroundColor:
                                                    "#1d4ed8"
                                            }
                                        }}
                                    >
                                        {uploadingLogo ? (
                                            <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                        ) : (
                                            <Edit
                                                fontSize="small"
                                            />
                                        )}
                                    </IconButton>
                                </Tooltip>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={
                                        handleLogoChange
                                    }
                                    style={{
                                        display: "none"
                                    }}
                                />

                            </Box>

                            <Box sx={{ pb: 1 }}>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#111827"
                                    }}
                                >
                                    {company?.CompanyName ||
                                        "Your Company"}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "#6b7280",
                                        mt: 0.5
                                    }}
                                >
                                    Manage your public
                                    company information
                                </Typography>

                            </Box>

                        </Box>

                    </Box>

                </Paper>

                {/* =====================================================
                    COMPANY INFORMATION FORM
                ===================================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        p: {
                            xs: 3,
                            md: 5
                        }
                    }}
                >

                    <Box sx={{ mb: 4 }}>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: "#111827"
                            }}
                        >
                            Company Information
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6b7280",
                                mt: 0.5
                            }}
                        >
                            Keep your company details
                            accurate so job seekers can
                            learn more about your organization.
                        </Typography>

                    </Box>

                    <form onSubmit={handleSave}>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr"
                                },
                                gap: 3
                            }}
                        >

                            <TextField
                                fullWidth
                                label="Company Name"
                                name="CompanyName"
                                value={
                                    formData.CompanyName
                                }
                                onChange={handleChange}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Company Email"
                                name="Email"
                                type="email"
                                value={
                                    formData.Email
                                }
                                onChange={handleChange}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Phone"
                                name="Phone"
                                value={
                                    formData.Phone
                                }
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <Phone
                                            sx={{
                                                mr: 1,
                                                color:
                                                    "text.secondary"
                                            }}
                                        />
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Address"
                                name="Address"
                                value={
                                    formData.Address
                                }
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <LocationOn
                                            sx={{
                                                mr: 1,
                                                color:
                                                    "text.secondary"
                                            }}
                                        />
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Company Website"
                                name="CompanyWebsite"
                                value={
                                    formData.CompanyWebsite
                                }
                                onChange={handleChange}
                                placeholder="https://example.com"
                                InputProps={{
                                    startAdornment: (
                                        <Language
                                            sx={{
                                                mr: 1,
                                                color:
                                                    "text.secondary"
                                            }}
                                        />
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Contact Email"
                                value={
                                    formData.Email
                                }
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <Email
                                            sx={{
                                                mr: 1,
                                                color:
                                                    "text.secondary"
                                            }}
                                        />
                                    )
                                }}
                            />

                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            minRows={5}
                            label="Company Description"
                            name="Description"
                            value={
                                formData.Description
                            }
                            onChange={handleChange}
                            sx={{ mt: 3 }}
                            placeholder="Tell job seekers about your company, what you do, and what makes your organization unique."
                        />

                        <Divider sx={{ my: 4 }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                gap: 2
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        "/employer-dashboard"
                                    )
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    borderRadius: 2,
                                    px: 3,
                                    fontWeight: 700
                                }}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                        </Box>

                    </form>

                </Paper>

            </Box>

        </Box>
    );
};

export default CompanyProfile;