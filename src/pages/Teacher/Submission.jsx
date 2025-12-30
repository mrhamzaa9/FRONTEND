import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";

import {
  fetchTeacherSubmissions,
  gradeSubmission,
  clearMessage,
} from "../../redux/slice/SubmissionSlice";

export default function Submission() {
  const dispatch = useDispatch();

  const { submissions, loading, error, message } = useSelector(
    (state) => state.Submissions
  );

  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    dispatch(fetchTeacherSubmissions());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      Swal.fire("Success", message, "success");
      dispatch(clearMessage());
    }
    if (error) {
      Swal.fire("Error", error, "error");
      dispatch(clearMessage());
    }
  }, [message, error, dispatch]);

  const handleGrade = (id) => {
    if (!grades[id]) {
      return Swal.fire("Error", "Enter grade first", "error");
    }

    dispatch(
      gradeSubmission({
        submissionId: id,
        grade: grades[id],
        feedback: feedback[id],
      })
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-amber-600 font-bold mb-5">Student Submissions</h2>

      {submissions.length === 0 && <p>No submissions found.</p>}

      <div className="grid gap-4">
        {submissions.map((s) => (
          <div
            key={s._id}
            className="border p-4 rounded shadow flex flex-col gap-2"
          >
            <p><b>Student:</b> {s.studentId.name}</p>
            <p><b>Email:</b> {s.studentId.email}</p>
            <p><b>Course:</b> {s.assignmentId.courseId.name}</p>
            <p><b>Assignment:</b> {s.assignmentId.task}</p>

            <a
              href={s.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 underline"
            >
              View Submitted File
            </a>

            {s.grade !== null ? (
              <span className="text-green-600 font-semibold">
                Graded: {s.grade}
              </span>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter grade"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setGrades({ ...grades, [s._id]: e.target.value })
                  }
                />

                <textarea
                  placeholder="Feedback (optional)"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setFeedback({ ...feedback, [s._id]: e.target.value })
                  }
                />

                <button
                  onClick={() => handleGrade(s._id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Submit Grade
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
