import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { fetchSchoolsWithCourses } from "../../redux/slice/schoolSlice";
import { fetchQuiz, fetchTeacherQuizzes } from "../../redux/slice/quizSlice";

export default function Quiztech() {
  const dispatch = useDispatch();

  const { approved: schools, loading } = useSelector((state) => state.school);
  const { teacherQuizzes } = useSelector((state) => state.quiz);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "medium",
  });

  useEffect(() => {
    dispatch(fetchSchoolsWithCourses());
    dispatch(fetchTeacherQuizzes());
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!selectedSchool || !selectedCourse) {
      return Swal.fire("Error", "Select school and course", "error");
    }

    if (!formData.topic.trim()) {
      return Swal.fire("Error", "Topic is required", "error");
    }

    try {
      const res = await dispatch(
        fetchQuiz({
          topic: formData.topic,
          difficulty: formData.difficulty,
          courseId: selectedCourse, // ✅ SAME AS ASSIGNMENT
        })
      ).unwrap();

      Swal.fire("Success", "Quiz generated successfully", "success");
      dispatch(fetchTeacherQuizzes());

      setFormData({ topic: "", difficulty: "medium" });
      setSelectedSchool("");
      setSelectedCourse("");
    } catch (err) {
      Swal.fire("Error", err || "Failed to generate quiz", "error");
    }
  };

  if (loading) return <Spinner />;

  if (!schools || schools.length === 0) {
    return (
      <p className="text-red-500 text-center mt-10">
        ⛔ You cannot create quiz until approved by school.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl text-amber-600 font-bold mb-4">
        Generate Quiz
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

      {/* QUIZ FORM */}
      <input
        placeholder="Quiz Topic"
        value={formData.topic}
        onChange={(e) =>
          setFormData({ ...formData, topic: e.target.value })
        }
        className="border px-3 py-2 rounded w-full mb-3"
      />

      <select
        value={formData.difficulty}
        onChange={(e) =>
          setFormData({ ...formData, difficulty: e.target.value })
        }
        className="border px-3 py-2 rounded w-full mb-4"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button
        onClick={handleGenerate}
        className="bg-amber-500 text-white py-2 rounded w-full hover:bg-amber-600"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {/* TEACHER QUIZ LIST */}
      {teacherQuizzes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-amber-600 mb-2">
            Your Quizzes
          </h3>

          {teacherQuizzes.map((q) => (
            <div
              key={q._id}
              className="border rounded p-3 mb-2 bg-amber-50"
            >
              <p><strong>{q.topic}</strong> ({q.difficulty})</p>
              <p>Total Questions: {q.totalQuestions}</p>
              <p>Status: {q.isActive ? "Active" : "Inactive"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
