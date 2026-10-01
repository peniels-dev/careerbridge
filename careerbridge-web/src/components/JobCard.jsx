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
                backgroundColor: "#FFFDF9",
                border: "1px solid #E9DED0",
                borderRadius: 2.5,
                boxShadow: "0 3px 12px rgba(94, 65, 45, 0.07)",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 9px 22px rgba(94, 65, 45, 0.12)",
                },
            }}
        >
            {/* Small top accent */}
            <Box
                sx={{
                    height: 5,
                    backgroundColor: "#E76F51",
                    width: "100%",
                }}
            />

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
                        color: "#293241",
                        mb: 1.2,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
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
                        color: "#5F554D",
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        lineHeight: 1.5,
                        mb: 0.7,
                        fontWeight: 600,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    🏢 {job.CompanyName || "Company not specified"}
                </Typography>

                {/* LOCATION */}
                <Typography
                    sx={{
                        color: "#7A7068",
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        lineHeight: 1.5,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    📍 {job.Location || "Location not specified"}
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
                        sx={{
                            backgroundColor: "#FFF1D6",
                            color: "#8A5A00",
                            border: "1px solid #F4D7A1",
                            fontWeight: 600,
                            maxWidth: "100%",
                            "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                        }}
                    />

                    <Chip
                        label={job.CategoryName || "No category"}
                        size="small"
                        sx={{
                            backgroundColor: "#EDF4E8",
                            color: "#52743D",
                            border: "1px solid #CFE0C5",
                            fontWeight: 600,
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
                        sx={{
                            backgroundColor: job.Status
                                ? "#FDE9E3"
                                : "#F0ECE8",
                            color: job.Status
                                ? "#B84F38"
                                : "#6F665F",
                            border: job.Status
                                ? "1px solid #F3C5B8"
                                : "1px solid #DDD5CE",
                            fontWeight: 600,
                        }}
                    />
                </Box>

                <Divider
                    sx={{
                        mb: 2,
                        borderColor: "#E9DED0",
                    }}
                />

                {/* DESCRIPTION */}
                <Typography
                    sx={{
                        color: "#6F665F",
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
                            color: "#4E463F",
                            fontSize: {
                                xs: 12.5,
                                sm: 13,
                            },
                            lineHeight: 1.5,
                            fontWeight: 700,
                        }}
                    >
                        Application Deadline
                    </Typography>

                    <Typography
                        sx={{
                            color: "#7A7068",
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
                    onClick={() => onViewDetails(job.JobID)}
                    sx={{
                        minHeight: 42,
                        borderRadius: 1.5,
                        backgroundColor: "#E76F51",
                        color: "#FFFFFF",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: {
                            xs: 13,
                            sm: 14,
                        },
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "#D85F43",
                            boxShadow: "none",
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