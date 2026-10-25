import { useState, useEffect } from "react";
import API from "../api";

export default function SkillProfilerPage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  // Form States
  const [occupation, setOccupation] = useState("");
  const [category, setCategory] = useState("General");
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceText, setExperienceText] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  // Voice Recording States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    fetchProfile();
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/worker/profile");
      if (res.data) {
        setProfile(res.data);
        setOccupation(res.data.occupation || "");
        setCategory(res.data.category || "General");
        setExperienceYears(res.data.experienceYears || 0);
      }
    } catch (err) {
      console.log("No profile found yet");
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Aapka browser Voice Input support nahi karta. Google Chrome use karein.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "ur-PK";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setExperienceText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.stop();
    else recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const toolsArray = toolsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        occupation,
        category,
        experienceYears: Number(experienceYears),
        experienceDetail: experienceText,
        experienceText: experienceText,
        toolsUsed: toolsArray,
      };

      const res = await API.post("/worker/ai-skill-profiler", payload);
      setResult(res.data);
      setMessage("AI Skill Profiling successfully generated!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error running skill profiler");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (skillObj) => {
    try {
      const res = await API.post("/worker/add-recommended-skill", skillObj);
      setMessage(`Added skill to profile: ${skillObj.skillName}`);
      if (res.data?.skills) {
        setResult((prev) => ({
          ...prev,
          workerProfile: {
            ...prev.workerProfile,
            skills: res.data.skills,
          },
        }));
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add skill");
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>AI-Powered Skill Profiler</h2>

      {message && (
        <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "10px", borderRadius: "6px", marginBottom: "15px" }}>
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* LEFT COLUMN: EXPERIENCE FORM */}
        <form onSubmit={handleSubmit} style={{ border: "1px solid #cbd5e1", padding: "20px", borderRadius: "8px", background: "#f8fafc" }}>
          <h3 style={{ marginTop: 0 }}>Input Your Experience & Tools</h3>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: "bold" }}>Occupation Title:</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Electrician, Plumber"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontWeight: "bold" }}>Category:</label>
              <input
                type="text"
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontWeight: "bold" }}>Years Experience:</label>
              <input
                type="number"
                style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontWeight: "bold" }}>Describe Work Experience:</label>
              
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  style={{
                    background: isListening ? "#ef4444" : "#10b981",
                    color: "#fff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                >
                  {isListening ? "🔴 Listening..." : "🎙️ Speak (Voice Input)"}
                </button>
              )}
            </div>

            <textarea
              rows="4"
              style={{ width: "100%", padding: "8px" }}
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              placeholder="Bol kar ya type karke apna kaam wazahat se likhein..."
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "bold" }}>Tools You Use (Comma Separated):</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="e.g. Tester, Multimeter, Drill Machine"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#2563eb",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "AI Processing Experience..." : "Analyze Experience & Generate Skills"}
          </button>
        </form>

        {/* RIGHT COLUMN: AI PROFILING REPORT */}
        <div>
          {result ? (
            <div style={{ border: "1px solid #10b981", padding: "20px", borderRadius: "8px", background: "#f0fdf4" }}>
              <h3 style={{ marginTop: 0, color: "#065f46" }}>AI Skill Profiling Report</h3>

              <div style={{ background: "#fff", padding: "12px", borderRadius: "6px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "4px 0" }}>
                  <strong>Tier Badge:</strong>{" "}
                  <span style={{ background: "#3b82f6", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold" }}>
                    {result.workerProfile?.experienceTierBadge}
                  </span>
                </p>
                <p style={{ margin: "4px 0" }}><strong>Skill Strength Score:</strong> {result.workerProfile?.skillStrengthScore}%</p>
                <p style={{ margin: "4px 0", color: "#475569", fontSize: "0.9rem" }}><strong>AI Summary:</strong> {result.workerProfile?.aiSkillSummary}</p>
              </div>

              <h4>Extracted Current Skills</h4>
              {result.workerProfile?.skills?.map((sk, index) => (
                <div key={index} style={{ background: "#fff", padding: "8px 12px", borderRadius: "6px", marginBottom: "8px", border: "1px solid #cbd5e1" }}>
                  <strong>{sk.skillName}</strong> - <em style={{ color: "#2563eb" }}>{sk.proficiencyLevel}</em> ({sk.confidenceScore}% confidence)
                </div>
              ))}

              {/* POTENTIAL SKILL RECOMMENDATION SECTION */}
              {result.recommendedSkills?.length > 0 && (
                <div style={{ marginTop: "20px", borderTop: "2px dashed #a7f3d0", paddingTop: "15px" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#047857", display: "flex", alignItems: "center", gap: "6px" }}>
                    💡 Potential Skill Recommendations & Career Growth
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "#475569", marginTop: 0 }}>
                    Naye high-demand skills add karke apni market demand aur hourly rate barhayein:
                  </p>

                  {result.recommendedSkills.map((rec, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#fff",
                        border: "1px solid #fde68a",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "10px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>{rec.skillName}</strong>
                          <span style={{ marginLeft: "8px", background: "#fef3c7", color: "#b45309", padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                            {rec.category}
                          </span>
                        </div>
                        <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: "bold" }}>
                          {rec.earningImpact}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "6px 0 10px 0" }}>
                        📌 <em>{rec.reason}</em>
                      </p>

                      <button
                        onClick={() => handleAddSkill(rec)}
                        style={{
                          background: "#d97706",
                          color: "#fff",
                          border: "none",
                          padding: "5px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        + Add Skill to Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div style={{ border: "2px dashed #cbd5e1", padding: "40px", borderRadius: "8px", textAlign: "center", color: "#64748b" }}>
              Fill the form on the left (or use 🎙️ Voice Input) and click <strong>Analyze Experience</strong> to view AI profiling and potential skill recommendations.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}