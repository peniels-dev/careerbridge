import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Paper
} from "@mui/material";
import axiosAPI from "../api/axiosAPI";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosAPI.get(`/jobs/${id}`);

                const returnedJob =
                    response.data.data ||
                    response.data.job;

                setJob(returnedJob);

            } catch (err) {
                console.error("Error loading job details:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load job details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 6
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/jobs")}
                >
                    Back to Jobs
                </Button>
            </Container>
        );
    }

    if (!job) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="warning">
                    Job not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/jobs")}
                >
                    Back to Jobs
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Paper sx={{ p: 4 }} elevation={3}>

                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                >
                    {job.JobTitle}
                </Typography>

                <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                >
                    {job.CompanyName}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    <strong>Category:</strong>{" "}
                    {job.CategoryName}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    <strong>Location:</strong>{" "}
                    {job.Location}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    <strong>Job Type:</strong>{" "}
                    {job.JobType}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    <strong>Posted:</strong>{" "}
                    {job.PostedDate
                        ? new Date(job.PostedDate).toLocaleDateString()
                        : "Not available"}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                    <strong>Application Deadline:</strong>{" "}
                    {job.ApplicationDeadline
                        ? new Date(
                              job.ApplicationDeadline
                          ).toLocaleDateString()
                        : "Not available"}
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Job Description
                    </Typography>

                    <Typography>
                        {job.Description}
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // We will connect this to
                            // the application page next.
                            alert("Apply feature coming next!");
                        }}
                    >
                        Apply for Job
                    </Button>

                    <Button
                        sx={{ ml: 2 }}
                        variant="outlined"
                        onClick={() => navigate("/jobs")}
                    >
                        Back to Jobs
                    </Button>
                </Box>

            </Paper>
        </Container>
    );
};

export default JobDetails;