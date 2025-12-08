import React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const drawerWidth = 260;

export default function Sidebar({ role, children }) {
    const { logout } = useAuth();
    const isLargeScreen = useMediaQuery("(min-width:1200px)");
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // -------------------------------
    // 🔥 ROLE-BASED MENU SYSTEM
    // -------------------------------
    const menu = {
        superadmin: [
            { name: "Dashboard", path: "/superadmin" },
            { name: "All Schools", path: "/superadmin/schools" },
            { name: "DELETE School", path: "/superadmin/delete-school" },
            { name: "View Users", path: "/superadmin/users" },
            { name: "DELETE User", path: "/superadmin/delete-user" },
        ],

        schooladmin: [
            { name: "Dashboard", path: "/schooladmin" },
            { name: "Teachers", path: "/schooladmin/teachers" },
            { name: "CreateSCHOOL", path: "/create-school" },
            { name: "Courses", path: "/schooladmin/courses" },

        ],

        teacher: [
            { name: "My Courses", path: "/teacher/courses" },
            { name: "Assignments", path: "/teacher/assignments" },

        ],

        student: [
            { name: "My School", path: "/student/school" },
            { name: "Enroll Courses", path: "/student/enroll" },
            { name: "Assignments", path: "/student/assignments" },
        ],
    };

    const links = menu[role] || [];

    // -------------------------------
    // 🔥 Drawer content (role-based)
    // -------------------------------
    const drawer = (
        <Box sx={{ width: drawerWidth, p: 2, overflowX: 'hidden', backgroundColor: '#f5f5f5', height: '100%'     }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {role?.toUpperCase()} Panel
            </Typography>

            <List>
                {links.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton component={Link} to={item.path} sx={{
                            color: "blue", // link text color
                            "&:hover": { backgroundColor: "#e0f2ff" }, // optional hover
                        }}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Button
                onClick={logout}
                variant="contained"
                color="error"
                fullWidth
            >
                Logout
            </Button>
        </Box>
    );

    // -------------------------------
    // 🔥 Return Layout
    // -------------------------------
    return (
        <Box sx={{ display: "flex" }}>
            {/* Top App Bar (only mobile) */}
            {!isLargeScreen && (
                <AppBar position="fixed" sx={{ zIndex: 1201, ml: { lg: `${drawerWidth}px` } }}>
                    <Toolbar>
                        {/* Mobile menu icon visible only on small screens */}
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { lg: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6">Multi-School LMS</Typography>
                    </Toolbar>
                </AppBar>

            )}

            {/* MOBILE Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", lg: "none" },
                    "& .MuiDrawer-paper": { width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>

            {/* DESKTOP Drawer */}
            <Drawer
                variant="permanent"
                open
                sx={{
                    display: { xs: "none", lg: "block" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        overflowY: "auto",
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* MAIN CONTENT */}
            <Box
                component="main"

                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: { lg: `${drawerWidth}px` },
                }}
            >
                {!isLargeScreen && <Toolbar />} {/* space top on mobile */}
                {children}

            </Box>
        </Box>
    );
}
