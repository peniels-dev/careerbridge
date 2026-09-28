import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

function AdminStatCard({
    title,
    value,
    icon,
    description,
    iconBackground,
}) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                transition: "all 0.25s ease",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                        "0 16px 35px rgba(15, 23, 42, 0.08)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    {/* TEXT */}
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#64748b",
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                color: "#0f172a",
                                fontWeight: 800,
                                lineHeight: 1.1,
                            }}
                        >
                            {value}
                        </Typography>

                        {description && (
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: "#94a3b8",
                                    mt: 1,
                                }}
                            >
                                {description}
                            </Typography>
                        )}
                    </Box>

                    {/* ICON */}
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                iconBackground ||
                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                            color: "#fff",
                            flexShrink: 0,
                            boxShadow:
                                "0 8px 18px rgba(37, 99, 235, 0.18)",
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default AdminStatCard;