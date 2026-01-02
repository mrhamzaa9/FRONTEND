import React, { useEffect, useState } from "react"; // 1. Added useState
import { Bar, Line } from "react-chartjs-2"; // 2. Added Line import
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherDashboard } from "../redux/slice/dashboardSlice";
import Spinner from "./Spinner";
import "chart.js/auto";

const Teacherchart = () => {
  const [chartType, setChartType] = useState("bar"); // State to track chart type
  const dispatch = useDispatch();
  const { teacher, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchTeacherDashboard());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (!teacher || !teacher.courses?.length)
    return <p style={{ textAlign: "center" }}>No course data found</p>;

  const labels = teacher.courses.map((c) => c.name);

  const studentCounts = labels.map((courseName) => {
    const courseData = teacher.studentsPerCourse.find(
      (s) => s.courseName === courseName
    );
    return courseData ? courseData.studentCount : 0;
  });

  const assignmentCounts = labels.map((courseName) => {
    const quizData = teacher.quizStats.find((q) => q.courseName === courseName);
    return quizData ? 1 : 0; 
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Students",
        data: studentCounts,
        backgroundColor: "rgba(245, 158, 11, 0.5)", // Added alpha for Line chart fill
        borderColor: "#f59e0b",
        borderWidth: 2,
        tension: 0.3, // Smoothes the line in Line chart
      },
      {
        label: "Assignments / Quizzes",
        data: assignmentCounts,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        tension: 0.3,
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
      y: { beginAtZero: true, title: { display: true, text: "Count" } },
      x: { title: { display: true, text: "Courses" } },
    },
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h4 className="font-bold text-xl text-gray-800">Teacher Analytics</h4>
        
        {/* Toggle Switch */}
        <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              chartType === "bar" 
                ? "bg-white text-blue-600 shadow" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              chartType === "line" 
                ? "bg-white text-blue-600 shadow" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>

      <div className="relative h-[350px] sm:h-[450px] w-[80%] mx-auto">
        {chartType === "bar" ? (
          <Bar data={data} options={options} />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default Teacherchart;