import React, { useEffect, useState } from "react";
import { getMoodLogs, createMoodLog } from "../services/moodService";
import { Button, Select } from "../components";
import { toast } from "react-toastify";

function MoodLog() {
  const [moodLogs, setMoodLogs] = useState([]);
  const [newMood, setNewMood] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodLogs = async () => {
      try {
        setLoading(true);
        const logs = await getMoodLogs(); // ✅ don't pass user._id
        setMoodLogs(logs);
      } catch (err) {
        toast.error("⚠️ Failed to load mood logs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodLogs();
  }, []);

  const handleAddMood = async (e) => {
    e.preventDefault();
    if (!newMood) return toast.warning("Please select a mood");

    try {
      const entry = await createMoodLog({ moodValue: parseInt(newMood) }); // match backend
      setMoodLogs([entry, ...moodLogs]);
      setNewMood("");
      toast.success("✅ Mood log added");
    } catch (err) {
      toast.error("❌ Failed to add mood log");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading your mood logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          Your Mood Logs
        </h1>

        {/* Add Mood */}
        <form onSubmit={handleAddMood} className="mb-6 flex flex-col gap-2">
          <Select
            label="Select Mood"
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            options={[
              { label: "Very Sad", value: 1 },
              { label: "Sad", value: 2 },
              { label: "Neutral", value: 3 },
              { label: "Happy", value: 4 },
              { label: "Very Happy", value: 5 },
            ]}
          />
          <Button type="submit" className="mt-2 w-full bg-pink-600 hover:bg-pink-700">
            Add Mood
          </Button>
        </form>

        {/* Mood Logs List */}
        <div className="space-y-4">
          {moodLogs.length > 0 ? (
            moodLogs.map((log) => (
              <div
                key={log._id}
                className="p-4 rounded-2xl bg-pink-50 border border-pink-100 shadow-sm"
              >
                <p className="text-gray-700">{log.moodLabel}</p> {/* ✅ use moodLabel */}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No mood logs yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodLog;
