import { useNavigate } from "react-router-dom";

import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F8FAFC",
            }}
        >
            {/* NAVBAR */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: "#FFFFFF",
                    color: "#0F172A",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Toolbar>

                    <Typography
                        variant="h5"
                        fontWeight={800}
                        color="primary"
                    >
                        CareerBridge
                    </Typography>

                    {/* Push user section to far right */}
                    <Box sx={{ flexGrow: 1 }} />

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                width: 42,
                                height: 42,
                            }}
                        >
                            {user?.firstName
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </Avatar>

                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                            }}
                        >
                            <Typography
                                variant="body2"
                                fontWeight={700}
                            >
                                {user?.firstName} {user?.lastName}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {user?.role === "JobSeeker"
                                    ? "Job Seeker"
                                    : "Employer"}
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            sx={{
                                ml: 2,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Logout
                        </Button>
                    </Stack>

                </Toolbar>
            </AppBar>

            {/* CONTENT */}
            <Container
                maxWidth="lg"
                sx={{ py: 6 }}
            >

                {/* WELCOME */}
                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                md: "2.7rem",
                            },
                        }}
                    >
                        Welcome back,{" "}
                        {user?.firstName || "User"}! 👋
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            fontSize: "1.05rem",
                        }}
                    >
                        Find opportunities, manage your
                        applications, and build your career
                        with CareerBridge.
                    </Typography>
                </Box>

                {/* CARDS */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                        mb: 5,
                    }}
                >

                    {/* JOBS */}
                    <Card
                        elevation={0}
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>

                            <Typography
                                variant="h2"
                                sx={{ mb: 2 }}
                            >
                                💼
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Jobs
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Browse available jobs and
                                internship opportunities.
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    borderRadius: 2,
                                    textTransform: "none",
                                }}
                            >
                                Browse Jobs
                            </Button>

                        </CardContent>
                    </Card>

                    {/* APPLICATIONS */}
                    <Card
                        elevation={0}
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>

                            <Typography
                                variant="h2"
                                sx={{ mb: 2 }}
                            >
                                📋
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Applications
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Track the jobs you have applied
                                for and monitor their status.
                            </Typography>

                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    borderRadius: 2,
                                    textTransform: "none",
                                }}
                            >
                                My Applications
                            </Button>

                        </CardContent>
                    </Card>

                    {/* PROFILE */}
                    <Card
                        elevation={0}
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>

                            <Typography
                                variant="h2"
                                sx={{ mb: 2 }}
                            >
                                👤
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Profile
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Manage your personal information
                                and career profile.
                            </Typography>

                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    borderRadius: 2,
                                    textTransform: "none",
                                }}
                            >
                                View Profile
                            </Button>

                        </CardContent>
                    </Card>

                </Box>

                {/* ACCOUNT */}
                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: 4 }}>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Your CareerBridge Account
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1, mb: 3 }}
                        >
                            You are currently signed in as:
                        </Typography>

                        <Typography
                            color="primary"
                            fontWeight={700}
                            fontSize="1.1rem"
                        >
                            {user?.role === "JobSeeker"
                                ? "Job Seeker"
                                : "Employer"}
                        </Typography>

                    </CardContent>
                </Card>

            </Container>
        </Box>
    );
}

export default Dashboard;