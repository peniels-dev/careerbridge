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
            console.error("Failed to load admin users:", err);

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
        if (role === "JobSeeker" || role === "Job seeker") {
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
            {/* Page Header */}
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
                        Manage CareerBridge accounts and
                        account access.
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
                        "&:hover": {
                            borderColor: "#94a3b8",
                            backgroundColor: "#f8fafc",
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* Summary */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
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
                        backgroundColor: "#fff",
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
                        backgroundColor: "#fff",
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
                        backgroundColor: "#fff",
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
            </Box>

            {/* Filters */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#fff",
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
                            setRoleFilter(event.target.value)
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
                            setStatusFilter(event.target.value)
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

            {/* Error */}
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

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    backgroundColor: "#fff",
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
                                        whiteSpace: "nowrap",
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
                                        whiteSpace: "nowrap",
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
                                        whiteSpace: "nowrap",
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
                                        whiteSpace: "nowrap",
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
                                        whiteSpace: "nowrap",
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
                                        whiteSpace: "nowrap",
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
                                        whiteSpace: "nowrap",
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
                            ) : filteredUsers.length === 0 ? (
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
                                                alignItems: "center",
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
                                                        "&:hover":
                                                            {
                                                                backgroundColor:
                                                                    user.IsActive
                                                                        ? "#fef2f2"
                                                                        : "#f0fdf4",
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Confirmation Dialog */}
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

            {/* Snackbar */}
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