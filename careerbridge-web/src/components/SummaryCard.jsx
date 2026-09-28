import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

const SummaryCard = ({
    title,
    value,
    description,
    icon,
    iconBackground,
    iconColor,
}) => {
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #eaecf0",
                boxShadow:
                    "0 3px 12px rgba(16,24,40,0.04)",
                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                        "0 8px 24px rgba(16,24,40,0.08)",
                },
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2.5,
                            sm: 3,
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                color: "#667085",
                                fontSize: {
                                    xs: 13,
                                    sm: 14,
                                },
                                fontWeight: 600,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 28,
                                    sm: 32,
                                },
                                fontWeight: 800,
                                lineHeight: 1.2,
                                mt: 0.5,
                                color: "#172033",
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            width: {
                                xs: 44,
                                sm: 48,
                            },
                            height: {
                                xs: 44,
                                sm: 48,
                            },
                            flexShrink: 0,
                            backgroundColor:
                                iconBackground,
                            color: iconColor,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>

                <Typography
                    sx={{
                        color: "#667085",
                        fontSize: 12,
                        lineHeight: 1.5,
                        mt: 2,
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SummaryCard;