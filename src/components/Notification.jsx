import { useEffect, useRef } from "react";
import { socket } from "../service/socket";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

export default function Notification() {
  const { user } = useSelector((state) => state.auth);
  const initialized = useRef(false);

  useEffect(() => {
    if (!user?._id || initialized.current) return;

    initialized.current = true;
    console.log("Frontend user._id:", user._id);
    // connect socket
    socket.connect();

    // join user room once connected
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED", socket.id);
      socket.emit("join", user._id);
    });

    socket.onAny((event, ...args) => {
      console.log("EVENT RECEIVED:", event, args);
    });


    // listener for notifications
    const notificationHandler = (data) => {
      console.log("🔥 NOTIFICATION RECEIVED:", data);
      Swal.fire({
        icon: data.status === "approved" ? "success" : "error",
        title: data.status.toUpperCase(),
        html: `
          <b>School:</b> ${data.schoolName}<br/>
          <b>Message:</b> ${data.message}
        `,
      });
    };

     const handleTeacherRequestStatus = (data) => {
      console.log(" NOTIFICATION RECEIVED:", data);

      Swal.fire({
        icon: data.status === "approved" ? "success" : "error",
        title: data.status.toUpperCase(),
        html: `
          <b>School:</b> ${data.schoolName}<br/>
          <b>Message:</b> ${data.message}
        `,
        timer: 5000,
        timerProgressBar: true,
      });
    };

    socket.on("teacher-request-status", handleTeacherRequestStatus);

    // cleanup on unmount
    return () => {
      socket.off("teacher-request-status", notificationHandler);
      
    };
  }, [user?._id]); // ✅ dependency array ensures effect runs once per user

  return null;
}
