import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { createAssignment } from "../../redux/slice/assignmentSlice";
import { fetchSchoolsWithCourses  } from "../../redux/slice/schoolSlice";
import  Spinner  from "../../components/Spinner";

export default function CreateAssignment() {
  const dispatch = useDispatch();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState({
    task: "",
    description: "",
    finalAt: "",
  });

  // ✅ Get approved schools from redux
  const { approved: schools, loading } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchSchoolsWithCourses());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchool || !selectedCourse) {
      return Swal.fire("Error", "Select school and course", "error");
    }

    try {
      await dispatch(
        createAssignment({
          ...formData,
          schoolId: selectedSchool,
          courseId: selectedCourse,
        })
      ).unwrap();

      Swal.fire("Success", "Assignment created", "success");
      setFormData({ task: "", description: "", finalAt: "" });
      setSelectedSchool("");
      setSelectedCourse("");
    } catch (err) {
      Swal.fire("Error", err || "Failed to create assignment", "error");
    }
  };

  if (loading) return <Spinner/>;
  if (!schools || schools.length === 0)
    return (
      <p className="text-red-500 text-center mt-10">
        ⛔ You cannot create assignments until approved by school.
      </p>
    );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl  text-amber-600font-bold mb-4">Create Assignment</h2>

      {/* SCHOOL SELECT */}
      <select
        value={selectedSchool}
        onChange={(e) => {
          setSelectedSchool(e.target.value);
          setSelectedCourse("");
        }}
        className="border px-3 py-2 rounded w-full mb-3"
      >
        <option value="">Select School</option>
        {schools.map((s) => (
          <option key={s.schoolId} value={s.schoolId}>
            {s.schoolName}
          </option>
        ))}
      </select>

      {/* COURSE SELECT */}
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        disabled={!selectedSchool}
        className="border px-3 py-2 rounded w-full mb-3"
      >
        <option value="">Select Course</option>
        {selectedSchool &&
          schools
            .find((s) => s.schoolId === selectedSchool)
            ?.courseIds?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
      </select>

      {/* ASSIGNMENT FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="task"
          placeholder="Task Title"
          value={formData.task}
          onChange={(e) => setFormData({ ...formData, task: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={formData.finalAt}
          onChange={(e) =>
            setFormData({ ...formData, finalAt: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />
        <button
          className="bg-blue-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
}
