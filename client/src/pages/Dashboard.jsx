import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button } from "../components";
import { getAllJournals} from "../services/journalService";
import {getMoodLogs} from "../services/moodService"

function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const journalData = await getAllJournals();
        setJournals(journalData.slice(0, 3));

        const moodData = await getMoodLogs();
        setMoodLogs(moodData.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load your dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-pink-50">
        <h1 className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading your wellness dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-pink-50">
        <h1 className="text-xl font-semibold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h2 className="mt-4 text-lg md:text-xl font-semibold text-indigo-600">
          🌿 Take care of your mind, one step at a time
        </h2>
      </section>

      <Container>
        {/* Quick Actions */}
        <section className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <Button onClick={() => navigate("/journal")} className="bg-purple-600 hover:bg-purple-700">
            🖊 Create Journal
          </Button>
          <Button onClick={() => navigate("/mood-logs")} className="bg-green-600 hover:bg-green-700">
            🌈 Log Mood
          </Button>
          <Button onClick={() => navigate("/mindfulness")} className="bg-indigo-600 hover:bg-indigo-700">
            🧘‍♀️ Mindfulness
          </Button>
        </section>

        {/* Dashboard Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
          {/* Recent Journals */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition">
            <h2 className="flex items-center gap-2 text-xl font-bold text-purple-700 mb-4">
              📝 Recent Journals
            </h2>
            {journals.length > 0 ? (
              journals.map((j) => (
                <div key={j._id} className="p-3 mb-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition">
                  <h3 className="font-medium text-gray-800 line-clamp-1">{j.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{j.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(j.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No journal entries yet</p>
            )}
            <Link
              to="/journal"
              className="block text-center mt-4 text-purple-700 font-medium hover:underline"
            >
              View All Journals →
            </Link>
          </div>

          {/* Recent Mood Logs */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition">
            <h2 className="flex items-center gap-2 text-xl font-bold text-green-700 mb-4">
              🌈 Mood Tracker
            </h2>
            {moodLogs.length > 0 ? (
              moodLogs.map((m) => (
                <div key={m._id} className="p-3 mb-3 rounded-lg bg-green-50 hover:bg-green-100 transition">
                  <p className="text-sm text-gray-700 line-clamp-2">{m.mood} - {m.note}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No mood logs yet</p>
            )}
            <Link
              to="/mood-logs"
              className="block text-center mt-4 text-green-700 font-medium hover:underline"
            >
              View All Mood Logs →
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default Dashboard;
