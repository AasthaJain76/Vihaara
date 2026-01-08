import React, { useEffect, useState } from "react";
import { getMoodAnalytics } from "../services/journalService";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MoodAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getMoodAnalytics();
        setData(res);
      } catch {
        toast.error("Failed to load mood analytics");
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <p className="text-center">Loading analytics...</p>;

  const { moodCount, weeklyTrend, longestPositiveStreak } = data;

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow-md">

        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          📊 Mood Analytics
        </h1>

        {/* 🔢 Mood Count */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(moodCount).map(([mood, count]) => (
            <div
              key={mood}
              className="bg-indigo-100 rounded-xl p-4 text-center"
            >
              <p className="text-sm text-gray-600 capitalize">{mood}</p>
              <p className="text-xl font-bold text-indigo-700">{count}</p>
            </div>
          ))}
        </div>

        {/* 🔥 Positive Streak */}
        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-gray-700">
            🔥 Longest Positive Streak
          </p>
          <p className="text-3xl font-bold text-green-600">
            {longestPositiveStreak} days
          </p>
        </div>

        {/* 📈 Weekly Trend Chart */}
        <div className="h-64">
          <p className="text-lg font-medium text-gray-700 mb-2">
            Weekly Mood Trend
          </p>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyTrend}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default MoodAnalytics;
