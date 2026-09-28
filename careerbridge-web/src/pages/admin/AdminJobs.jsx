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
    Business,
    CheckCircle,
    Close,
    LocationOn,
    Refresh,
    Search,
    Work,
} from "@mui/icons-material";

import axiosAPI from "../../api/axiosAPI";


function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobTypeFilter, setJobTypeFilter] = useState("all");

    const [selectedJob, setSelectedJob] = useState(null);
    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });


    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosAPI.get("/admin/jobs");

            setJobs(response.data.data || []);
        } catch (error) {
            console.error("Admin jobs error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load jobs."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchJobs();
    }, []);


    const filteredJobs = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return jobs.filter((job) => {
            const matchesSearch =
                !searchValue ||
                job.JobTitle?.toLowerCase().includes(searchValue) ||
                job.CompanyName?.toLowerCase().includes(searchValue) ||
                job.Location?.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" &&
                    Boolean(job.Status)) ||
                (statusFilter === "closed" &&
                    !Boolean(job.Status));

            const matchesJobType =
                jobTypeFilter === "all" ||
                job.JobType === jobTypeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesJobType
            );
        });
    }, [jobs, search, statusFilter, jobTypeFilter]);


    const jobTypes = useMemo(() => {
        return [
            ...new Set(
                jobs
                    .map((job) => job.JobType)
                    .filter(Boolean)
            ),
        ];
    }, [jobs]);


    const activeJobs = jobs.filter(
        (job) => Boolean(job.Status)
    ).length;

    const closedJobs = jobs.length - activeJobs;


    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


   const openCloseDialog = (job) => {
    // Remove focus from the button before opening the dialog.
    // This prevents the focused button from being inside
    // an aria-hidden ancestor while the dialog opens.
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    setSelectedJob(job);
    setCloseDialogOpen(true);
};

    const closeCloseDialog = () => {
        if (closing) {
            return;
        }

        setCloseDialogOpen(false);
        setSelectedJob(null);
    };


    const handleCloseJob = async () => {
        if (!selectedJob) {
            return;
        }

        try {
            setClosing(true);

            const response = await axiosAPI.patch(
                `/admin/jobs/${selectedJob.JobID}/close`
            );

            setJobs((currentJobs) =>
                currentJobs.map((job) =>
                    job.JobID === selectedJob.JobID
                        ? {
                              ...job,
                              Status: false,
                          }
                        : job
                )
            );

            setSnackbar({
                open: true,
                message:
                    response.data.message ||
                    "Job closed successfully.",
                severity: "success",
            });

            setCloseDialogOpen(false);
            setSelectedJob(null);
        } catch (error) {
            console.error(
                "Close admin job error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to close job.",
                severity: "error",
            });
        } finally {
            setClosing(false);
        }
    };


    return (
        <Box>
            {/* Page Header */}
            <Box
                sx={{
                    mb: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "#0f172a",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Jobs
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.8,
                            color: "#64748b",
                        }}
                    >
                        Monitor and manage jobs posted
                        across CareerBridge.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchJobs}
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


            {/* Summary Cards */}
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
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2.5,
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                            }}
                        >
                            <Work />
                        </Avatar>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#64748b",
                                    fontWeight: 600,
                                }}
                            >
                                Total Jobs
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                }}
                            >
                                {jobs.length}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>


                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2.5,
                                backgroundColor: "#ecfdf5",
                                color: "#059669",
                            }}
                        >
                            <CheckCircle />
                        </Avatar>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#64748b",
                                    fontWeight: 600,
                                }}
                            >
                                Active Jobs
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                }}
                            >
                                {activeJobs}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>


                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2.5,
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                            }}
                        >
                            <Close />
                        </Avatar>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#64748b",
                                    fontWeight: 600,
                                }}
                            >
                                Closed Jobs
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mt: 0.3,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                }}
                            >
                                {closedJobs}
                            </Typography>
                        </Box>
                    </Stack>
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
                    backgroundColor: "#ffffff",
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
                        placeholder="Search by job title, company or location..."
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
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        displayEmpty
                    >
                        <MenuItem value="all">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="active">
                            Active
                        </MenuItem>

                        <MenuItem value="closed">
                            Closed
                        </MenuItem>
                    </Select>


                    <Select
                        fullWidth
                        size="small"
                        value={jobTypeFilter}
                        onChange={(event) =>
                            setJobTypeFilter(
                                event.target.value
                            )
                        }
                        displayEmpty
                    >
                        <MenuItem value="all">
                            All Job Types
                        </MenuItem>

                        {jobTypes.map((jobType) => (
                            <MenuItem
                                key={jobType}
                                value={jobType}
                            >
                                {jobType}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Paper>


            {/* Error */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2.5,
                    }}
                >
                    {error}
                </Alert>
            )}


            {/* Jobs Table */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        borderBottom:
                            "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                            }}
                        >
                            All Jobs
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.3,
                                color: "#94a3b8",
                            }}
                        >
                            {filteredJobs.length} job
                            {filteredJobs.length !== 1
                                ? "s"
                                : ""}{" "}
                            displayed
                        </Typography>
                    </Box>
                </Box>


                {loading ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : filteredJobs.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 3,
                            textAlign: "center",
                        }}
                    >
                        <Box>
                            <Work
                                sx={{
                                    fontSize: 48,
                                    color: "#cbd5e1",
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#334155",
                                }}
                            >
                                No jobs found
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.5,
                                    color: "#94a3b8",
                                }}
                            >
                                Try changing your search
                                or filters.
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor:
                                            "#f8fafc",
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Job
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Company
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Location
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Type
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Posted
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Deadline
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Status
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 800,
                                            color: "#475569",
                                        }}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>


                            <TableBody>
                                {filteredJobs.map(
                                    (job) => {
                                        const isActive =
                                            Boolean(
                                                job.Status
                                            );

                                        return (
                                            <TableRow
                                                key={
                                                    job.JobID
                                                }
                                                hover
                                                sx={{
                                                    "&:last-child td":
                                                        {
                                                            borderBottom: 0,
                                                        },
                                                }}
                                            >
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            minWidth: 180,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: "#0f172a",
                                                            }}
                                                        >
                                                            {
                                                                job.JobTitle
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: "#94a3b8",
                                                            }}
                                                        >
                                                            Job
                                                            #
                                                            {
                                                                job.JobID
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </TableCell>


                                                <TableCell>
                                                    <Stack
                                                        direction="row"
                                                        spacing={
                                                            1
                                                        }
                                                        sx={{
                                                            alignItems:
                                                                "center",
                                                            minWidth: 150,
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 34,
                                                                height: 34,
                                                                borderRadius: 2,
                                                                backgroundColor:
                                                                    "#eff6ff",
                                                                color: "#2563eb",
                                                                fontSize:
                                                                    "0.85rem",
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            {job.CompanyName?.charAt(
                                                                0
                                                            ) ||
                                                                "C"}
                                                        </Avatar>

                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: "#334155",
                                                            }}
                                                        >
                                                            {
                                                                job.CompanyName
                                                            }
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>


                                                <TableCell>
                                                    <Stack
                                                        direction="row"
                                                        spacing={
                                                            0.7
                                                        }
                                                        sx={{
                                                            alignItems:
                                                                "center",
                                                            minWidth: 130,
                                                        }}
                                                    >
                                                        <LocationOn
                                                            sx={{
                                                                fontSize: 17,
                                                                color: "#94a3b8",
                                                            }}
                                                        />

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#475569",
                                                            }}
                                                        >
                                                            {job.Location ||
                                                                "—"}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>


                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            job.JobType ||
                                                            "—"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 1.5,
                                                            fontWeight: 600,
                                                            backgroundColor:
                                                                "#f1f5f9",
                                                            color: "#475569",
                                                        }}
                                                    />
                                                </TableCell>


                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#475569",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {formatDate(
                                                            job.PostedDate
                                                        )}
                                                    </Typography>
                                                </TableCell>


                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#475569",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {formatDate(
                                                            job.ApplicationDeadline
                                                        )}
                                                    </Typography>
                                                </TableCell>


                                                <TableCell>
                                                    <Chip
                                                        icon={
                                                            isActive ? (
                                                                <CheckCircle />
                                                            ) : (
                                                                <Close />
                                                            )
                                                        }
                                                        label={
                                                            isActive
                                                                ? "Active"
                                                                : "Closed"
                                                        }
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 1.5,
                                                            fontWeight: 700,
                                                            backgroundColor:
                                                                isActive
                                                                    ? "#ecfdf5"
                                                                    : "#f1f5f9",
                                                            color:
                                                                isActive
                                                                    ? "#047857"
                                                                    : "#64748b",
                                                            "& .MuiChip-icon":
                                                                {
                                                                    color:
                                                                        "inherit",
                                                                    fontSize: 16,
                                                                },
                                                        }}
                                                    />
                                                </TableCell>


                                                <TableCell align="right">
                                                    {isActive ? (
                                                        <Tooltip title="Close job">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={
                                                                    <Close />
                                                                }
                                                                onClick={() =>
                                                                    openCloseDialog(
                                                                        job
                                                                    )
                                                                }
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform:
                                                                        "none",
                                                                    fontWeight: 700,
                                                                    borderColor:
                                                                        "#fecaca",
                                                                    color: "#dc2626",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                    "&:hover":
                                                                        {
                                                                            borderColor:
                                                                                "#f87171",
                                                                            backgroundColor:
                                                                                "#fef2f2",
                                                                        },
                                                                }}
                                                            >
                                                                Close
                                                            </Button>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#94a3b8",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Closed
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>


            {/* Close Job Confirmation */}
            <Dialog
                open={closeDialogOpen}
                onClose={closeCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                    }}
                >
                    Close this job?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: "#64748b",
                        }}
                    >
                        Are you sure you want to close{" "}
                        <strong>
                            {selectedJob?.JobTitle}
                        </strong>
                        ? The job will no longer be active
                        for job seekers.
                    </DialogContentText>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                    }}
                >
                    <Button
                        onClick={closeCloseDialog}
                        disabled={closing}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            color: "#475569",
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleCloseJob}
                        disabled={closing}
                        variant="contained"
                        color="error"
                        startIcon={
                            closing ? (
                                <CircularProgress
                                    size={17}
                                    color="inherit"
                                />
                            ) : (
                                <Close />
                            )
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                        }}
                    >
                        {closing
                            ? "Closing..."
                            : "Close Job"}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((current) => ({
                        ...current,
                        open: false,
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity={snackbar.severity}
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

export default AdminJobs;