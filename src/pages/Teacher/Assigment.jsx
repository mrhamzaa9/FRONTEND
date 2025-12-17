import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {api} from "../../service/api"

export default function Assigment() {
  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.list);

  // check if teacher is approved by any school
  const approvedNotification = notifications.find(
    (n) => n.status === "approved"
  );

  const canCreateAssignment = !!approvedNotification;

  const [formData, setFormData] = useState({
    task: "",
    description: "",
    finalAt: "",
    courseId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreateAssignment) {
      Swal.fire(
        "Not Allowed",
        "You cannot create assignments until approved by school.",
        "error"
      );
      return;
    }

    // Validate form
    if (!formData.task || !formData.description || !formData.finalAt || !formData.courseId) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      // Example API call to create assignment
      const res = await api("/api/assignments/create", "POST", formData);
      Swal.fire("Success", "Assignment created successfully", "success");
      setFormData({ task: "", description: "", finalAt: "", courseId: "" });
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to create assignment", "error");
    }
  };

  if (!canCreateAssignment) {
    return <p>⛔ You cannot create assignments until approved by school.</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Assignment</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="task"
          placeholder="Task Title"
          value={formData.task}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="finalAt"
          value={formData.finalAt}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="courseId"
          placeholder="Course ID"
          value={formData.courseId}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
}
