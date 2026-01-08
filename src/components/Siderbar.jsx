import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slice/authSlice";
import NotifyCenter from "./Notifycenter";

const drawerWidth = 260;

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const role = user?.role?.toLowerCase();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleLogout = () => dispatch(logoutUser());

  const menu = {
    superadmin: [
      { name: "Dashboard", path: "/superadmin" },
      { name: "All Schools", path: "/superadmin/schools" },
    ],
    schooladmin: [
      { name: "Dashboard", path: "/schooladmin" },
      { name: "Teachers", path: "/schooladmin/teachers" },
    ],
    teacher: [
      { name: "My Courses", path: "/teacher" },
      { name: "Assignments", path: "/teacher/assignments" },
    ],
    student: [
      { name: "My School", path: "/school" },
      { name: "Assignments", path: "/schoolassign" },
    ],
  };

  const links = menu[role] || [];

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        p: 2,
        pt: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FEF3C7",
        overflowX: "hidden",
      }}
    >
      {/* Only show NotifyCenter in sidebar on large screens */}
      {isLargeScreen && (
        <Box sx={{ mb: 2 }}>
          <NotifyCenter />
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* User Role */}
      <Typography sx={{ mb: 2, fontWeight: "bold", color: "#78350F" }}>
        {role?.toUpperCase() || "USER"} Panel
      </Typography>

      {/* Links */}
      <List sx={{ flexGrow: 1 }}>
        {links.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: active ? "#FDE68A" : "transparent",
                  color: "#78350F",
                  "&:hover": { backgroundColor: "#FDE68A" },
                }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        fullWidth
        sx={{
          mt: "auto",
          backgroundColor: "#D97706",
          color: "white",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#B45309" },
        }}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Topbar */}
      {!isLargeScreen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            backgroundColor: "#B45309",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            zIndex: 1300,
          }}
        >
          {/* Hamburger */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold" color="white">
            Multi-School LMS
          </Typography>

          {/* Floating NotifyCenter on mobile */}
          <NotifyCenter />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, zIndex: 1400 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer */}
      {isLargeScreen && (
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
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { lg: `${drawerWidth}px` },
          mt: { xs: 8, lg: 0 }, // reserve space for mobile topbar
          backgroundColor: "#FFFBEB",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
