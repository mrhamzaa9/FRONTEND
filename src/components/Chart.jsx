import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, Doughnut } from "react-chartjs-2";
import { fetchSuperAdminDashboard } from "../redux/slice/dashboardSlice";
import Spinner from "./Spinner";
import "chart.js/auto";

const Chart= () => {
  const dispatch = useDispatch();
  const { superAdmin, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSuperAdminDashboard());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (!superAdmin) return <p style={{ textAlign: "center" }}>No data found</p>;

  const {
    studentsPerSchool,
    teachersPerSchool,
    coursesPerSchool,
    monthlyRegistrations,
    quizAverage,
  } = superAdmin;

  // Bar chart helper
  const barData = (items, labelKey, valueKey, color) => ({
    labels: items.map((i) => i[labelKey]),
    datasets: [
      {
        label: valueKey,
        data: items.map((i) => i[valueKey]),
        backgroundColor: color,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } },
  };

  const doughnutData = {
    labels: ["Average Quiz Score", "Remaining"],
    datasets: [
      {
        data: [quizAverage?.[0]?.avgScore || 0, 100 - (quizAverage?.[0]?.avgScore || 0)],
        backgroundColor: ["#f59e0b", "#d1d5db"],
      },
    ],
  };

  return (
    <div className="space-y-10">
      {/* Students per school */}
      <div style={{ width: "100%", height: 300, overflowX: "hidden", overflowY: "hidden" }}>
        <h4 style={{ textAlign: "center" }}>Students per School</h4>
        <Bar data={barData(studentsPerSchool, "schoolName", "count", "#f59e0b")} options={options} />
      </div>

  

      {/* Courses per school */}
      <div style={{ width: "100%", height: 300, overflowX: "hidden", overflowY: "hidden" }}>
        <h4 style={{ textAlign: "center" }}>Courses per School</h4>
        <Bar data={barData(coursesPerSchool, "name", "courseCount", "#3b82f6")} options={options} />
      </div>

      {/* Monthly Registrations */}
      <div style={{ width: "100%", height: 300, overflowX: "hidden", overflowY: "hidden" }}>
        <h4 style={{ textAlign: "center" }}>Monthly Registrations</h4>
        <Bar
          data={{
            labels: monthlyRegistrations.map((m) => `${m.month}/${m.year}`),
            datasets: [{ label: "Students", data: monthlyRegistrations.map((m) => m.count), backgroundColor: "#f43f5e" }],
          }}
          options={options}
        />
      </div>

      {/* Average Quiz Score */}
      <div style={{ width: "100%", height: 300 }}>
        <h4 style={{ textAlign: "center" }}>Average Quiz Score</h4>
        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default Chart;
