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


  // ... (logic remains same)
  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">School Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">Students: <b>{studentsCount}</b></div>
        <div className="p-4 bg-green-50 rounded-lg">Teachers: <b>{teachersCount}</b></div>
        <div className="p-4 bg-purple-50 rounded-lg">Courses: <b>{coursesCount}</b></div>
        <div className="p-4 bg-orange-50 rounded-lg text-sm">Submitted: <b>{submittedCount}</b></div>
        <div className="p-4 bg-red-50 rounded-lg text-sm">Pending: <b>{pendingCount}</b></div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-center mb-4 font-semibold">Monthly Registrations</h3>
        <div className="relative h-[300px] sm:h-[400px] w-[80%] mx-auto">
          <Line
            options={{ responsive: true, maintainAspectRatio: false }}
            data={{
              labels: months,
              datasets: [{
                  label: "New Students",
                  data: counts,
                  borderColor: "rgb(53, 162, 235)",
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                  fill: true
              }],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Schooladminchart;
