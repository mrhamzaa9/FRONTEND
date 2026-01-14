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

    console.log("🔌 Connecting socket for user:", user._id);
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id);
      socket.emit("join", user._id);
    });

    // 👨‍🏫 TEACHER → request approved/rejected
    const handleTeacherRequestStatus = (data) => {
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

    // 👨‍💼 ADMIN → new teacher request
    const handleNewTeacherRequest = (data) => {
      Swal.fire({
        icon: "info",
        title: "New Teacher Request",
        html: `
          <b>School:</b> ${data.schoolName}<br/>
          <b>Message:</b> ${data.message}
        `,
      });
    };

    // 📘 STUDENT → new assignment
    const handleNewAssignment = (data) => {
      Swal.fire({
        icon: "info",
        title: "New Assignment",
        html: `
          <b>Course:</b> ${data.courseName}<br/>
          ${data.message}
        `,
      });
    };

    // 📝 TEACHER → assignment submitted
    const handleAssignmentSubmitted = (data) => {
      Swal.fire({
        icon: "info",
        title: "Assignment Submitted",
        html: data.message,
      });
    };
   const handleTeacherRemoved = (data) => {
  Swal.fire({
    icon: "info",
    title: "Removed from School",
    text: data.message,
  });
};

    // ✅ REGISTER ALL LISTENERS ONCE
    socket.on("teacher-request-status", handleTeacherRequestStatus);
    socket.on("teacher-request", handleNewTeacherRequest);
    socket.on("new-assignment", handleNewAssignment);
    socket.on("assignment-submitted", handleAssignmentSubmitted);
    socket.on("teacher-removed", handleTeacherRemoved);

    // 🧹 CLEANUP
    return () => {
      socket.off("teacher-request-status", handleTeacherRequestStatus);
      socket.off("teacher-request", handleNewTeacherRequest);
      socket.off("new-assignment", handleNewAssignment);
      socket.off("teacher-removed", handleTeacherRemoved);
      socket.off("assignment-submitted", handleAssignmentSubmitted);
    };
  }, [user?._id]);

  return null;
}
