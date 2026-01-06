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
import NotifyCenter from "./Notifycenter";

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
      pt: "80px",          // 🔥 AppBar se neeche push
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#FEF3C7",
     
         overflowX: "hidden",   // 🔥 text cut issue solved
    }}
  >
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        fontWeight: "bold",
        color: "#78350F",
        whiteSpace: "nowrap", 
        // extra safety
      }}
    >
      {role?.toUpperCase() || "USER"} 
      <span > Panal</span>
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
      {!isLargeScreen && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1201,
            backgroundColor: "#B45309",
        
          }}
        >
   <Toolbar
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,              // horizontal padding
    minHeight: 64,    
    overflow: "hidden",  // consistent AppBar height
  }}
>
  {/* LEFT SIDE */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}
  >
    <IconButton
      edge="start"
      onClick={handleDrawerToggle}
      sx={{
        color: "white",
        display: { xs: "block", lg: "none" }
      }}
    >
      <MenuIcon />
    </IconButton>

    <Typography variant="h6" fontWeight="bold">
      Multi-School LMS
    </Typography>
  </Box>

  {/* RIGHT SIDE */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1        // 🔥 spacing for NotifyCenter / future avatar
    }}
  >
    <NotifyCenter />
  </Box>
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
               overflowX: "hidden",  
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
