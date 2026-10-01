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
    ExitToApp,
    People,
    Save,
    Work,
} from "@mui/icons-material";

import axiosAPI from "../api/axiosAPI";
import { useAuth } from "../context/AuthContext";


const CompanyProfile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
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
        logout();
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

            const response =
                await axiosAPI.get("/companies/me");

            const data = response.data?.data;

            if (data) {
                setCompany(data);

                setFormData({
                    CompanyName:
                        data.CompanyName || "",
                    Email: data.Email || "",
                    Phone: data.Phone || "",
                    Address: data.Address || "",
                    Description:
                        data.Description || "",
                    CompanyWebsite:
                        data.CompanyWebsite || "",
                });

                if (data.CompanyLogo) {
                    setLogoPreview(
                        getLogoURL(data.CompanyLogo)
                    );
                }
            }
        } catch (err) {
            // A 404 means the employer has not created
            // a company profile yet.

            if (err.response?.status === 404) {
                setCompany(null);

                setFormData({
                    CompanyName: "",
                    Email:
                        user?.Email ||
                        user?.email ||
                        "",
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
                setError(
                    "Company name is required."
                );
                setSaving(false);
                return;
            }

            if (!formData.Email.trim()) {
                setError(
                    "Company email is required."
                );
                setSaving(false);
                return;
            }

            let response;

            if (company) {
                response = await axiosAPI.put(
                    "/companies/me",
                    formData
                );
            } else {
                response = await axiosAPI.post(
                    "/companies/me",
                    formData
                );
            }

            const updatedCompany =
                response.data?.data;

            if (updatedCompany) {
                setCompany(updatedCompany);

                setFormData({
                    CompanyName:
                        updatedCompany.CompanyName ||
                        "",
                    Email:
                        updatedCompany.Email ||
                        "",
                    Phone:
                        updatedCompany.Phone ||
                        "",
                    Address:
                        updatedCompany.Address ||
                        "",
                    Description:
                        updatedCompany.Description ||
                        "",
                    CompanyWebsite:
                        updatedCompany.CompanyWebsite ||
                        "",
                });

                if (updatedCompany.CompanyLogo) {
                    setLogoPreview(
                        getLogoURL(
                            updatedCompany.CompanyLogo
                        )
                    );
                }
            }

            setSuccess(
                company
                    ? "Company profile updated successfully."
                    : "Company profile created successfully."
            );
        } catch (err) {
            console.error(
                "Save company error:",
                err
            );

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
        const file =
            event.target.files?.[0];

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
            setError(
                "Company logo must be smaller than 2 MB."
            );

            event.target.value = "";
            return;
        }

        const previewURL =
            URL.createObjectURL(file);

        setLogoPreview(previewURL);

        const formDataToUpload =
            new FormData();

        formDataToUpload.append(
            "logo",
            file
        );

        try {
            setUploadingLogo(true);

            const response =
                await axiosAPI.post(
                    "/companies/me/logo",
                    formDataToUpload
                );

            const updatedCompany =
                response.data?.data;

            if (updatedCompany) {
                setCompany(updatedCompany);

                setFormData({
                    CompanyName:
                        updatedCompany.CompanyName ||
                        "",
                    Email:
                        updatedCompany.Email ||
                        "",
                    Phone:
                        updatedCompany.Phone ||
                        "",
                    Address:
                        updatedCompany.Address ||
                        "",
                    Description:
                        updatedCompany.Description ||
                        "",
                    CompanyWebsite:
                        updatedCompany.CompanyWebsite ||
                        "",
                });

                if (updatedCompany.CompanyLogo) {
                    setLogoPreview(
                        getLogoURL(
                            updatedCompany.CompanyLogo
                        )
                    );
                }
            }

            setSuccess(
                "Company logo uploaded successfully."
            );
        } catch (err) {
            console.error(
                "Logo upload error:",
                err
            );

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
                    backgroundColor:
                        "#FFF8EF",
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <CircularProgress
                        sx={{
                            color: "#E76F51",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#7A7068",
                        }}
                    >
                        Loading company profile...
                    </Typography>
                </Box>
            </Box>
        );
    }


    // =====================================================
    // USER INFO
    // =====================================================

    const firstName =
        user?.firstName ||
        user?.FirstName ||
        "";

    const lastName =
        user?.lastName ||
        user?.LastName ||
        "";

    const initials =
        (
            (firstName.charAt(0) || "") +
            (lastName.charAt(0) || "")
        ).toUpperCase() || "E";


    // =====================================================
    // SIDEBAR ITEM
    // =====================================================

    const sidebarItem = (
        icon,
        label,
        path,
        active = false
    ) => (
        <Button
            fullWidth
            onClick={() => navigate(path)}
            startIcon={icon}
            sx={{
                justifyContent:
                    "flex-start",
                textTransform: "none",
                px: 1.5,
                py: 1.2,
                mb: 0.5,
                borderRadius: 2,
                color: active
                    ? "#ffffff"
                    : "#B9C0C9",
                backgroundColor: active
                    ? "#E76F51"
                    : "transparent",
                fontSize: 13,
                fontWeight: active
                    ? 700
                    : 500,

                "&:hover": {
                    backgroundColor: active
                        ? "#E76F51"
                        : "#3A4658",
                    color: "#ffffff",
                },

                "@media (max-width: 900px)": {
                    minWidth: 0,
                    justifyContent: "center",

                    "& .MuiButton-startIcon": {
                        margin: 0,
                    },

                    fontSize: 0,
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
                backgroundColor: "#FFF8EF",
            }}
        >
            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Box
                sx={{
                    width: 250,
                    backgroundColor: "#293241",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 10,

                    "@media (max-width: 900px)": {
                        width: 78,
                    },

                    "@media (max-width: 600px)": {
                        display: "none",
                    },
                }}
            >
                {/* LOGO */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        px: 1,
                        py: 2,
                        mb: 2,

                        "@media (max-width: 900px)": {
                            justifyContent:
                                "center",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor:
                                "#E76F51",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            fontWeight: 800,
                            fontSize: 20,
                            flexShrink: 0,
                        }}
                    >
                        C
                    </Box>

                    <Box
                        sx={{
                            "@media (max-width: 900px)": {
                                display: "none",
                            },
                        }}
                    >
                        <Typography
                            fontWeight={800}
                            fontSize={18}
                        >
                            CareerBridge
                        </Typography>

                        <Typography
                            fontSize={11}
                            color="#B9C0C9"
                        >
                            Employer Portal
                        </Typography>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor:
                            "#3A4658",
                        mb: 2,
                    }}
                />

                <Typography
                    sx={{
                        fontSize: 10,
                        textTransform:
                            "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        color: "#8993A1",
                        px: 1,
                        mb: 1,

                        "@media (max-width: 900px)": {
                            display: "none",
                        },
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
                    "/employer/applicants"
                )}

                <Typography
                    sx={{
                        fontSize: 10,
                        textTransform:
                            "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        color: "#8993A1",
                        px: 1,
                        mt: 3,
                        mb: 1,

                        "@media (max-width: 900px)": {
                            display: "none",
                        },
                    }}
                >
                    Company
                </Typography>

                {sidebarItem(
                    <Business />,
                    "Company Profile",
                    "/company-profile",
                    true
                )}

                <Box
                    sx={{
                        flexGrow: 1,
                    }}
                />

                <Divider
                    sx={{
                        borderColor:
                            "#3A4658",
                        mb: 1,
                    }}
                />

                {/* LOGOUT */}

                <Button
                    fullWidth
                    startIcon={<ExitToApp />}
                    onClick={handleLogout}
                    sx={{
                        justifyContent:
                            "flex-start",
                        textTransform: "none",
                        px: 1.5,
                        py: 1.2,
                        borderRadius: 2,
                        color: "#B9C0C9",
                        fontSize: 13,

                        "&:hover": {
                            backgroundColor:
                                "#3A4658",
                            color: "#ffffff",
                        },

                        "@media (max-width: 900px)": {
                            minWidth: 0,
                            justifyContent:
                                "center",

                            "& .MuiButton-startIcon": {
                                margin: 0,
                            },

                            fontSize: 0,
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Box
                sx={{
                    flex: 1,
                    ml: {
                        xs: 0,
                        sm: "78px",
                        md: "250px",
                    },
                    width: {
                        xs: "100%",
                        sm: "calc(100% - 78px)",
                        md: "calc(100% - 250px)",
                    },
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                }}
            >
                {/* HEADER */}

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
                        mb: 4,
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                    }}
                >
                    <Box>
                        <Button
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate(
                                    "/employer-dashboard"
                                )
                            }
                            sx={{
                                textTransform:
                                    "none",
                                color: "#7A7068",
                                mb: 1,

                                "&:hover": {
                                    backgroundColor:
                                        "#FFF1D6",
                                    color: "#E76F51",
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 27,
                                    md: 32,
                                },
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            Company Profile
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                color: "#7A7068",
                                fontSize: 14,
                            }}
                        >
                            {company
                                ? "Manage your company information and branding."
                                : "Create your company profile to start posting jobs."}
                        </Typography>
                    </Box>

                    {/* USER */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 1.5,
                            alignSelf: {
                                xs: "flex-end",
                                sm: "auto",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius:
                                    "50%",
                                backgroundColor:
                                    "#F4A261",
                                color: "#293241",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                fontWeight: 800,
                                fontSize: 13,
                            }}
                        >
                            {initials}
                        </Box>

                        <Box
                            sx={{
                                "@media (max-width: 600px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#293241",
                                }}
                            >
                                {firstName ||
                                    "Employer"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color: "#8B8178",
                                }}
                            >
                                Employer
                            </Typography>
                        </Box>
                    </Box>
                </Box>


                {/* ALERTS */}

                <Stack
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() =>
                                setError("")
                            }
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
                        borderRadius: 3,
                        border:
                            "1px solid #E9DED0",
                        overflow: "hidden",
                        mb: 3,
                        backgroundColor:
                            "#FFFDF9",
                    }}
                >
                    {/* SIMPLE WARM COVER */}

                    <Box
                        sx={{
                            height: {
                                xs: 110,
                                sm: 140,
                            },
                            backgroundColor:
                                "#F4A261",
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
                            {/* LOGO */}

                            <Box
                                sx={{
                                    position:
                                        "relative",
                                }}
                            >
                                <Avatar
                                    src={
                                        logoPreview
                                    }
                                    sx={{
                                        width: 110,
                                        height: 110,
                                        bgcolor:
                                            "#FFFDF9",
                                        color:
                                            "#E76F51",
                                        border:
                                            "5px solid #FFFDF9",
                                        boxShadow:
                                            "0 5px 16px rgba(41,50,65,0.15)",
                                        fontSize: 40,
                                    }}
                                >
                                    <Business
                                        fontSize="large"
                                    />
                                </Avatar>

                                <input
                                    ref={
                                        fileInputRef
                                    }
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
                                    disabled={
                                        uploadingLogo
                                    }
                                    sx={{
                                        position:
                                            "absolute",
                                        bottom: -8,
                                        right: -8,
                                        minWidth: 38,
                                        width: 38,
                                        height: 38,
                                        borderRadius:
                                            "50%",
                                        backgroundColor:
                                            "#E76F51",
                                        color:
                                            "#ffffff",
                                        boxShadow:
                                            "0 3px 8px rgba(0,0,0,0.15)",

                                        "&:hover": {
                                            backgroundColor:
                                                "#D95F42",
                                        },
                                    }}
                                >
                                    {uploadingLogo ? (
                                        <CircularProgress
                                            size={18}
                                            sx={{
                                                color:
                                                    "#ffffff",
                                            }}
                                        />
                                    ) : (
                                        <CameraAlt fontSize="small" />
                                    )}
                                </Button>
                            </Box>


                            {/* COMPANY NAME */}

                            <Box
                                sx={{
                                    pb: 1,
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 22,
                                            sm: 26,
                                        },
                                        fontWeight: 800,
                                        color: "#293241",
                                    }}
                                >
                                    {company?.CompanyName ||
                                        "Create Your Company Profile"}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        color: "#7A7068",
                                        fontSize: 14,
                                    }}
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
                        borderRadius: 3,
                        border:
                            "1px solid #E9DED0",
                        backgroundColor:
                            "#FFFDF9",
                        p: {
                            xs: 2,
                            sm: 4,
                        },
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            sx={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            Company Information
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7A7068",
                                fontSize: 14,
                                mt: 0.5,
                            }}
                        >
                            {company
                                ? "Keep your company information up to date."
                                : "Enter your company details below to create your profile."}
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            borderColor:
                                "#E9DED0",
                            mb: 3,
                        }}
                    />


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
                            value={
                                formData.CompanyName
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            required
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Company Email"
                            name="Email"
                            value={
                                formData.Email
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            required
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Phone"
                            name="Phone"
                            value={
                                formData.Phone
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Address"
                            name="Address"
                            value={
                                formData.Address
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Company Website"
                            name="CompanyWebsite"
                            value={
                                formData.CompanyWebsite
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            placeholder="https://example.com"
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Company Description"
                            name="Description"
                            value={
                                formData.Description
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            multiline
                            minRows={4}
                            sx={{
                                ...fieldStyles,
                                gridColumn: {
                                    xs: "auto",
                                    md: "1 / -1",
                                },
                            }}
                        />
                    </Box>


                    {/* SAVE */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
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
                                borderRadius: 2,
                                textTransform:
                                    "none",
                                fontWeight: 700,
                                py: 1.3,
                                boxShadow: "none",
                                backgroundColor:
                                    "#E76F51",

                                "&:hover": {
                                    backgroundColor:
                                        "#D95F42",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            {saving ? (
                                <CircularProgress
                                    size={22}
                                    sx={{
                                        color:
                                            "#ffffff",
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


// =====================================================
// FIELD STYLES
// =====================================================

const fieldStyles = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFDF9",
        borderRadius: 2,

        "& fieldset": {
            borderColor: "#E9DED0",
        },

        "&:hover fieldset": {
            borderColor: "#F4A261",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#E76F51",
        },
    },

    "& .MuiInputLabel-root": {
        color: "#7A7068",
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: "#E76F51",
    },
};


export default CompanyProfile;