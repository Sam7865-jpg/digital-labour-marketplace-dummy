import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    experience: 0,
    hourlyRate: 0,
    location: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/worker/profile");
      if (res.data) {
        setProfile(res.data);
        setFormData({
          title: res.data.occupation || "",
          category: res.data.category || "General",
          experience: res.data.experienceYears || 0,
          hourlyRate: res.data.hourlyRate || 0,
          location: res.data.city || "",
          bio: res.data.bio || "",
        });
      }
    } catch (err) {
      console.log("Profile missing or new user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Backend WorkerProfile Schema ke keys ke mutabiq payload mapping
      const payload = {
        occupation: formData.title,
        category: formData.category,
        experienceYears: Number(formData.experience),
        hourlyRate: Number(formData.hourlyRate),
        city: formData.location,
        bio: formData.bio,
      };

      const res = await API.post("/worker/profile", payload);
      setMessage("Profile saved successfully!");
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving profile");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Worker Digital ID & Basic Profile</h2>
        <Link 
          to="/worker/skill-profiler" 
          style={{ background: "#10b981", color: "#fff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem" }}
        >
          Go to AI Skill Profiler →
        </Link>
      </div>

      {message && (
        <div style={{ 
          background: message.includes("successfully") ? "#d1fae5" : "#fee2e2", 
          color: message.includes("successfully") ? "#065f46" : "#991b1b",
          padding: "12px", 
          borderRadius: "6px", 
          marginBottom: "15px",
          fontWeight: "600"
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ border: "1px solid #e2e8f0", padding: "20px", borderRadius: "8px", background: "#fff" }}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold" }}>Occupation / Work Title:</label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Plumber, Electrician"
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ fontWeight: "bold" }}>Category:</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontWeight: "bold" }}>Years of Experience:</label>
            <input
              type="number"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ fontWeight: "bold" }}>Hourly Rate ($ or PKR):</label>
            <input
              type="number"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontWeight: "bold" }}>City / Location:</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Short Bio:</label>
          <textarea
            rows="3"
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Apne baare mein mukhtasar likhein..."
          />
        </div>

        <button
          type="submit"
          style={{ background: "#2563eb", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Save Basic Profile
        </button>
      </form>
    </div>
  );
}