import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchoolAdminDashboard } from "../redux/slice/dashboardSlice";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

function Schooladminchart() {
  const dispatch = useDispatch();
  const { schoolAdmin, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSchoolAdminDashboard()); // no schoolId needed
  }, [dispatch]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!schoolAdmin) return <p>No data available</p>;

  const { studentsCount, teachersCount, coursesCount, submittedCount, pendingCount, monthlyRegistrations } = schoolAdmin;

  // Prepare chart data for monthly registrations
  const months = monthlyRegistrations.map((m) => `${m.month}/${m.year}`);
  const counts = monthlyRegistrations.map((m) => m.count);


  // Standardized Chart Container Component to keep code clean
  const ChartWrapper = ({ title, children }) => (
    <div className="w-full bg-white p-4 rounded-xl shadow">
      <h4 className="text-center mb-4 font-semibold text-gray-700">{title}</h4>
      <div className="relative h-[250px] sm:h-[350px] w-full">
        {children}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <ChartWrapper title="Students per School">
        <Bar data={barData(studentsPerSchool, "schoolName", "count", "#f59e0b")} options={options} />
      </ChartWrapper>

      <ChartWrapper title="Courses per School">
        <Bar data={barData(coursesPerSchool, "name", "courseCount", "#3b82f6")} options={options} />
      </ChartWrapper>

      <ChartWrapper title="Monthly Registrations">
        <Bar
          data={{
            labels: monthlyRegistrations.map((m) => `${m.month}/${m.year}`),
            datasets: [{ label: "Students", data: monthlyRegistrations.map((m) => m.count), backgroundColor: "#f43f5e" }],
          }}
          options={options}
        />
      </ChartWrapper>

      <ChartWrapper title="Average Quiz Score">
        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartWrapper>
    </div>
  );
};

export default Schooladminchart;
