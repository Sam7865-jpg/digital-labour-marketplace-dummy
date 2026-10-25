import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const CATEGORY_OPTIONS = [
  "General",
  "Electrical & Electronics",
  "Plumbing & Sanitary",
  "HVAC & AC Repair",
  "Carpentry & Woodwork",
  "Painting & Renovation",
  "Masonry & Construction",
  "Welding & Metalwork",
  "Automotive & Mechanic",
  "Solar & Renewable Energy",
  "Appliance Repair",
  "Roofing & Waterproofing",
  "Gardening & Landscaping",
  "CCTV & Security Systems",
  "Tile & Flooring Work"
];

export default function WorkerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    experience: "",
    hourlyRate: "",
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
        setFormData({
          title: res.data.occupation || "",
          category: res.data.category || "General",
          experience: res.data.experienceYears ?? "",
          hourlyRate: res.data.hourlyRate ?? "",
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
      const payload = {
        occupation: formData.title,
        category: formData.category,
        experienceYears: Number(formData.experience) || 0,
        hourlyRate: Number(formData.hourlyRate) || 0,
        city: formData.location,
        bio: formData.bio,
      };

      const res = await API.post("/worker/profile", payload);
      setMessage("Profile saved successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving profile");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading profile...</div>;

  return (
    <div style={{ minHeight: "85vh", background: "#f8fafc", padding: "40px 16px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", background: "#ffffff", borderRadius: "20px", padding: "36px 32px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
        
        {/* Header Title */}
        <h1 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
          Worker Digital ID
        </h1>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#64748b", margin: "0 0 24px 0" }}>
          Manage your professional worker profile details
        </p>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <Link
            to="/worker/skill-profiler"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#10b981",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.88rem",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
              transition: "all 0.2s ease"
            }}
          >
            Go to AI Skill Profiler →
          </Link>
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            background: message.includes("successfully") ? "#d1fae5" : "#fee2e2",
            color: message.includes("successfully") ? "#065f46" : "#991b1b",
            padding: "10px 14px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "0.85rem",
            fontWeight: "600",
            textAlign: "center"
          }}>
            {message}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Occupation / Work Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Plumber, Electrician"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "0.92rem",
                outline: "none",
                boxSizing: "border-box",
                background: "#f8fafc"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.92rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc",
                  cursor: "pointer"
                }}
              >
                {CATEGORY_OPTIONS.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Years Experience
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 5"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.92rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc"
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                Hourly Rate ($ / PKR)
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="e.g. 1200"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.92rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                City / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Islamabad"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.92rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Short Bio
            </label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Apne baare mein mukhtasar likhein..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "0.92rem",
                outline: "none",
                boxSizing: "border-box",
                background: "#f8fafc",
                resize: "vertical"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
            }}
          >
            Save Basic Profile
          </button>
        </form>
      </div>
    </div>
  );
}
