import React, { useEffect, useState, useRef } from "react";
import {
  getAllJournals,
  createJournalEntry,
  regenerateAI,
  getWeeklyAIInsights,
  updateJournalEntry,
  deleteJournalEntry,
} from "../services/journalService";
import { Button, Input } from "../components";
import WeeklyInsightCard from "../components/WeeklyInsightCard";
import { toast } from "react-toastify";

function Journal() {
  const [journals, setJournals] = useState([]);
  const [weeklyInsight, setWeeklyInsight] = useState(null);
  const [entryText, setEntryText] = useState("");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(true);

  // ✏️ Edit states
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editMood, setEditMood] = useState("neutral");

  const journalListRef = useRef(null);

  // 📚 Fetch journals
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getAllJournals();
        setJournals(data || []);
      } catch {
        toast.error("Failed to load journals");
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  // 🧠 Weekly insights
  useEffect(() => {
    const fetchWeeklyInsight = async () => {
      try {
        const res = await getWeeklyAIInsights();
        setWeeklyInsight(res.insights || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeeklyInsight();
  }, []);

  // 🔄 Auto refresh (AI updates)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getAllJournals();
        setJournals(data || []);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✍️ Create entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entryText.trim()) return toast.warning("Journal entry cannot be empty");

    try {
      const res = await createJournalEntry({ entryText, mood });
      setJournals((prev) => [res.entry, ...prev]);
      setEntryText("");
      setMood("neutral");
      toast.success("Journal entry added");

      const insightRes = await getWeeklyAIInsights();
      setWeeklyInsight(insightRes.insights || null);

      journalListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to create journal");
    }
  };

  // 💾 Save edited journal
  const handleUpdate = async (id) => {
    if (!editText.trim()) return toast.warning("Entry cannot be empty");

    try {
      const res = await updateJournalEntry(id, {
        entryText: editText,
        mood: editMood,
      });

      setJournals((prev) =>
        prev.map((j) => (j._id === id ? res.entry : j))
      );

      setEditingId(null);
      toast.success("Journal updated");
    } catch {
      toast.error("Failed to update journal");
    }
  };

  // 🗑 Delete journal
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this journal entry?")) return;

    try {
      await deleteJournalEntry(id);
      setJournals((prev) => prev.filter((j) => j._id !== id));
      toast.success("Journal deleted");
    } catch {
      toast.error("Failed to delete journal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading journals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl shadow-md">

        <h1 className="text-2xl font-bold text-indigo-600 text-center mb-4">
          Your Journal
        </h1>

        {/* 🧠 Weekly Insight */}
        <WeeklyInsightCard insight={weeklyInsight} />

        {/* ✍️ New Entry */}
        <form onSubmit={handleSubmit} className="mb-6">
          <Input
            label="Journal Entry"
            placeholder="Write your thoughts..."
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
          />

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-2 w-full border rounded-lg p-2"
          >
            <option value="neutral">Neutral</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="stressed">Stressed</option>
          </select>

          <Button type="submit" className="w-full mt-3 bg-indigo-600">
            Add Entry
          </Button>
        </form>

        {/* 📖 Journal List */}
        <div ref={journalListRef} className="space-y-4 max-h-[70vh] overflow-y-auto">

          {journals.length === 0 && (
            <p className="text-center text-gray-500">No journal entries yet</p>
          )}

          {journals.map((j) => (
            <div key={j._id} className="bg-indigo-50 p-4 rounded-2xl">

              {editingId === j._id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />

                  <select
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                    className="mt-2 w-full border rounded-lg p-2"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="angry">Angry</option>
                    <option value="stressed">Stressed</option>
                  </select>

                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleUpdate(j._id)}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800">{j.entryText}</p>

                  <div className="text-xs text-gray-600 mt-2 flex justify-between">
                    <span>😊 Mood: {j.mood}</span>
                    <span>{new Date(j.createdAt).toLocaleString()}</span>
                  </div>

                  {j.aiSummary && (
                    <div className="mt-3 text-sm italic text-indigo-700">
                      🧠 {j.aiSummary}
                    </div>
                  )}

                  {j.aiSuggestions?.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {j.aiSuggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-4 mt-3 text-xs">
                    <button
                      onClick={() => {
                        setEditingId(j._id);
                        setEditText(j.entryText);
                        setEditMood(j.mood);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(j._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑 Delete
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await regenerateAI(j._id);
                          toast.success("Regenerating AI insights...");
                        } catch {
                          toast.error("Failed to regenerate AI");
                        }
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      🔄 Regenerate AI
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Journal;
