import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { fetchAssignmentsByCourse, submitAssignment, clearMessage as clearStudentMessage } from "../../redux/slice/student";
import { fetchResultAssignments, clearMessage as clearSubmissionMessage } from "../../redux/slice/SubmissionSlice";

import Studentchart from "../../components/Studentchart";

export default function Assignmentstd() {
  const dispatch = useDispatch();
  const { assignments, loading: studentLoading, message: studentMessage, error: studentError } = useSelector((state) => state.student);
  const { submissions, loading: submissionLoading, message: submissionMessage, error: submissionError } = useSelector((state) => state.Submissions);
  const [files, setFiles] = useState({});

  useEffect(() => {
    dispatch(fetchAssignmentsByCourse());
    dispatch(fetchResultAssignments());
  }, [dispatch]);

  useEffect(() => {
    if (studentMessage) { Swal.fire("Success", studentMessage, "success"); dispatch(clearStudentMessage()); }
    if (studentError) { Swal.fire("Error", studentError, "error"); dispatch(clearStudentMessage()); }
  }, [studentMessage, studentError, dispatch]);

  useEffect(() => {
    if (submissionMessage) { Swal.fire("Success", submissionMessage, "success"); dispatch(clearSubmissionMessage()); }
    if (submissionError) { Swal.fire("Error", submissionError, "error"); dispatch(clearSubmissionMessage()); }
  }, [submissionMessage, submissionError, dispatch]);

  const handleFileChange = (assignmentId, file) => setFiles(prev => ({ ...prev, [assignmentId]: file }));
  const handleSubmit = (assignmentId) => {
    const file = files[assignmentId];
    if (!file) return Swal.fire("Error", "Select a file first", "error");
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);
    dispatch(submitAssignment(formData));
  };

  if (studentLoading || submissionLoading) return <Spinner />;

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-amber-700">Assignments</h2>
      {assignments.length === 0 ? <p>No assignments yet.</p> : (
        <div className="grid gap-4 mb-10">
          {assignments.map(a => {
            const submitted = submissions.find(sub => sub.assignmentId._id === a._id);
            return (
              <div key={a._id} className="border rounded-2xl p-5 shadow-md flex flex-col gap-3 bg-white hover:shadow-xl transition">
                <span className="font-semibold text-gray-800">{a.task}</span>
                <p className="text-gray-600">{a.description}</p>

                {submitted ? (
                  <span className="text-green-600 font-semibold">Submitted</span>
                ) : (
                  <>
                    <div>
                      <input
                        id={`file-${a._id}`}
                        type="file"
                        onChange={(e) => handleFileChange(a._id, e.target.files[0])}
                        className="hidden"
                      />
                      <label
                        htmlFor={`file-${a._id}`}
                        className="px-2 py-1 bg-amber-200 text-white rounded-xl hover:bg-amber-600 cursor-pointer"
                      >
                        Upload File
                      </label>

                      {a.selectedFile && <span className="ml-2 ">{a.selectedFile.name}</span>}
                    </div>

                    <button
                      onClick={() => handleSubmit(a._id)}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer"
                    >
                      Submit
                    </button>
                  </>
                  
                )}
              </div>
            );
          })}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-amber-700">Assignment Results</h2>
      <div className="grid gap-4">
        {Array.isArray(submissions) && submissions.filter(sub => sub.grade).map(sub => (
          <div key={sub._id} className="border rounded-2xl p-5 shadow-md flex flex-col gap-2 bg-amber-50 hover:shadow-lg transition">
            <span className="font-semibold text-gray-800">{sub.assignmentId.task}</span>
            <p className="text-gray-600">{sub.assignmentId.description}</p>
            <p className="text-blue-600 font-semibold">Grade: {sub.grade}</p>
            {sub.feedback && <p className="text-gray-700">Feedback: {sub.feedback}</p>}
            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-amber-700 underline hover:text-amber-800">View Submitted File</a>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Studentchart/>
      </div>
    </div>
  );
}
