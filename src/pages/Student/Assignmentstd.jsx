import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { fetchAssignmentsByCourse, submitAssignment, clearMessage } from "../../redux/slice/student";

export default function Assignmentstd() {
  const dispatch = useDispatch();
  const { assignments, submissions, loading, message, error } = useSelector((state) => state.student);
  const [files, setFiles] = useState({});

  useEffect(() => {
    dispatch(fetchAssignmentsByCourse()); // no courseId needed
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

  const handleFileChange = (assignmentId, file) => {
    setFiles(prev => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = (assignmentId) => {
    const file = files[assignmentId];
    if (!file) return Swal.fire("Error", "Select a file first", "error");
    const fileUrl = URL.createObjectURL(file);
    dispatch(submitAssignment({ assignmentId, fileUrl }));
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">Assignments</h2>
      {assignments.length === 0 && <p>No assignments yet.</p>}
      <div className="grid gap-4">
        {assignments.map(a => {
          const submitted = submissions[a._id];
          return (
            <div key={a._id} className="border p-4 rounded shadow flex flex-col gap-2">
              <span className="font-medium">{a.task}</span>
              <p className="text-gray-600">{a.description}</p>
              {submitted ? (
                <span className="text-green-600 font-semibold">Submitted</span>
              ) : (
                <>
                  <input type="file" onChange={(e) => handleFileChange(a._id, e.target.files[0])} />
                  <button onClick={() => handleSubmit(a._id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
