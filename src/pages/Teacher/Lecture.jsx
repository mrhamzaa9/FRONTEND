import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { fetchSchoolsWithCourses } from "../../redux/slice/schoolSlice";
import { createLecture } from "../../redux/slice/assignmentSlice";

export default function CreateLecture() {
  const dispatch = useDispatch();

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null); // store actual File object

  const { approved: schools, loading } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchSchoolsWithCourses());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSchool || !selectedCourse || !title || !video) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    // ✅ Use FormData to send file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("schoolId", selectedSchool);
    formData.append("courseId", selectedCourse);
    formData.append("video", video); // 🔥 key must match Multer field name

    try {
      await dispatch(createLecture(formData)).unwrap();

      Swal.fire("Success", "Lecture uploaded successfully", "success");

      // reset form
      setTitle("");
      setVideo(null);
      setSelectedSchool("");
      setSelectedCourse("");
    } catch (err) {
      Swal.fire("Error", err || "Failed to upload lecture", "error");
    }
  };

  if (loading) return <Spinner />;

  if (!schools || schools.length === 0) {
    return (
      <p className="text-red-500 text-center mt-10">
        ⛔ You cannot upload lectures until approved by school.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-amber-600 mb-4">
        Upload Lecture
      </h2>

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

      {/* LECTURE FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])} // store File
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-amber-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Lecture"}
        </button>
      </form>
    </div>
  );
}
