import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F8FAFC",
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={0}
                    sx={{
                        textAlign: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: { xs: 4, sm: 6 } }}>

                        <Typography
                            sx={{
                                fontSize: "5rem",
                                mb: 2,
                            }}
                        >
                            🔒
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={800}
                            color="primary"
                            gutterBottom
                        >
                            Access Denied
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                lineHeight: 1.7,
                            }}
                        >
                            You don't have permission to access this page.
                            Please return to your dashboard or sign in with
                            an account that has the required permissions.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/dashboard")}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 4,
                                py: 1.3,
                            }}
                        >
                            Back to Dashboard
                        </Button>

                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Unauthorized;