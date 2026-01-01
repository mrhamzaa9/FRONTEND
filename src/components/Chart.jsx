
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/slice/schoolSlice";
import Spinner from "./Spinner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Chart() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.school);

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading === "loading") return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(roleCounts).map((role) => ({
    name: role,
    value: roleCounts[role],
  }));

  const COLORS = ["#F59E0B", "#B45309", "#9333EA", "#2563EB"];

  return (
    <div className="bg-white border-2 border-amber-300 p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">
        Users by Role
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart >
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
