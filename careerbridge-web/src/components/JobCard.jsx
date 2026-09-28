import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
} from "@mui/material";

function JobCard({ job, onViewDetails }) {
    const description = job.Description
        ? job.Description.length > 120
            ? `${job.Description.substring(0, 120)}...`
            : job.Description
        : "No description available.";

    const deadline = job.ApplicationDeadline
        ? new Date(job.ApplicationDeadline).toLocaleDateString()
        : "Not specified";

    return (
        <Card
            sx={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(16, 24, 40, 0.06)",
                backgroundColor: "#ffffff",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    boxShadow:
                        "0 8px 24px rgba(16, 24, 40, 0.10)",
                    transform: "translateY(-3px)",
                },
            }}
        >
            <CardContent
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                }}
            >
                {/* JOB TITLE */}
                <Typography
                    component="h2"
                    sx={{
                        fontSize: {
                            xs: 17,
                            sm: 18,
                        },
                        lineHeight: 1.35,
                        fontWeight: 800,
                        color: "#101828",
                        mb: 1.5,

                        // Prevent long titles from breaking the card
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",

                        // Keep card heights consistent
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {job.JobTitle || "Untitled Job"}
                </Typography>

                {/* COMPANY */}
                <Typography
                    sx={{
                        color: "#475467",
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        lineHeight: 1.5,
                        mb: 0.75,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    🏢{" "}
                    {job.CompanyName || "Company not specified"}
                </Typography>

                {/* LOCATION */}
                <Typography
                    sx={{
                        color: "#667085",
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        lineHeight: 1.5,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    📍{" "}
                    {job.Location || "Location not specified"}
                </Typography>

                {/* CHIPS */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 0.75,
                        mt: 2,
                        mb: 2,
                        minWidth: 0,
                    }}
                >
                    <Chip
                        label={job.JobType || "Not specified"}
                        size="small"
                        variant="outlined"
                        sx={{
                            maxWidth: "100%",
                            "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                        }}
                    />

                    <Chip
                        label={
                            job.CategoryName || "No category"
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                            maxWidth: "100%",
                            "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                        }}
                    />

                    <Chip
                        label={job.Status ? "Active" : "Closed"}
                        size="small"
                        color={job.Status ? "success" : "default"}
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* DESCRIPTION */}
                <Typography
                    sx={{
                        color: "#667085",
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        lineHeight: 1.65,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",

                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {description}
                </Typography>

                {/* DEADLINE */}
                <Box
                    sx={{
                        mt: "auto",
                        pt: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: "#344054",
                            fontSize: {
                                xs: 12.5,
                                sm: 13,
                            },
                            lineHeight: 1.5,
                            fontWeight: 700,
                            overflowWrap: "anywhere",
                        }}
                    >
                        Application Deadline
                    </Typography>

                    <Typography
                        sx={{
                            color: "#667085",
                            fontSize: {
                                xs: 12.5,
                                sm: 13,
                            },
                            lineHeight: 1.5,
                            mt: 0.25,
                        }}
                    >
                        {deadline}
                    </Typography>
                </Box>
            </CardContent>

            {/* BUTTON */}
            <Box
                sx={{
                    px: {
                        xs: 2,
                        sm: 2.5,
                    },
                    pb: {
                        xs: 2,
                        sm: 2.5,
                    },
                    pt: 0,
                }}
            >
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() =>
                        onViewDetails(job.JobID)
                    }
                    sx={{
                        minHeight: 42,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                    }}
                >
                    View Details
                </Button>
            </Box>
        </Card>
    );
}

export default JobCard;

