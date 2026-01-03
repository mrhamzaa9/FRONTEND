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
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slice/authSlice";

const drawerWidth = 260;

export default function Sidebar({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => dispatch(logoutUser());

  const user = useSelector((state) => state.auth.user);
  const role = user?.role?.toLowerCase();

  const menu = {
    superadmin: [
      { name: "Dashboard", path: "/superadmin" },
      { name: "All Schools", path: "/superadmin/schools" },
      { name: "Delete School", path: "/superadmin/delete-school" },
      { name: "View Users", path: "/superadmin/users" },
      { name: "Delete User", path: "/superadmin/delete-user" },
    ],
    schooladmin: [
      { name: "Dashboard", path: "/schooladmin" },
      { name: "Teachers", path: "/schooladmin/teachers" }, { name: "Courses", path: "/schooladmin/courses" },
    ],
    teacher: [
      { name: "My Courses", path: "/teacher" },
      { name: "Assignments", path: "/teacher/assignments" },
      { name: "Submissions", path: "/teacher/submission" },
      { name: "Quiz", path: "/teacher/quiz" },
    ],
    student: [
      { name: "My School", path: "/school" },
      { name: "Assignments", path: "/schoolassign" },
      { name: "Quiz", path: "/quiz" },
    ],
  };

  const links = menu[role] || [];

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FEF3C7",
        overflowY: "hidden", // amber-100
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "#78350F" }}
      >
        {role?.toUpperCase() || "USER"} PANEL
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {links.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: active ? "#FDE68A" : "transparent",
                  color: "#78350F",
                  "&:hover": {
                    backgroundColor: "#FDE68A",
                  },
                }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Button
        onClick={handleLogout}
        fullWidth
        sx={{
          mt: "auto",
          backgroundColor: "#D97706",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#B45309",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {!isLargeScreen && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1201,
            backgroundColor: "#B45309", // amber-700
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "white", cursor: "pointer" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              Multi-School LMS
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
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
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { lg: `${drawerWidth}px` },
          backgroundColor: "#FFFBEB", // amber-50
          minHeight: "100vh",
        }}
      >
        {!isLargeScreen && <Toolbar />}
        {children}
      </Box>
    </Box>
  );
}
