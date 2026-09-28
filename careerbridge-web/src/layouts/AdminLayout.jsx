import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import {
    DashboardRounded,
    PeopleAltRounded,
    WorkRounded,
    DescriptionRounded,
    MenuRounded,
    LogoutRounded,
    BusinessRounded,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";

const drawerWidth = 260;

function AdminLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();
    const { user } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const menuItems = [
        {
            label: "Dashboard",
            path: "/admin",
            icon: <DashboardRounded />,
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: <PeopleAltRounded />,
        },
        {
            label: "Jobs",
            path: "/admin/jobs",
            icon: <WorkRounded />,
        },
        {
            label: "Applications",
            path: "/admin/applications",
            icon: <DescriptionRounded />,
        },
    ];

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background:
                    "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
                color: "#fff",
            }}
        >
            {/* BRAND */}
            <Box
                sx={{
                    px: 3,
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, #2563eb, #4f46e5)",
                        boxShadow:
                            "0 8px 20px rgba(37, 99, 235, 0.35)",
                    }}
                >
                    <BusinessRounded />
                </Box>

                <Box>
                 <Typography
                    fontWeight={800}
                    fontSize="1.15rem"
                    sx={{
                        lineHeight: 1.1,
                    }}
                >
                    CareerBridge
                </Typography>  

                    <Typography
                        variant="caption"
                        sx={{
                            color: "rgba(255,255,255,0.55)",
                            letterSpacing: 1,
                        }}
                    >
                        ADMIN PORTAL
                    </Typography>
                </Box>
            </Box>

            <Divider
                sx={{
                    borderColor: "rgba(255,255,255,0.08)",
                }}
            />

            {/* NAVIGATION */}
            <Box sx={{ px: 2, py: 3 }}>
                <Typography
                    variant="caption"
                    sx={{
                        px: 2,
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 700,
                        letterSpacing: 1.2,
                    }}
                >
                    MANAGEMENT
                </Typography>

                <List sx={{ mt: 1 }}>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            onClick={() => {
                                if (isMobile) {
                                    setMobileOpen(false);
                                }
                            }}
                            end={item.path === "/admin"}
                            sx={{
                                minHeight: 50,
                                mb: 0.7,
                                px: 2,
                                borderRadius: 2.5,
                                color: "rgba(255,255,255,0.68)",

                                "& .MuiListItemIcon-root": {
                                    color: "inherit",
                                    minWidth: 42,
                                },

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.07)",
                                    color: "#fff",
                                },

                                "&.active": {
                                    background:
                                        "linear-gradient(90deg, #2563eb, #4f46e5)",
                                    color: "#fff",
                                    boxShadow:
                                        "0 8px 20px rgba(37, 99, 235, 0.25)",
                                },
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>

                        <ListItemText
    primary={
        <Typography
            sx={{
                fontWeight: 600,
                fontSize: "0.92rem",
            }}
        >
            {item.label}
        </Typography>
    }
/>    
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* BOTTOM ADMIN PROFILE */}
            <Box sx={{ mt: "auto", p: 2 }}>
                <Divider
                    sx={{
                        mb: 2,
                        borderColor: "rgba(255,255,255,0.08)",
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 1,
                        py: 1.5,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            fontWeight: 700,
                            background:
                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                        }}
                    >
                        {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            fontWeight={700}
                            fontSize="0.9rem"
                            noWrap
                        >
                            {user?.firstName || "Admin"}{" "}
                            {user?.lastName || ""}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            Administrator
                        </Typography>
                    </Box>

                    <Tooltip title="Logout">
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                color: "rgba(255,255,255,0.55)",
                                "&:hover": {
                                    color: "#fff",
                                    backgroundColor:
                                        "rgba(255,255,255,0.08)",
                                },
                            }}
                        >
                            <LogoutRounded fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
            }}
        >
            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            border: "none",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* MOBILE SIDEBAR */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            border: "none",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* MAIN AREA */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                }}
            >
                {/* TOP BAR */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(12px)",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#111827",
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: "72px !important",
                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
                        }}
                    >
                        {isMobile && (
                            <IconButton
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{
                                    mr: 2,
                                    color: "#334155",
                                }}
                            >
                                <MenuRounded />
                            </IconButton>
                        )}

                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                    color: "#0f172a",
                                }}
                            >
                                Admin Portal
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#64748b",
                                }}
                            >
                                Manage and monitor CareerBridge
                            </Typography>
                        </Box>

                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                fontWeight: 700,
                                background:
                                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                            }}
                        >
                            {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
                        </Avatar>
                    </Toolbar>
                </AppBar>

                {/* PAGE CONTENT */}
                <Box
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AdminLayout;

