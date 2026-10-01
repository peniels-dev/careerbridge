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

    const { user, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        if (logout) {
            logout();
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

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

    const firstName =
        user?.FirstName ||
        user?.firstName ||
        "Admin";

    const lastName =
        user?.LastName ||
        user?.lastName ||
        "";

    const avatarLetter = firstName.charAt(0).toUpperCase();

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#293241",
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
                        backgroundColor: "#E76F51",
                        color: "#fff",
                        flexShrink: 0,
                        boxShadow:
                            "0 8px 18px rgba(231, 111, 81, 0.25)",
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
                            color: "#fff",
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
                    borderColor: "rgba(255,255,255,0.09)",
                }}
            />

            {/* NAVIGATION */}
            <Box
                sx={{
                    px: 2,
                    py: 3,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        px: 2,
                        color: "rgba(255,255,255,0.42)",
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
                            end={item.path === "/admin"}
                            onClick={() => {
                                if (isMobile) {
                                    setMobileOpen(false);
                                }
                            }}
                            sx={{
                                minHeight: 50,
                                mb: 0.7,
                                px: 2,
                                borderRadius: 2.5,
                                color: "rgba(255,255,255,0.68)",
                                transition: "all 0.2s ease",

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
                                    backgroundColor: "#E76F51",
                                    color: "#fff",
                                    boxShadow:
                                        "0 8px 20px rgba(231, 111, 81, 0.22)",
                                },

                                "&.active:hover": {
                                    backgroundColor: "#D85F43",
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
            <Box
                sx={{
                    mt: "auto",
                    p: 2,
                }}
            >
                <Divider
                    sx={{
                        mb: 2,
                        borderColor: "rgba(255,255,255,0.09)",
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
                            backgroundColor: "#F4A261",
                            color: "#293241",
                        }}
                    >
                        {avatarLetter}
                    </Avatar>

                    <Box
                        sx={{
                            minWidth: 0,
                            flex: 1,
                        }}
                    >
                        <Typography
                            fontWeight={700}
                            fontSize="0.9rem"
                            noWrap
                            sx={{
                                color: "#fff",
                            }}
                        >
                            {firstName} {lastName}
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
                                        "rgba(231,111,81,0.16)",
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
                backgroundColor: "#FFF8EF",
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
                            backgroundColor: "#293241",
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
                            backgroundColor: "#293241",
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
                    backgroundColor: "#FFF8EF",
                }}
            >
                {/* TOP BAR */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: "#FFFDF9",
                        borderBottom: "1px solid #E9DED0",
                        color: "#293241",
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
                                    color: "#293241",
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
                                    color: "#293241",
                                }}
                            >
                                Admin Portal
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#7A7068",
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
                                backgroundColor: "#F4A261",
                                color: "#293241",
                            }}
                        >
                            {avatarLetter}
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

