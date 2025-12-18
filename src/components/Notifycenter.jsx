import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead
} from "../redux/slice/notification.Slice";

import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotifyCenter() {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const notifications = useSelector(state => state.notifications.list);
  const unreadCount = useSelector(state => state.notifications.unreadCount);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?._id]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* 🔔 Bell with Badge */}
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* 📦 Popup Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400
          }
        }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          Notifications
        </Typography>

        <Divider />

        {notifications.length === 0 && (
          <MenuItem>
            <Typography color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        )}

        {notifications.map((n) => (
          <MenuItem
            key={n._id}
            sx={{ alignItems: "flex-start", opacity: n.read ? 0.6 : 1 }}
          >
            <Box>
              <Typography variant="subtitle2">
                {n.status.toUpperCase()}
              </Typography>

              <Typography variant="body2">
                {n.message}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {new Date(n.createdAt).toLocaleString()}
              </Typography>

              {!n.read && (
                <Typography
                  variant="caption"
                  sx={{ color: "primary.main", cursor: "pointer", display: "block", mt: 0.5 }}
                  onClick={() => dispatch(markAsRead(n._id))}
                >
                  Mark as read
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
