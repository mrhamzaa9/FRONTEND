import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherDashboard } from "../redux/slice/dashboardSlice";
import Spinner from "./Spinner";
import "chart.js/auto";

const Teacherchart = () => {
  const dispatch = useDispatch();
  const { teacher, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
 dispatch(fetchTeacherDashboard());
  }, [dispatch, ]);

  if (loading) return <Spinner />;
  if (!teacher || !teacher.courses?.length)
    return <p style={{ textAlign: "center" }}>No course data found</p>;

  // Labels: course names
  const labels = teacher.courses.map((c) => c.name);

  // Data: number of students per course
  const studentCounts = teacher.courses.map((c) => c.students?.length || 0);

  // Data: total assignments/quizzes per course
  const assignmentCounts = teacher.courses.map((c) => c.assignments?.length || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Students",
        data: studentCounts,
        backgroundColor: "#f59e0b",
      },
      {
        label: "Assignments / Quizzes",
        data: assignmentCounts,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Count" },
      },
      x: {
        title: { display: true, text: "Courses" },
      },
    },
  };

  return (
    <div className="w-full overflow-auto p-4 bg-white rounded-xl shadow">
      <div className="min-w-[600px] h-[400px]">
        <h4 className="text-center mb-4 font-semibold text-lg">
          Teacher Course Dashboard
        </h4>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Teacherchart;
