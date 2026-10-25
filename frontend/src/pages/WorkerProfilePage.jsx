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
  const [profileData, setProfileData] = useState(null);

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
        setProfileData(res.data);
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
      setProfileData(res.data);
      setMessage("Profile saved successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving profile");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading profile...</div>;

  return (
    <div style={{ minHeight: "85vh", background: "#f8fafc", padding: "40px 24px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gridTemplateColumns: profileData ? "340px 1fr" : "1fr", gap: "28px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: DIGITAL ID CARD (SHOWN ONCE PROFILE CREATED) */}
        {profileData && (
          <div style={{ background: "#ffffff", borderRadius: "20px", padding: "28px 24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              🪪 Digital ID Profile
            </h2>

            {/* Profile Header Card */}
            <div style={{ background: "#f1f5f9", padding: "14px", borderRadius: "12px", marginBottom: "16px" }}>
              <div style={{ fontSize: "1rem", fontWeight: "800", color: "#0f172a" }}>
                {profileData.occupation || formData.title || "Skilled Worker"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>
                Category: <strong>{profileData.category || formData.category}</strong>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px" }}>
                Location: <strong>{profileData.city || formData.location || "Not specified"}</strong>
              </div>
            </div>

            {/* Badge & Hourly Rate */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px", borderRadius: "14px", marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ background: "#2563eb", color: "#ffffff", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" }}>
                  {profileData.experienceTierBadge || `${formData.experience || 0} Yrs Exp`}
                </span>
                <span style={{ fontSize: "0.88rem", fontWeight: "800", color: "#16a34a" }}>
                  PKR {profileData.hourlyRate || formData.hourlyRate || 0}/hr
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#334155", lineHeight: "1.4" }}>
                {profileData.bio || "Profile active on Digital Labour Marketplace."}
              </p>
            </div>

            {/* Extracted Skills Section */}
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b", margin: "0 0 10px 0" }}>
              Extracted Skills ({profileData.skills?.length || 0})
            </h3>
            {profileData.skills && profileData.skills.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {profileData.skills.map((sk, idx) => (
                  <div key={idx} style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>{sk.skillName}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{sk.category || "General"}</div>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "6px" }}>
                      {sk.proficiencyLevel || "Intermediate"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "0.82rem", color: "#64748b", fontStyle: "italic", background: "#f8fafc", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                No AI skills added yet. Use the <strong>AI Skill Profiler</strong> to extract skills automatically.
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: FORM */}
        <div style={{ maxWidth: profileData ? "100%" : "480px", margin: profileData ? "0" : "0 auto", background: "#ffffff", borderRadius: "20px", padding: "36px 32px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
          
          <h1 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Worker Digital ID
          </h1>
          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#64748b", margin: "0 0 24px 0" }}>
            Manage your professional worker profile details
          </p>

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
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
              }}
            >
              Go to AI Skill Profiler →
            </Link>
          </div>

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
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.92rem", outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
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
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.92rem", outline: "none", boxSizing: "border-box", background: "#f8fafc", cursor: "pointer" }}
                >
                  {CATEGORY_OPTIONS.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
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
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.92rem", outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
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
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.92rem", outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
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
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.92rem", outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
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
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.92rem", outline: "none", boxSizing: "border-box", background: "#f8fafc", resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              style={{ width: "100%", marginTop: "8px", padding: "12px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" }}
            >
              Save Basic Profile
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
