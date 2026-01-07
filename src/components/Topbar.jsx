import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotifyCenter from "./Notifycenter";

function Topbar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      sx={{
      
        zIndex: 1201,
        backgroundColor: "#B45309",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, color: "white" }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold">
            Multi-School LMS
          </Typography>
        </Box>

        {/* Right */}
        <NotifyCenter />

      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
