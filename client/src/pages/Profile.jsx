import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile, deleteMyProfile } from "../services/profileService";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "prefer not to say",
    avatar: "",
    tone: "friendly",
    responseLength: "medium",
    theme: "light",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile({
        ...data,
        tone: data.preferences?.tone || "friendly",
        responseLength: data.preferences?.responseLength || "medium",
        theme: data.preferences?.theme || "light",
      });
    } catch (err) {
      console.log("❌ Failed to fetch profile:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyProfile(profile);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteMyProfile();
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">🧘 My Vihaara Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={profile.age}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />

        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        >
          <option value="prefer not to say">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        {/* 🧠 Preferences */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2 text-gray-700">Chat Preferences</h3>

          <label className="block text-sm">Tone</label>
          <select
            name="tone"
            value={profile.tone}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="friendly">Friendly</option>
            <option value="clinical">Clinical</option>
            <option value="motivational">Motivational</option>
            <option value="spiritual">Spiritual</option>
          </select>

          <label className="block text-sm mt-2">Response Length</label>
          <select
            name="responseLength"
            value={profile.responseLength}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>

          <label className="block text-sm mt-2">Theme</label>
          <select
            name="theme"
            value={profile.theme}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600 transition"
      >
        Delete My Account
      </button>
    </div>
  );
}
