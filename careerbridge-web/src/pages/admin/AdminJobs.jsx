import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
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
        } catch (err) {
            console.error("Failed to fetch admin jobs:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load jobs. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                job.JobTitle?.toLowerCase().includes(searchText) ||
                job.CompanyName?.toLowerCase().includes(searchText) ||
                job.Location?.toLowerCase().includes(searchText);

            const isActive =
                job.Status === true ||
                job.Status === 1 ||
                job.Status === "1";

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "closed" && !isActive);

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

    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
        (job) =>
            job.Status === true ||
            job.Status === 1 ||
            job.Status === "1"
    ).length;

    const closedJobs = totalJobs - activeJobs;

    const jobTypes = useMemo(() => {
        const types = jobs
            .map((job) => job.JobType)
            .filter(Boolean);

        return [...new Set(types)];
    }, [jobs]);

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString("en-GH", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const isJobActive = (job) => {
        return (
            job.Status === true ||
            job.Status === 1 ||
            job.Status === "1"
        );
    };

    const handleCloseJob = async () => {
        if (!selectedJob) return;

        try {
            setClosing(true);

            await axiosAPI.patch(
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
                message: "Job posting closed successfully.",
                severity: "success",
            });

            setSelectedJob(null);
        } catch (err) {
            console.error("Failed to close job:", err);

            setSnackbar({
                open: true,
                message:
                    err.response?.data?.message ||
                    "Unable to close this job.",
                severity: "error",
            });
        } finally {
            setClosing(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setJobTypeFilter("all");
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100%",
                    backgroundColor: "#FFF8EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress
                        size={38}
                        sx={{ color: "#E76F51", mb: 2 }}
                    />

                    <Typography
                        sx={{
                            color: "#5F554D",
                            fontWeight: 600,
                        }}
                    >
                        Loading jobs...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100%",
                backgroundColor: "#FFF8EF",
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
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: 1.4,
                            color: "#E76F51",
                            mb: 0.7,
                        }}
                    >
                        CAREERBRIDGE ADMIN
                    </Typography>

                    <Typography
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: 28,
                                sm: 34,
                            },
                            fontWeight: 900,
                            color: "#293241",
                            letterSpacing: "-0.8px",
                        }}
                    >
                        Jobs
                    </Typography>

                    <Typography
                        sx={{
                            color: "#766C64",
                            mt: 0.5,
                            fontSize: 15,
                        }}
                    >
                        Review and manage job postings on CareerBridge.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchJobs}
                    sx={{
                        borderColor: "#DCCFC2",
                        color: "#293241",
                        backgroundColor: "#FFFDF9",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                        "&:hover": {
                            borderColor: "#E76F51",
                            backgroundColor: "#FFF1D6",
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

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

            {/* STAT CARDS */}
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
                {/* TOTAL */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                backgroundColor: "#FFF1D6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Work
                                sx={{
                                    color: "#F4A261",
                                    fontSize: 24,
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#766C64",
                                    fontWeight: 600,
                                }}
                            >
                                Total Jobs
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 28,
                                    fontWeight: 900,
                                    color: "#293241",
                                    lineHeight: 1.1,
                                }}
                            >
                                {totalJobs}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* ACTIVE */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                backgroundColor: "#EDF4E8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CheckCircle
                                sx={{
                                    color: "#6A994E",
                                    fontSize: 24,
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#766C64",
                                    fontWeight: 600,
                                }}
                            >
                                Active Jobs
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 28,
                                    fontWeight: 900,
                                    color: "#293241",
                                    lineHeight: 1.1,
                                }}
                            >
                                {activeJobs}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* CLOSED */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        backgroundColor: "#FFFDF9",
                        border: "1px solid #E9DED0",
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                backgroundColor: "#F3ECE6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Close
                                sx={{
                                    color: "#8A7F76",
                                    fontSize: 24,
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#766C64",
                                    fontWeight: 600,
                                }}
                            >
                                Closed Jobs
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 28,
                                    fontWeight: 900,
                                    color: "#293241",
                                    lineHeight: 1.1,
                                }}
                            >
                                {closedJobs}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* FILTERS */}
            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                    mb: 3,
                    backgroundColor: "#FFFDF9",
                    border: "1px solid #E9DED0",
                    borderRadius: 3,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#293241",
                        mb: 1.5,
                    }}
                >
                    Find a job
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "2fr 1fr 1fr auto",
                        },
                        gap: 1.5,
                        alignItems: "center",
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by job, company or location..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search
                                        sx={{
                                            color: "#E76F51",
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#FFFDF9",
                                borderRadius: 2,
                                "& fieldset": {
                                    borderColor: "#DCCFC2",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#E76F51",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#E76F51",
                                },
                            },
                        }}
                    />

                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        sx={{
                            backgroundColor: "#FFFDF9",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                        }}
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
                        size="small"
                        value={jobTypeFilter}
                        onChange={(event) =>
                            setJobTypeFilter(event.target.value)
                        }
                        sx={{
                            backgroundColor: "#FFFDF9",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DCCFC2",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E76F51",
                            },
                        }}
                    >
                        <MenuItem value="all">
                            All Job Types
                        </MenuItem>

                        {jobTypes.map((type) => (
                            <MenuItem
                                key={type}
                                value={type}
                            >
                                {type}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button
                        variant="text"
                        onClick={clearFilters}
                        sx={{
                            color: "#E76F51",
                            textTransform: "none",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Paper>

            {/* RESULTS COUNT */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                    px: 0.5,
                }}
            >
                <Typography
                    sx={{
                        color: "#5F554D",
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    {filteredJobs.length}{" "}
                    {filteredJobs.length === 1
                        ? "job"
                        : "jobs"}{" "}
                    found
                </Typography>
            </Box>

            {/* JOBS TABLE */}
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: "#FFFDF9",
                    border: "1px solid #E9DED0",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                {filteredJobs.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 3,
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
                            <Work
                                sx={{
                                    fontSize: 30,
                                    color: "#E76F51",
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 800,
                                color: "#293241",
                                mb: 0.5,
                            }}
                        >
                            No jobs found
                        </Typography>

                        <Typography
                            sx={{
                                color: "#766C64",
                                fontSize: 14,
                            }}
                        >
                            Try changing your search or filters.
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            overflowX: "auto",
                        }}
                    >
                        <Box
                            component="table"
                            sx={{
                                width: "100%",
                                minWidth: 950,
                                borderCollapse: "collapse",
                            }}
                        >
                            <Box component="thead">
                                <Box
                                    component="tr"
                                    sx={{
                                        backgroundColor: "#FFF1D6",
                                    }}
                                >
                                    {[
                                        "Job",
                                        "Company",
                                        "Location",
                                        "Type",
                                        "Posted",
                                        "Deadline",
                                        "Status",
                                        "Action",
                                    ].map((heading) => (
                                        <Box
                                            component="th"
                                            key={heading}
                                            sx={{
                                                textAlign: "left",
                                                px: 2,
                                                py: 1.7,
                                                fontSize: 12,
                                                fontWeight: 800,
                                                color: "#5F554D",
                                                borderBottom:
                                                    "1px solid #E9DED0",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {heading}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Box component="tbody">
                                {filteredJobs.map((job) => {
                                    const active =
                                        isJobActive(job);

                                    return (
                                        <Box
                                            component="tr"
                                            key={job.JobID}
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor:
                                                        "#FFF8EF",
                                                },
                                            }}
                                        >
                                            {/* JOB */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                    verticalAlign:
                                                        "top",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: "#293241",
                                                        fontSize: 14,
                                                        maxWidth: 190,
                                                    }}
                                                >
                                                    {job.JobTitle ||
                                                        "Untitled Job"}
                                                </Typography>
                                            </Box>

                                            {/* COMPANY */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Business
                                                        sx={{
                                                            fontSize: 18,
                                                            color: "#E76F51",
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontSize: 14,
                                                            color: "#5F554D",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {job.CompanyName ||
                                                            "—"}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* LOCATION */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 0.8,
                                                    }}
                                                >
                                                    <LocationOn
                                                        sx={{
                                                            fontSize: 17,
                                                            color: "#6A994E",
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontSize: 14,
                                                            color: "#5F554D",
                                                        }}
                                                    >
                                                        {job.Location ||
                                                            "—"}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* TYPE */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        job.JobType ||
                                                        "—"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            "#F3ECE6",
                                                        color: "#5F554D",
                                                        fontWeight: 700,
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                            </Box>

                                            {/* POSTED */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                    color: "#766C64",
                                                    fontSize: 13,
                                                }}
                                            >
                                                {formatDate(
                                                    job.PostedDate
                                                )}
                                            </Box>

                                            {/* DEADLINE */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                    color: "#766C64",
                                                    fontSize: 13,
                                                }}
                                            >
                                                {formatDate(
                                                    job.ApplicationDeadline
                                                )}
                                            </Box>

                                            {/* STATUS */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        active
                                                            ? "Active"
                                                            : "Closed"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            active
                                                                ? "#EDF4E8"
                                                                : "#F3ECE6",
                                                        color: active
                                                            ? "#557F3D"
                                                            : "#766C64",
                                                        fontWeight: 800,
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                            </Box>

                                            {/* ACTION */}
                                            <Box
                                                component="td"
                                                sx={{
                                                    px: 2,
                                                    py: 2,
                                                    borderBottom:
                                                        "1px solid #EFE5DC",
                                                }}
                                            >
                                                {active ? (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() =>
                                                            setSelectedJob(
                                                                job
                                                            )
                                                        }
                                                        sx={{
                                                            textTransform:
                                                                "none",
                                                            fontWeight: 700,
                                                            color: "#C8553D",
                                                            borderColor:
                                                                "#E9B7A9",
                                                            borderRadius: 1.5,
                                                            "&:hover": {
                                                                backgroundColor:
                                                                    "#FFF0EC",
                                                                borderColor:
                                                                    "#E76F51",
                                                            },
                                                        }}
                                                    >
                                                        Close Job
                                                    </Button>
                                                ) : (
                                                    <Typography
                                                        sx={{
                                                            fontSize: 13,
                                                            color: "#9A8F87",
                                                        }}
                                                    >
                                                        No action
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* CLOSE JOB DIALOG */}
            <Dialog
                open={Boolean(selectedJob)}
                onClose={() =>
                    !closing && setSelectedJob(null)
                }
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        backgroundColor: "#FFFDF9",
                        borderRadius: 3,
                        border: "1px solid #E9DED0",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#293241",
                        fontWeight: 900,
                        pb: 1,
                    }}
                >
                    Close this job?
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{
                            color: "#5F554D",
                            lineHeight: 1.7,
                        }}
                    >
                        Are you sure you want to close{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 800,
                                color: "#293241",
                            }}
                        >
                            {selectedJob?.JobTitle}
                        </Box>
                        ? Applicants will no longer be able to
                        apply for this job.
                    </Typography>
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
                            setSelectedJob(null)
                        }
                        disabled={closing}
                        sx={{
                            color: "#5F554D",
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCloseJob}
                        disabled={closing}
                        sx={{
                            backgroundColor: "#E76F51",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 2,
                            px: 2.5,
                            "&:hover": {
                                backgroundColor: "#D85F43",
                            },
                        }}
                    >
                        {closing ? (
                            <CircularProgress
                                size={20}
                                sx={{
                                    color: "#fff",
                                }}
                            />
                        ) : (
                            "Close Job"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
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