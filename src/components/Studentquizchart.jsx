import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDashboard } from "../redux/slice/dashboardSlice";
import Spinner from "./Spinner";
import "chart.js/auto";

const StudentQuizChart = () => {
  const dispatch = useDispatch();
  const { student, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (!student || !student.quizResults?.length)
    return <p style={{ textAlign: "center" }}>No quiz data found</p>;

  const labels = student.quizResults.map((q, index) => `Quiz ${index + 1}`);
  const scores = student.quizResults.map((q) => q.score);
  const totals = student.quizResults.map((q) => q.total);

  const data = {
    labels,
    datasets: [
      {
        label: "Score",
        data: scores,
        backgroundColor: "#f59e0b",
      },
      {
        label: "Total",
        data: totals,
        backgroundColor: "#d1d5db",
      },
    ],
  };

  const options = {
    responsive: true,           // enables responsiveness
    maintainAspectRatio: false, // allow parent container to control height
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Points" } },
      x: { title: { display: true, text: "Quizzes" } },
    },
  };

  return (
    <div className="w-full overflow-auto max-w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] mx-auto p-4 bg-white rounded-xl shadow">
      <h4 className="text-center mb-4 font-semibold text-lg">My Quiz Results</h4>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StudentQuizChart;
