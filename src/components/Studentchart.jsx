import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDashboard } from "../redux/slice/dashboardSlice";
import Spinner from "./Spinner";
import "chart.js/auto";

const Studentchart = () => {
  const dispatch = useDispatch();
  const { student, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (!student) return <p>No data found</p>;

  const submitted = student.submittedCount || 0;
  const pending = student.pendingCount || 0;
  const total = submitted + pending;

  const data = {
    labels: ["Submitted Assignments", "Pending Assignments"],
    datasets: [
      {
        data: total === 0 ? [1] : [submitted, pending],
        backgroundColor: total === 0 ? ["#d1d5db"] : ["#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };


  // ... (logic remains same)
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow">
      <h4 className="text-center mb-4 font-semibold text-lg">My Assignments</h4>
      {/* Aspect ratio container: taller on mobile, standard on desktop */}
      <div className="relative h-[250px] sm:h-[300px] w-[80%] mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      {total === 0 && (
        <p className="text-center text-gray-500 mt-2">No assignments yet</p>
      )}
    </div>
  );
}
;

export default Studentchart;
