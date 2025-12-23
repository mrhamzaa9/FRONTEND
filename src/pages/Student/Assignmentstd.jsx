import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { fetchAssignmentsByCourse, submitAssignment, clearMessage as clearStudentMessage } from "../../redux/slice/student";
import { fetchResultAssignments, clearMessage as clearSubmissionMessage } from "../../redux/slice/SubmissionSlice";

export default function Assignmentstd() {
  const dispatch = useDispatch();
  
  // Get state from slices
  const { assignments, loading: studentLoading, message: studentMessage, error: studentError } = useSelector((state) => state.student);
  const { submissions, loading: submissionLoading, message: submissionMessage, error: submissionError } = useSelector((state) => state.Submissions);

  const [files, setFiles] = useState({});
  

  // Fetch assignments and results on mount
  useEffect(() => {
    dispatch(fetchAssignmentsByCourse());
    dispatch(fetchResultAssignments());
  }, [dispatch]);

  // Show messages for student slice
  useEffect(() => {
    if (studentMessage) {
      Swal.fire("Success", studentMessage, "success");
      dispatch(clearStudentMessage());
    }
    if (studentError) {
      Swal.fire("Error", studentError, "error");
      dispatch(clearStudentMessage());
    }
  }, [studentMessage, studentError, dispatch]);

  // Show messages for submissions slice
  useEffect(() => {
    if (submissionMessage) {
      Swal.fire("Success", submissionMessage, "success");
      dispatch(clearSubmissionMessage());
    }
    if (submissionError) {
      Swal.fire("Error", submissionError, "error");
      dispatch(clearSubmissionMessage());
    }
  }, [submissionMessage, submissionError, dispatch]);

  // Handle file input change
  const handleFileChange = (assignmentId, file) => {
    setFiles(prev => ({ ...prev, [assignmentId]: file }));
  };

  // Submit assignment
  const handleSubmit = (assignmentId) => {
    const file = files[assignmentId];
    if (!file) {
      return Swal.fire("Error", "Select a file first", "error");
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file); // must match backend field

    dispatch(submitAssignment(formData));
  };
  console.log(assignments);

  if (studentLoading || submissionLoading) return <Spinner />;

  return (
    <div className="p-6">
      {/* Assignments Section */}
      <h2 className="text-2xl font-bold mb-5">Assignments</h2>
      {assignments.length === 0 && <p>No assignments yet.</p>}
      <div className="grid gap-4 mb-10">
        {assignments.map(a => {
          const submitted = submissions.find(sub => sub.assignmentId._id === a._id);
          return (
            <div key={a._id} className="border p-4 rounded shadow flex flex-col gap-2">
              <span className="font-medium">{a.task}</span>
              <p className="text-gray-600">{a.description}</p>
              {submitted ? (
                <span className="text-green-600 font-semibold">Submitted</span>
              ) : (
                <>
                  <input type="file" onChange={(e) => handleFileChange(a._id, e.target.files[0])} />
                  <button
                    onClick={() => handleSubmit(a._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Results Section */}
      <h2 className="text-2xl font-bold mb-5">Assignment Results</h2>
      <div className="grid gap-4">
        {Array.isArray(submissions) && submissions
          .filter(sub => sub.grade) // only graded
          .map(sub => (
            <div key={sub._id} className="border p-4 rounded shadow flex flex-col gap-2 bg-gray-50">
              <span className="font-medium">{sub.assignmentId.task}</span>
              <p className="text-gray-600">{sub.assignmentId.description}</p>
              <p className="text-blue-600 font-semibold">Grade: {sub.grade}</p>
              {sub.feedback && <p className="text-gray-700">Feedback: {sub.feedback}</p>}
              <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                View Submitted File
              </a>
            </div>
          ))
        }
      </div>
    </div>
  );
}
