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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";

const drawerWidth = 260;

export default function Sidebar({ children }) {
    const dispatch = useDispatch();
    const isLargeScreen = useMediaQuery("(min-width:1200px)");
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleLogout = () => dispatch(logout());

    // Get user from Redux store
    const user = useSelector((state) => state.auth.user);
    const role = user?.role?.toLowerCase(); // Make sure role is lowercase

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
            { name: "Create SCHOOL", path: "/create-school" },
            { name: "Courses", path: "/schooladmin/courses" },
        ],
        teacher: [
            { name: "My Courses", path: "/teacher" },
            { name: "Assignments", path: "/teacher/assignments" },
        ],
        student: [
            { name: "My School", path: "/student/school" },
            { name: "Assignments", path: "/schoolassign" },
        ],
    };

    const links = menu[role] || [];

    const drawer = (
    <Box
        sx={{
            width: drawerWidth,
            p: 2,
            overflowX: "hidden",
            backgroundColor: "#f5f5f5",
            height: "100%",
            display: "flex",
            flexDirection: "column", // Make it column
        }}
    >
        <Typography variant="h5" sx={{ mb: 2 }}>
            {role?.toUpperCase() || "USER"} Panel
        </Typography>
        <List sx={{ flexGrow: 1 }}> {/* Pushes logout down */}
            {links.map((item) => (
                <ListItem key={item.path} disablePadding>
                    <ListItemButton
                        component={Link}
                        to={item.path}
                        sx={{
                            color: "blue",
                            "&:hover": { backgroundColor: "#e0f2ff" },
                        }}
                    >
                        <ListItemText primary={item.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: "auto" }} // This pushes it to the bottom
        >
            Logout
        </Button>
    </Box>
);

    

    return (
        <Box sx={{ display: "flex" }}>
            {!isLargeScreen && (
                <AppBar position="fixed" sx={{ zIndex: 1201, ml: { lg: `${drawerWidth}px` } }}>
                    <Toolbar>
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
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
            >
                {drawer}
            </Drawer>
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
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { lg: `${drawerWidth}px` } }}>
                {!isLargeScreen && <Toolbar />}
                {children}
            </Box>
        </Box>
    );
}
