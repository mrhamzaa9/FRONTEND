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

  return (
    <div style={{ width: 300, height: 300, margin: "auto" }}>
      <h4 style={{ textAlign: "center" }}>My Assignments</h4>
      <Doughnut data={data} options={options} />
      {total === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280" }}>No assignments yet</p>
      )}
    </div>
  );
};

export default Studentchart;
