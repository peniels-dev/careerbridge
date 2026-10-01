import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import BusinessCenter from "@mui/icons-material/BusinessCenter";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Check from "@mui/icons-material/Check";

import axiosAPI from "../api/axiosAPI";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#FFFDF9",
        "&.Mui-focused fieldset": {
            borderColor: "#E76F51",
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#E76F51",
    },
};

const sectionTitleSx = {
    fontWeight: 800,
    color: "#293241",
    mb: 2.5,
};

function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [role, setRole] = useState("");

    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const [newCompany, setNewCompany] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [companyDescription, setCompanyDescription] =
        useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");

    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [registrationComplete, setRegistrationComplete] =
        useState(false);
    const [registeredRole, setRegisteredRole] = useState("");

    useEffect(() => {
        const loadCompanies = async () => {
            setLoadingCompanies(true);

            try {
                const response = await axiosAPI.get("/companies");

                setCompanies(response.data?.data || []);
            } catch (error) {
                console.error(
                    "Unable to load companies:",
                    error
                );

                setError(
                    "Unable to load companies. Please refresh the page and try again."
                );
            } finally {
                setLoadingCompanies(false);
            }
        };

        loadCompanies();
    }, []);

    const validateForm = () => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();

        if (!trimmedFirstName) {
            return "First name is required.";
        }

        if (!trimmedLastName) {
            return "Last name is required.";
        }

        if (!trimmedEmail) {
            return "Email address is required.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {
            return "Please enter a valid email address.";
        }

        if (!trimmedPhone) {
            return "Phone number is required.";
        }

        if (!password) {
            return "Password is required.";
        }

        if (password.length < 8 || password.length > 20) {
            return "Password must be between 8 and 20 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character.";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        if (!role) {
            return "Please select an account type.";
        }

        if (role === "Employer") {
            if (!newCompany && !companyId) {
                return "Please select your company or choose 'My company isn't listed'.";
            }

            if (newCompany) {
                if (!companyName.trim()) {
                    return "Company name is required.";
                }

                if (!companyEmail.trim()) {
                    return "Company email is required.";
                }

                if (!emailPattern.test(companyEmail.trim())) {
                    return "Please enter a valid company email address.";
                }

                if (!companyPhone.trim()) {
                    return "Company phone number is required.";
                }

                if (!companyAddress.trim()) {
                    return "Company address is required.";
                }

                if (!companyDescription.trim()) {
                    return "Company description is required.";
                }
            }
        }

        return "";
    };

    const resetForm = () => {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setCompanyId("");
        setNewCompany(false);

        setCompanyName("");
        setCompanyEmail("");
        setCompanyPhone("");
        setCompanyAddress("");
        setCompanyDescription("");
        setCompanyWebsite("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await axiosAPI.post(
                "/auth/register",
                {
                    firstName: firstName.trim(),
                    middleName:
                        middleName.trim() || null,
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    password,
                    role,

                    companyId:
                        role === "Employer" && !newCompany
                            ? Number(companyId)
                            : null,

                    newCompany:
                        role === "Employer" && newCompany
                            ? {
                                  companyName:
                                      companyName.trim(),
                                  companyEmail:
                                      companyEmail.trim(),
                                  companyPhone:
                                      companyPhone.trim(),
                                  companyAddress:
                                      companyAddress.trim(),
                                  companyDescription:
                                      companyDescription.trim(),
                                  companyWebsite:
                                      companyWebsite.trim() ||
                                      null,
                              }
                            : null,
                }
            );

            setRegisteredRole(role);
            setRegistrationComplete(true);

            setSuccess(
                response.data?.message ||
                    "Registration completed successfully."
            );

            resetForm();
        } catch (error) {
            console.error("Registration error:", error);

            const backendMessage =
                error.response?.data?.message ||
                error.friendlyMessage;

            if (backendMessage) {
                setError(backendMessage);
            } else if (
                error.response?.data?.errors?.length
            ) {
                setError(
                    error.response.data.errors
                        .map((item) => item.message)
                        .join(" ")
                );
            } else {
                setError(
                    "Unable to complete registration. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    /* Registration success screen */
    if (registrationComplete) {
        const isEmployer = registeredRole === "Employer";

        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#FFF8EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    py: 5,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: 280,
                        height: 280,
                        borderRadius: "50%",
                        backgroundColor: "#FFE5CC",
                        top: -120,
                        right: -100,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        width: 190,
                        height: 190,
                        borderRadius: "50%",
                        backgroundColor: "#EDF4E8",
                        bottom: -80,
                        left: -60,
                    }}
                />

                <Container
                    maxWidth="sm"
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: "#FFFDF9",
                            border: "1px solid #E9DED0",
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow:
                                "0 18px 45px rgba(75, 61, 48, 0.10)",
                        }}
                    >
                        <Box
                            sx={{
                                height: 6,
                                backgroundColor: "#6A994E",
                            }}
                        />

                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    sm: 5,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 82,
                                    height: 82,
                                    borderRadius: "50%",
                                    backgroundColor: "#EDF4E8",
                                    color: "#6A994E",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 3,
                                }}
                            >
                                <Check
                                    sx={{
                                        fontSize: 44,
                                        fontWeight: 700,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 900,
                                    color: "#293241",
                                    mb: 1.5,
                                    letterSpacing: "-0.7px",
                                }}
                            >
                                {isEmployer
                                    ? "Registration Submitted!"
                                    : "Account Created!"}
                            </Typography>

                            {isEmployer ? (
                                <>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#293241",
                                            mb: 2,
                                        }}
                                    >
                                        Your employer registration is
                                        pending approval.
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "#7A7068",
                                            lineHeight: 1.8,
                                            mb: 3,
                                        }}
                                    >
                                        Your registration request has
                                        been successfully submitted to
                                        the administrator for review.
                                    </Typography>

                                    <Box
                                        sx={{
                                            backgroundColor: "#FFF1D6",
                                            border: "1px solid #E9DED0",
                                            borderRadius: 2,
                                            p: 3,
                                            mb: 4,
                                            textAlign: "left",
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 800,
                                                color: "#293241",
                                                mb: 1.5,
                                            }}
                                        >
                                            What happens next?
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#655B53",
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            1. An administrator will
                                            review your employer
                                            registration.
                                            <br />
                                            <br />
                                            2. If your request is
                                            approved, your employer
                                            account will be activated.
                                            <br />
                                            <br />
                                            3. You can then sign in and
                                            access the employer
                                            dashboard.
                                        </Typography>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#293241",
                                            mb: 2,
                                        }}
                                    >
                                        Welcome to CareerBridge!
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "#7A7068",
                                            lineHeight: 1.8,
                                            mb: 4,
                                        }}
                                    >
                                        Your account has been created
                                        successfully. You can now sign
                                        in and start using CareerBridge.
                                    </Typography>
                                </>
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={() => navigate("/login")}
                                endIcon={<ArrowForward />}
                                sx={{
                                    py: 1.5,
                                    backgroundColor: "#E76F51",
                                    color: "#FFFFFF",
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 800,
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "#D85F43",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Go to Login
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => {
                                    setRegistrationComplete(false);
                                    setRegisteredRole("");
                                    setSuccess("");
                                    setError("");
                                }}
                                sx={{
                                    mt: 1.5,
                                    color: "#6F6259",
                                    textTransform: "none",
                                    fontWeight: 700,
                                }}
                            >
                                Back to Registration
                            </Button>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    /* Registration form */
    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#FFF8EF",
                py: {
                    xs: 3,
                    sm: 5,
                },
                px: 2,
            }}
        >
            <Container maxWidth="md">
                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow:
                            "0 18px 45px rgba(75, 61, 48, 0.09)",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            backgroundColor: "#293241",
                            color: "#FFFFFF",
                            px: {
                                xs: 3,
                                sm: 5,
                            },
                            py: {
                                xs: 4,
                                sm: 5,
                            },
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                width: 150,
                                height: 150,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(231,111,81,0.18)",
                                right: -45,
                                top: -65,
                            }}
                        />

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: 2,
                                    backgroundColor: "#E76F51",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <BusinessCenter
                                    sx={{
                                        fontSize: 29,
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: "-0.7px",
                                    }}
                                >
                                    Create your account
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 0.5,
                                        color: "#E8E0D8",
                                    }}
                                >
                                    Join CareerBridge and take the next
                                    step in your career.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <CardContent
                        sx={{
                            p: {
                                xs: 2.5,
                                sm: 5,
                            },
                        }}
                    >
                        {error && (
                            <Alert
                                severity="error"
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
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                }}
                            >
                                {success}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            {/* Personal Information */}
                            <Typography
                                variant="h6"
                                sx={sectionTitleSx}
                            >
                                Personal Information
                            </Typography>

                            <Stack spacing={2.5}>
                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={2}
                                >
                                    <TextField
                                        label="First Name"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(
                                                e.target.value
                                            )
                                        }
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                    />

                                    <TextField
                                        label="Middle Name"
                                        value={middleName}
                                        onChange={(e) =>
                                            setMiddleName(
                                                e.target.value
                                            )
                                        }
                                        fullWidth
                                        sx={fieldSx}
                                    />

                                    <TextField
                                        label="Last Name"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(
                                                e.target.value
                                            )
                                        }
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                    />
                                </Stack>

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={2}
                                >
                                    <TextField
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                    />

                                    <TextField
                                        label="Phone Number"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                    />
                                </Stack>

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={2}
                                >
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                        fullWidth
                                        helperText="8–20 characters, including uppercase, lowercase, number and special character."
                                        sx={fieldSx}
                                    />

                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                        fullWidth
                                        sx={fieldSx}
                                    />
                                </Stack>
                            </Stack>

                            {/* Account Type */}
                            <Typography
                                variant="h6"
                                sx={{
                                    ...sectionTitleSx,
                                    mt: 5,
                                }}
                            >
                                Account Type
                            </Typography>

                            <FormControl
                                fullWidth
                                sx={fieldSx}
                            >
                                <InputLabel>
                                    Account Type
                                </InputLabel>

                                <Select
                                    value={role}
                                    label="Account Type"
                                    onChange={(e) => {
                                        setRole(e.target.value);

                                        if (
                                            e.target.value !==
                                            "Employer"
                                        ) {
                                            setCompanyId("");
                                            setNewCompany(false);
                                        }
                                    }}
                                >
                                    <MenuItem value="JobSeeker">
                                        Job Seeker
                                    </MenuItem>

                                    <MenuItem value="Employer">
                                        Employer
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {/* Employer section */}
                            {role === "Employer" && (
                                <>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            ...sectionTitleSx,
                                            mt: 5,
                                            mb: 1,
                                        }}
                                    >
                                        Employer Information
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#7A7068",
                                            mb: 2.5,
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        Select your company. If your
                                        company is not listed, you can
                                        submit its details for
                                        administrator review.
                                    </Typography>

                                    {!newCompany ? (
                                        <>
                                            <FormControl
                                                fullWidth
                                                sx={{
                                                    ...fieldSx,
                                                    mb: 2,
                                                }}
                                            >
                                                <InputLabel>
                                                    Company
                                                </InputLabel>

                                                <Select
                                                    value={companyId}
                                                    label="Company"
                                                    disabled={
                                                        loadingCompanies
                                                    }
                                                    onChange={(e) =>
                                                        setCompanyId(
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                >
                                                    {loadingCompanies ? (
                                                        <MenuItem
                                                            disabled
                                                        >
                                                            Loading
                                                            companies...
                                                        </MenuItem>
                                                    ) : (
                                                        companies.map(
                                                            (
                                                                company
                                                            ) => (
                                                                <MenuItem
                                                                    key={
                                                                        company.CompanyID
                                                                    }
                                                                    value={
                                                                        company.CompanyID
                                                                    }
                                                                >
                                                                    {
                                                                        company.CompanyName
                                                                    }
                                                                </MenuItem>
                                                            )
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>

                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={() => {
                                                    setNewCompany(
                                                        true
                                                    );
                                                    setCompanyId("");
                                                }}
                                                sx={{
                                                    borderColor:
                                                        "#E76F51",
                                                    color: "#E76F51",
                                                    textTransform:
                                                        "none",
                                                    fontWeight: 700,
                                                    borderRadius: 2,
                                                    "&:hover": {
                                                        borderColor:
                                                            "#D85F43",
                                                        backgroundColor:
                                                            "#FFF1D6",
                                                    },
                                                }}
                                            >
                                                My company isn't listed
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Alert
                                                severity="info"
                                                sx={{
                                                    mb: 3,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                Your company information
                                                will be submitted together
                                                with your employer
                                                registration for
                                                administrator review.
                                            </Alert>

                                            <Stack spacing={2.5}>
                                                <TextField
                                                    label="Company Name"
                                                    value={
                                                        companyName
                                                    }
                                                    onChange={(e) =>
                                                        setCompanyName(
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    fullWidth
                                                    sx={fieldSx}
                                                />

                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        sm: "row",
                                                    }}
                                                    spacing={2}
                                                >
                                                    <TextField
                                                        label="Company Email"
                                                        type="email"
                                                        value={
                                                            companyEmail
                                                        }
                                                        onChange={(e) =>
                                                            setCompanyEmail(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        required
                                                        fullWidth
                                                        sx={fieldSx}
                                                    />

                                                    <TextField
                                                        label="Company Phone"
                                                        value={
                                                            companyPhone
                                                        }
                                                        onChange={(e) =>
                                                            setCompanyPhone(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        required
                                                        fullWidth
                                                        sx={fieldSx}
                                                    />
                                                </Stack>

                                                <TextField
                                                    label="Company Address"
                                                    value={
                                                        companyAddress
                                                    }
                                                    onChange={(e) =>
                                                        setCompanyAddress(
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    fullWidth
                                                    sx={fieldSx}
                                                />

                                                <TextField
                                                    label="Company Website"
                                                    placeholder="https://example.com"
                                                    value={
                                                        companyWebsite
                                                    }
                                                    onChange={(e) =>
                                                        setCompanyWebsite(
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    fullWidth
                                                    sx={fieldSx}
                                                />

                                                <TextField
                                                    label="Company Description"
                                                    value={
                                                        companyDescription
                                                    }
                                                    onChange={(e) =>
                                                        setCompanyDescription(
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    sx={fieldSx}
                                                />
                                            </Stack>

                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={() => {
                                                    setNewCompany(
                                                        false
                                                    );
                                                    setCompanyName("");
                                                    setCompanyEmail(
                                                        ""
                                                    );
                                                    setCompanyPhone(
                                                        ""
                                                    );
                                                    setCompanyAddress(
                                                        ""
                                                    );
                                                    setCompanyDescription(
                                                        ""
                                                    );
                                                    setCompanyWebsite(
                                                        ""
                                                    );
                                                }}
                                                sx={{
                                                    mt: 2,
                                                    borderColor:
                                                        "#DCCFC2",
                                                    color: "#6F6259",
                                                    textTransform:
                                                        "none",
                                                    fontWeight: 700,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                Choose an existing company
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                endIcon={
                                    !loading ? (
                                        <ArrowForward />
                                    ) : null
                                }
                                sx={{
                                    mt: 5,
                                    py: 1.5,
                                    backgroundColor: "#E76F51",
                                    color: "#FFFFFF",
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 800,
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "#D85F43",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                {loading ? (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <CircularProgress
                                            size={22}
                                            color="inherit"
                                        />

                                        <span>
                                            Creating Account...
                                        </span>
                                    </Stack>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            <Typography
                                align="center"
                                sx={{
                                    mt: 3,
                                    color: "#7A7068",
                                }}
                            >
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    style={{
                                        color: "#E76F51",
                                        fontWeight: 800,
                                        textDecoration: "none",
                                    }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 3,
                        color: "#9A8F86",
                    }}
                >
                    CareerBridge — connecting people with opportunities.
                </Typography>
            </Container>
        </Box>
    );
}

export default Register;