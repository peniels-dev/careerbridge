import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    CheckCircle,
    Close,
    Search,
    PersonOff,
    PersonAdd,
    Refresh,
    Business,
    Check,
    Cancel,
} from "@mui/icons-material";

import axiosAPI from "../../api/axiosAPI";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedUser, setSelectedUser] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [approvalDecision, setApprovalDecision] = useState("");
    const [approvalUpdating, setApprovalUpdating] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/admin/users");

            setUsers(response.data.data || []);
        } catch (err) {
            console.error("Failed to load users:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    /*
     * Employers waiting for admin approval.
     */
    const pendingEmployers = useMemo(() => {
        return users.filter(
            (user) =>
                user.Role === "Employer" &&
                user.ApprovalStatus === "Pending"
        );
    }, [users]);

    /*
     * Filter users.
     */
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const fullName = [
                user.FirstName,
                user.MiddleName,
                user.LastName,
            ]
                .filter(Boolean)
                .join(" ");

            const searchText = search.toLowerCase();

            const matchesSearch =
                fullName
                    .toLowerCase()
                    .includes(searchText) ||
                user.Email?.toLowerCase().includes(searchText) ||
                user.CompanyName?.toLowerCase().includes(searchText);

            const matchesRole =
                roleFilter === "All" ||
                user.Role === roleFilter;

            const matchesStatus =
                statusFilter === "All" ||
                (statusFilter === "Active" && user.IsActive) ||
                (statusFilter === "Inactive" && !user.IsActive);

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [users, search, roleFilter, statusFilter]);

    /*
     * User status dialog.
     */
    const openStatusDialog = (user) => {
        setSelectedUser(user);
    };

    const closeStatusDialog = () => {
        if (!statusUpdating) {
            setSelectedUser(null);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            setStatusUpdating(true);

            const newStatus = !Boolean(selectedUser.IsActive);

            await axiosAPI.patch(
                `/admin/users/${selectedUser.UserID}/status`,
                {
                    isActive: newStatus,
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user.UserID === selectedUser.UserID
                        ? {
                              ...user,
                              IsActive: newStatus,
                          }
                        : user
                )
            );

            setSnackbar({
                open: true,
                message: newStatus
                    ? "User enabled successfully."
                    : "User disabled successfully.",
                severity: "success",
            });

            setSelectedUser(null);
        } catch (err) {
            console.error(
                "Failed to update user status:",
                err
            );

            setSnackbar({
                open: true,
                message:
                    err.response?.data?.message ||
                    "Failed to update user status.",
                severity: "error",
            });
        } finally {
            setStatusUpdating(false);
        }
    };

    /*
     * Employer approval dialog.
     */
    const openApprovalDialog = (employer, decision) => {
        setSelectedEmployer(employer);
        setApprovalDecision(decision);
    };

    const closeApprovalDialog = () => {
        if (!approvalUpdating) {
            setSelectedEmployer(null);
            setApprovalDecision("");
        }
    };

    /*
     * Approve or reject employer.
     */
    const handleEmployerApproval = async () => {
        if (!selectedEmployer || !approvalDecision) {
            return;
        }

        try {
            setApprovalUpdating(true);

            await axiosAPI.patch(
                `/admin/employers/${selectedEmployer.UserID}/approval`,
                {
                    decision: approvalDecision,
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user.UserID === selectedEmployer.UserID
                        ? {
                              ...user,
                              ApprovalStatus:
                                  approvalDecision,
                              IsActive:
                                  approvalDecision ===
                                  "Approved",
                          }
                        : user
                )
            );

            setSnackbar({
                open: true,
                message:
                    approvalDecision === "Approved"
                        ? "Employer approved successfully."
                        : "Employer rejected successfully.",
                severity:
                    approvalDecision === "Approved"
                        ? "success"
                        : "info",
            });

            setSelectedEmployer(null);
            setApprovalDecision("");
        } catch (err) {
            console.error(
                "Failed to update employer approval:",
                err
            );

            setSnackbar({
                open: true,
                message:
                    err.response?.data?.message ||
                    "Failed to update employer approval.",
                severity: "error",
            });
        } finally {
            setApprovalUpdating(false);
        }
    };

    const getInitials = (user) => {
        const first = user.FirstName?.charAt(0) || "";
        const last = user.LastName?.charAt(0) || "";

        return `${first}${last}`.toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getRoleLabel = (role) => {
        if (
            role === "JobSeeker" ||
            role === "Job seeker"
        ) {
            return "Job Seeker";
        }

        return role || "Unknown";
    };

    const getRoleChipSx = (role) => {
        if (
            role === "JobSeeker" ||
            role === "Job seeker"
        ) {
            return {
                color: "#A65F00",
                backgroundColor: "#FFF1D6",
            };
        }

        if (role === "Employer") {
            return {
                color: "#477A35",
                backgroundColor: "#EDF4E8",
            };
        }

        if (role === "Admin") {
            return {
                color: "#7E4BA3",
                backgroundColor: "#F3E8FF",
            };
        }

        return {
            color: "#5F554D",
            backgroundColor: "#F1ECE7",
        };
    };

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => user.IsActive
    ).length;

    const inactiveUsers = users.filter(
        (user) => !user.IsActive
    ).length;

    return (
        <Box
            sx={{
                minHeight: "100%",
                backgroundColor: "#FFF8EF",
            }}
        >
            {/* PAGE HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    gap: 2,
                    mb: 4,
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            color: "#293241",
                            letterSpacing: "-0.8px",
                        }}
                    >
                        Users
                    </Typography>

                    <Typography
                        sx={{
                            color: "#7A7068",
                            mt: 0.75,
                        }}
                    >
                        Manage CareerBridge users and review
                        employer registrations.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadUsers}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: "#DCCFC2",
                        color: "#5F554D",
                        px: 2.2,
                        backgroundColor: "#FFFDF9",

                        "&:hover": {
                            borderColor: "#E76F51",
                            color: "#E76F51",
                            backgroundColor: "#FFF8EF",
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* SUMMARY CARDS */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* TOTAL */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFF1D6",
                                color: "#A65F00",
                            }}
                        >
                            <PersonAdd />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Total Users
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color: "#293241",
                                }}
                            >
                                {totalUsers}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* ACTIVE */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#EDF4E8",
                                color: "#6A994E",
                            }}
                        >
                            <CheckCircle />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Active Users
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color: "#6A994E",
                                }}
                            >
                                {activeUsers}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* INACTIVE */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FBE9E6",
                                color: "#B96868",
                            }}
                        >
                            <PersonOff />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Inactive Users
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color: "#B96868",
                                }}
                            >
                                {inactiveUsers}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* PENDING EMPLOYERS */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border:
                            pendingEmployers.length > 0
                                ? "1px solid #F4D3B5"
                                : "1px solid #E9DED0",
                        backgroundColor:
                            pendingEmployers.length > 0
                                ? "#FFF8EF"
                                : "#FFFDF9",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FFE5CC",
                                color: "#E76F51",
                            }}
                        >
                            <Business />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#7A7068",
                                    fontWeight: 600,
                                }}
                            >
                                Pending Employers
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 900,
                                    color:
                                        pendingEmployers.length >
                                        0
                                            ? "#E76F51"
                                            : "#293241",
                                }}
                            >
                                {pendingEmployers.length}
                            </Typography>

                            {pendingEmployers.length > 0 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#A65F00",
                                        fontWeight: 700,
                                    }}
                                >
                                    Requires review
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </Paper>
            </Box>

            {/* EMPLOYER APPROVAL SECTION */}
            {pendingEmployers.length > 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                        overflow: "hidden",
                        backgroundColor: "#FFFDF9",
                    }}
                >
                    {/* SECTION HEADER */}
                    <Box
                        sx={{
                            px: {
                                xs: 2,
                                sm: 3,
                            },
                            py: 2.5,
                            backgroundColor: "#FFF1D6",
                            borderBottom:
                                "1px solid #F4D3B5",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#FFE5CC",
                                    color: "#E76F51",
                                }}
                            >
                                <Business />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={1}
                                    sx={{
                                        alignItems: {
                                            xs: "flex-start",
                                            sm: "center",
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 900,
                                            color: "#293241",
                                        }}
                                    >
                                        Employer Registrations
                                    </Typography>

                                    <Chip
                                        label={`${pendingEmployers.length} Pending`}
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#A65F00",
                                            backgroundColor:
                                                "#FFE5CC",
                                        }}
                                    />
                                </Stack>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 0.5,
                                        color: "#7A7068",
                                    }}
                                >
                                    These employers are waiting
                                    for admin approval before they
                                    can access employer features.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* EMPLOYER CARDS */}
                    <Box
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                            },
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        {pendingEmployers.map((employer) => (
                            <Paper
                                key={employer.UserID}
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2.5,
                                    border: "1px solid #E9DED0",
                                    backgroundColor: "#FFFDF9",
                                }}
                            >
                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={2}
                                    sx={{
                                        alignItems: {
                                            xs: "flex-start",
                                            sm: "center",
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            backgroundColor:
                                                "#E76F51",
                                            color: "#fff",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {getInitials(employer)}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#293241",
                                            }}
                                        >
                                            {[
                                                employer.FirstName,
                                                employer.MiddleName,
                                                employer.LastName,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#7A7068",
                                                mt: 0.25,
                                            }}
                                        >
                                            {employer.Email}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#7A7068",
                                                mt: 0.25,
                                            }}
                                        >
                                            {employer.Phone ||
                                                "No phone number"}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label="Pending"
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#A65F00",
                                            backgroundColor:
                                                "#FFF1D6",
                                        }}
                                    />
                                </Stack>

                                <Box
                                    sx={{
                                        mt: 2,
                                        pt: 2,
                                        borderTop:
                                            "1px solid #E9DED0",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#9A8F86",
                                            display: "block",
                                            mb: 1.5,
                                        }}
                                    >
                                        Registered{" "}
                                        formatDate(employer.RegistrationCreatedAt)
                                    </Typography>

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={1.5}
                                    >
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<Check />}
                                            onClick={() =>
                                                openApprovalDialog(
                                                    employer,
                                                    "Approved"
                                                )
                                            }
                                            sx={{
                                                textTransform:
                                                    "none",
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                backgroundColor:
                                                    "#6A994E",
                                                boxShadow: "none",

                                                "&:hover": {
                                                    backgroundColor:
                                                        "#58843F",
                                                    boxShadow: "none",
                                                },
                                            }}
                                        >
                                            Accept
                                        </Button>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={
                                                <Cancel />
                                            }
                                            onClick={() =>
                                                openApprovalDialog(
                                                    employer,
                                                    "Rejected"
                                                )
                                            }
                                            sx={{
                                                textTransform:
                                                    "none",
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                color: "#B96868",
                                                borderColor:
                                                    "#E8C7C7",

                                                "&:hover": {
                                                    borderColor:
                                                        "#B96868",
                                                    backgroundColor:
                                                        "#FBE9E6",
                                                },
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </Stack>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            )}

            {/* FILTERS */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #E9DED0",
                    backgroundColor: "#FFFDF9",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "2fr 1fr 1fr",
                        },
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by name, email or company..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search
                                            sx={{
                                                color: "#9A8F86",
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FFFDF9",
                                "& fieldset": {
                                    borderColor: "#DCCFC2",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#CBBBAE",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#E76F51",
                                },
                            },
                        }}
                    />

                    <Select
                        fullWidth
                        size="small"
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(event.target.value)
                        }
                        sx={{
                            backgroundColor: "#FFFDF9",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor: "#CBBBAE",
                                },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor: "#E76F51",
                                },
                        }}
                    >
                        <MenuItem value="All">
                            All Roles
                        </MenuItem>

                        <MenuItem value="JobSeeker">
                            Job Seeker
                        </MenuItem>

                        <MenuItem value="Employer">
                            Employer
                        </MenuItem>

                        <MenuItem value="Admin">
                            Admin
                        </MenuItem>
                    </Select>

                    <Select
                        fullWidth
                        size="small"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        sx={{
                            backgroundColor: "#FFFDF9",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor: "#CBBBAE",
                                },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                    borderColor: "#E76F51",
                                },
                        }}
                    >
                        <MenuItem value="All">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="Active">
                            Active
                        </MenuItem>

                        <MenuItem value="Inactive">
                            Inactive
                        </MenuItem>
                    </Select>
                </Box>
            </Paper>

            {/* ERROR */}
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

            {/* USERS TABLE */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #E9DED0",
                    overflow: "hidden",
                    backgroundColor: "#FFFDF9",
                }}
            >
                <TableContainer
                    sx={{
                        maxHeight: "65vh",
                        overflowX: "auto",
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {[
                                    "User",
                                    "Email",
                                    "Role",
                                    "Company",
                                    "Status",
                                    "Date Joined",
                                ].map((heading) => (
                                    <TableCell
                                        key={heading}
                                        sx={{
                                            fontWeight: 800,
                                            color: "#5F554D",
                                            backgroundColor:
                                                "#FFF8EF",
                                            borderBottom:
                                                "1px solid #E9DED0",
                                            whiteSpace:
                                                "nowrap",
                                        }}
                                    >
                                        {heading}
                                    </TableCell>
                                ))}

                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#5F554D",
                                        backgroundColor:
                                            "#FFF8EF",
                                        borderBottom:
                                            "1px solid #E9DED0",
                                    }}
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{
                                            py: 8,
                                            borderBottom: "none",
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
                                                mt: 2,
                                                color: "#7A7068",
                                            }}
                                        >
                                            Loading users...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length ===
                              0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{
                                            py: 8,
                                            borderBottom: "none",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 58,
                                                height: 58,
                                                mx: "auto",
                                                mb: 1.5,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    "center",
                                                backgroundColor:
                                                    "#FFF1D6",
                                                color: "#E76F51",
                                            }}
                                        >
                                            <Search />
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#293241",
                                            }}
                                        >
                                            No users found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5,
                                                color: "#9A8F86",
                                            }}
                                        >
                                            Try changing your
                                            search or filters.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.UserID}
                                        hover
                                        sx={{
                                            "&:last-child td": {
                                                borderBottom: "none",
                                            },
                                            "&:hover": {
                                                backgroundColor:
                                                    "#FFFBF6",
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                sx={{
                                                    alignItems:
                                                        "center",
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor:
                                                            "#E76F51",
                                                        color: "#fff",
                                                        fontSize:
                                                            "0.85rem",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {getInitials(
                                                        user
                                                    )}
                                                </Avatar>

                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: "#293241",
                                                        }}
                                                    >
                                                        {[
                                                            user.FirstName,
                                                            user.MiddleName,
                                                            user.LastName,
                                                        ]
                                                            .filter(
                                                                Boolean
                                                            )
                                                            .join(
                                                                " "
                                                            )}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "#9A8F86",
                                                        }}
                                                    >
                                                        ID #
                                                        {
                                                            user.UserID
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#5F554D",
                                                }}
                                            >
                                                {user.Email}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={getRoleLabel(
                                                    user.Role
                                                )}
                                                size="small"
                                                sx={{
                                                    ...getRoleChipSx(
                                                        user.Role
                                                    ),
                                                    fontWeight: 800,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#5F554D",
                                                }}
                                            >
                                                {user.CompanyName ||
                                                    "—"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {user.Role ===
                                                "Employer" &&
                                            user.ApprovalStatus ===
                                                "Pending" ? (
                                                <Chip
                                                    label="Pending Approval"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "#A65F00",
                                                        backgroundColor:
                                                            "#FFF1D6",
                                                    }}
                                                />
                                            ) : user.Role ===
                                                  "Employer" &&
                                              user.ApprovalStatus ===
                                                  "Rejected" ? (
                                                <Chip
                                                    label="Rejected"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "#B96868",
                                                        backgroundColor:
                                                            "#FBE9E6",
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    icon={
                                                        user.IsActive ? (
                                                            <CheckCircle />
                                                        ) : (
                                                            <PersonOff />
                                                        )
                                                    }
                                                    label={
                                                        user.IsActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: user.IsActive
                                                            ? "#477A35"
                                                            : "#B96868",
                                                        backgroundColor:
                                                            user.IsActive
                                                                ? "#EDF4E8"
                                                                : "#FBE9E6",
                                                        "& .MuiChip-icon":
                                                            {
                                                                color: "inherit",
                                                            },
                                                    }}
                                                />
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#7A7068",
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                            {formatDate(user.RegistrationCreatedAt)}   
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            {user.Role ===
                                                "Employer" &&
                                            user.ApprovalStatus ===
                                                "Pending" ? (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    justifyContent="flex-end"
                                                >
                                                    <Tooltip title="Accept employer">
                                                        <IconButton
                                                            onClick={() =>
                                                                openApprovalDialog(
                                                                    user,
                                                                    "Approved"
                                                                )
                                                            }
                                                            sx={{
                                                                color: "#6A994E",
                                                                backgroundColor:
                                                                    "#EDF4E8",
                                                                "&:hover":
                                                                    {
                                                                        backgroundColor:
                                                                            "#DDEBD6",
                                                                    },
                                                            }}
                                                        >
                                                            <Check />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Reject employer">
                                                        <IconButton
                                                            onClick={() =>
                                                                openApprovalDialog(
                                                                    user,
                                                                    "Rejected"
                                                                )
                                                            }
                                                            sx={{
                                                                color: "#B96868",
                                                                backgroundColor:
                                                                    "#FBE9E6",
                                                                "&:hover":
                                                                    {
                                                                        backgroundColor:
                                                                            "#F5D9D6",
                                                                    },
                                                            }}
                                                        >
                                                            <Cancel />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            ) : (
                                                <Tooltip
                                                    title={
                                                        user.IsActive
                                                            ? "Disable user"
                                                            : "Enable user"
                                                    }
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            openStatusDialog(
                                                                user
                                                            )
                                                        }
                                                        sx={{
                                                            color: user.IsActive
                                                                ? "#B96868"
                                                                : "#6A994E",
                                                            backgroundColor:
                                                                user.IsActive
                                                                    ? "#FBE9E6"
                                                                    : "#EDF4E8",
                                                            "&:hover":
                                                                {
                                                                    backgroundColor:
                                                                        user.IsActive
                                                                            ? "#F5D9D6"
                                                                            : "#DDEBD6",
                                                                },
                                                        }}
                                                    >
                                                        {user.IsActive ? (
                                                            <PersonOff />
                                                        ) : (
                                                            <PersonAdd />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* USER STATUS DIALOG */}
            <Dialog
                open={Boolean(selectedUser)}
                onClose={closeStatusDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundColor: "#FFFDF9",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 900,
                        color: "#293241",
                    }}
                >
                    {selectedUser?.IsActive
                        ? "Disable User?"
                        : "Enable User?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "#7A7068",
                        }}
                    >
                        Are you sure you want to{" "}
                        <strong>
                            {selectedUser?.IsActive
                                ? "disable"
                                : "enable"}
                        </strong>{" "}
                        this account?

                        {selectedUser && (
                            <Box
                                component="span"
                                sx={{
                                    display: "block",
                                    mt: 1.5,
                                    fontWeight: 800,
                                    color: "#293241",
                                }}
                            >
                                {[
                                    selectedUser.FirstName,
                                    selectedUser.LastName,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={closeStatusDialog}
                        disabled={statusUpdating}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#7A7068",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleStatusChange}
                        disabled={statusUpdating}
                        startIcon={
                            statusUpdating ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : null
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            backgroundColor:
                                selectedUser?.IsActive
                                    ? "#B96868"
                                    : "#6A994E",
                            boxShadow: "none",

                            "&:hover": {
                                backgroundColor:
                                    selectedUser?.IsActive
                                        ? "#A75A5A"
                                        : "#58843F",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {statusUpdating
                            ? "Updating..."
                            : selectedUser?.IsActive
                            ? "Disable User"
                            : "Enable User"}
                    </Button>
                </DialogActions>

                <IconButton
                    onClick={closeStatusDialog}
                    disabled={statusUpdating}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#9A8F86",
                    }}
                >
                    <Close />
                </IconButton>
            </Dialog>

            {/* EMPLOYER APPROVAL DIALOG */}
            <Dialog
                open={Boolean(selectedEmployer)}
                onClose={closeApprovalDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundColor: "#FFFDF9",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 900,
                        color: "#293241",
                    }}
                >
                    {approvalDecision === "Approved"
                        ? "Approve Employer?"
                        : "Reject Employer?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "#7A7068",
                        }}
                    >
                        Are you sure you want to{" "}
                        <strong>
                            {approvalDecision === "Approved"
                                ? "approve"
                                : "reject"}
                        </strong>{" "}
                        this employer registration?

                        {selectedEmployer && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        "#FFF8EF",
                                    border:
                                        "1px solid #E9DED0",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: "#293241",
                                    }}
                                >
                                    {[
                                        selectedEmployer.FirstName,
                                        selectedEmployer.MiddleName,
                                        selectedEmployer.LastName,
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 0.5,
                                        color: "#7A7068",
                                    }}
                                >
                                    {selectedEmployer.Email}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#7A7068",
                                    }}
                                >
                                    {selectedEmployer.Phone ||
                                        "No phone number"}
                                </Typography>
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={closeApprovalDialog}
                        disabled={approvalUpdating}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#7A7068",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleEmployerApproval}
                        disabled={approvalUpdating}
                        startIcon={
                            approvalUpdating ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : approvalDecision ===
                              "Approved" ? (
                                <Check />
                            ) : (
                                <Cancel />
                            )
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            backgroundColor:
                                approvalDecision ===
                                "Approved"
                                    ? "#6A994E"
                                    : "#B96868",
                            boxShadow: "none",

                            "&:hover": {
                                backgroundColor:
                                    approvalDecision ===
                                    "Approved"
                                        ? "#58843F"
                                        : "#A75A5A",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {approvalUpdating
                            ? "Updating..."
                            : approvalDecision ===
                              "Approved"
                            ? "Approve Employer"
                            : "Reject Employer"}
                    </Button>
                </DialogActions>

                <IconButton
                    onClick={closeApprovalDialog}
                    disabled={approvalUpdating}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#9A8F86",
                    }}
                >
                    <Close />
                </IconButton>
            </Dialog>

            {/* SNACKBAR */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={() =>
                    setSnackbar((current) => ({
                        ...current,
                        open: false,
                    }))
                }
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((current) => ({
                            ...current,
                            open: false,
                        }))
                    }
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AdminUsers;

