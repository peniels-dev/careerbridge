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
    console.log("🔥 ADMIN USERS COMPONENT IS RENDERING");
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
        console.log("LOAD USERS FUNCTION STARTED");
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/admin/users");
            console.log("ADMIN USERS RESPONSE:", response.data);

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
    console.log("ADMIN USERS COMPONENT MOUNTED");
    loadUsers();
}, []);   

    /*
     * Get employers waiting for admin approval.
     */
    const pendingEmployers = useMemo(() => {
        return users.filter(
            (user) =>
                user.Role === "Employer" &&
                user.ApprovalStatus === "Pending"
        );
    }, [users]);

    /*
     * Filter main users table.
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

            const newStatus = !Boolean(
                selectedUser.IsActive
            );

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
     *
     * Backend endpoint:
     * PATCH /admin/employers/:id/approval
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
        const first =
            user.FirstName?.charAt(0) || "";

        const last =
            user.LastName?.charAt(0) || "";

        return `${first}${last}`.toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
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

    const getRoleColor = (role) => {
        if (
            role === "JobSeeker" ||
            role === "Job seeker"
        ) {
            return "primary";
        }

        if (role === "Employer") {
            return "secondary";
        }

        if (role === "Admin") {
            return "warning";
        }

        return "default";
    };

    return (
        <Box>
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
                            fontWeight: 800,
                            color: "#0f172a",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        User Management
                    </Typography>

                    <Typography
                        sx={{
                            color: "#64748b",
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
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: "#dbe2ea",
                        color: "#334155",
                        px: 2,
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
                        sm: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            fontWeight: 600,
                        }}
                    >
                        Total Users
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            mt: 0.5,
                            fontWeight: 800,
                            color: "#0f172a",
                        }}
                    >
                        {users.length}
                    </Typography>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            fontWeight: 600,
                        }}
                    >
                        Active Users
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            mt: 0.5,
                            fontWeight: 800,
                            color: "#16a34a",
                        }}
                    >
                        {
                            users.filter(
                                (user) => user.IsActive
                            ).length
                        }
                    </Typography>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            fontWeight: 600,
                        }}
                    >
                        Inactive Users
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            mt: 0.5,
                            fontWeight: 800,
                            color: "#dc2626",
                        }}
                    >
                        {
                            users.filter(
                                (user) => !user.IsActive
                            ).length
                        }
                    </Typography>
                </Paper>

                {/* PENDING EMPLOYERS */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border:
                            pendingEmployers.length > 0
                                ? "1px solid #bfdbfe"
                                : "1px solid #e5e7eb",
                        background:
                            pendingEmployers.length > 0
                                ? "linear-gradient(135deg, #eff6ff, #f8fafc)"
                                : "#ffffff",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            fontWeight: 600,
                        }}
                    >
                        Pending Employers
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            mt: 0.5,
                            fontWeight: 800,
                            color:
                                pendingEmployers.length > 0
                                    ? "#2563eb"
                                    : "#0f172a",
                        }}
                    >
                        {pendingEmployers.length}
                    </Typography>

                    {pendingEmployers.length > 0 && (
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mt: 0.5,
                                color: "#2563eb",
                                fontWeight: 600,
                            }}
                        >
                            Requires review
                        </Typography>
                    )}
                </Paper>
            </Box>

            {/* =====================================================
                EMPLOYER APPROVAL SECTION
            ====================================================== */}

            {pendingEmployers.length > 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: "2px solid #bfdbfe",
                        overflow: "hidden",
                        boxShadow:
                            "0 8px 30px rgba(37, 99, 235, 0.08)",
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
                            background:
                                "linear-gradient(135deg, #eff6ff, #f8fafc)",
                            borderBottom:
                                "1px solid #dbeafe",
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
                                    borderRadius: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor:
                                        "#dbeafe",
                                    color: "#2563eb",
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
                                            fontWeight: 800,
                                            color: "#0f172a",
                                        }}
                                    >
                                        Employer Registrations
                                    </Typography>

                                    <Chip
                                        label={`${pendingEmployers.length} Pending`}
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#1d4ed8",
                                            backgroundColor:
                                                "#dbeafe",
                                        }}
                                    />
                                </Stack>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 0.5,
                                        color: "#64748b",
                                    }}
                                >
                                    These employers are waiting
                                    for admin approval before
                                    they can access employer
                                    features.
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
                                    borderRadius: 3,
                                    border: "1px solid #e2e8f0",
                                    backgroundColor:
                                        "#ffffff",
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
                                            background:
                                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {getInitials(
                                            employer
                                        )}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#0f172a",
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
                                                color: "#64748b",
                                                mt: 0.25,
                                            }}
                                        >
                                            {employer.Email}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#64748b",
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
                                            color: "#92400e",
                                            backgroundColor:
                                                "#fef3c7",
                                        }}
                                    />
                                </Stack>

                                <Box
                                    sx={{
                                        mt: 2,
                                        pt: 2,
                                        borderTop:
                                            "1px solid #f1f5f9",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#94a3b8",
                                            display: "block",
                                            mb: 1.5,
                                        }}
                                    >
                                        Registered{" "}
                                        {formatDate(
                                            employer.CreatedOn
                                        )}
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                    >
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={
                                                <Check />
                                            }
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
                                                    "#16a34a",
                                                "&:hover": {
                                                    backgroundColor:
                                                        "#15803d",
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
                                                color: "#dc2626",
                                                borderColor:
                                                    "#fecaca",
                                                "&:hover": {
                                                    borderColor:
                                                        "#dc2626",
                                                    backgroundColor:
                                                        "#fef2f2",
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
                    border: "1px solid #e5e7eb",
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
                                                color: "#94a3b8",
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Select
                        fullWidth
                        size="small"
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(
                                event.target.value
                            )
                        }
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
                            setStatusFilter(
                                event.target.value
                            )
                        }
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

            {/* MAIN USERS TABLE */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
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
                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    User
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    Email
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    Role
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    Company
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    Status
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    Date Joined
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 800,
                                        color: "#475569",
                                        backgroundColor:
                                            "#f8fafc",
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
                                        sx={{ py: 8 }}
                                    >
                                        <CircularProgress
                                            size={32}
                                        />

                                        <Typography
                                            sx={{
                                                mt: 2,
                                                color: "#64748b",
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
                                        sx={{ py: 8 }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#334155",
                                            }}
                                        >
                                            No users found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5,
                                                color: "#94a3b8",
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
                                                        background:
                                                            "linear-gradient(135deg, #2563eb, #4f46e5)",
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
                                                            color: "#0f172a",
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
                                                            color: "#94a3b8",
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
                                                    color: "#475569",
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
                                                color={getRoleColor(
                                                    user.Role
                                                )}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#475569",
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
                                                        color: "#92400e",
                                                        backgroundColor:
                                                            "#fef3c7",
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
                                                        color: "#b91c1c",
                                                        backgroundColor:
                                                            "#fee2e2",
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
                                                            ? "#15803d"
                                                            : "#b91c1c",
                                                        backgroundColor:
                                                            user.IsActive
                                                                ? "#dcfce7"
                                                                : "#fee2e2",
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
                                                    color: "#64748b",
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {formatDate(
                                                    user.CreatedOn
                                                )}
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
                                                                color: "#16a34a",
                                                                backgroundColor:
                                                                    "#f0fdf4",
                                                                "&:hover":
                                                                    {
                                                                        backgroundColor:
                                                                            "#dcfce7",
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
                                                                color: "#dc2626",
                                                                backgroundColor:
                                                                    "#fef2f2",
                                                                "&:hover":
                                                                    {
                                                                        backgroundColor:
                                                                            "#fee2e2",
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
                                                                ? "#dc2626"
                                                                : "#16a34a",
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
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                    }}
                >
                    {selectedUser?.IsActive
                        ? "Disable User?"
                        : "Enable User?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "#64748b",
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
                                    fontWeight: 700,
                                    color: "#0f172a",
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
                            color: "#64748b",
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
                                    ? "#dc2626"
                                    : "#16a34a",
                            "&:hover": {
                                backgroundColor:
                                    selectedUser?.IsActive
                                        ? "#b91c1c"
                                        : "#15803d",
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
                        color: "#94a3b8",
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
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                    }}
                >
                    {approvalDecision === "Approved"
                        ? "Approve Employer?"
                        : "Reject Employer?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "#64748b",
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
                                        "#f8fafc",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        color: "#0f172a",
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
                                        color: "#64748b",
                                    }}
                                >
                                    {selectedEmployer.Email}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#64748b",
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
                            color: "#64748b",
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
                                    ? "#16a34a"
                                    : "#dc2626",
                            "&:hover": {
                                backgroundColor:
                                    approvalDecision ===
                                    "Approved"
                                        ? "#15803d"
                                        : "#b91c1c",
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
                        color: "#94a3b8",
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
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AdminUsers;