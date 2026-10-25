import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <header style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "15px 30px", 
      background: "#fff", 
      borderBottom: "1px solid #e2e8f0" 
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#0f172a" }}>
          Digital Labour Marketplace
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {user?.role === "worker" && (
          <>
            <Link 
              to="/worker/profile" 
              style={{ 
                textDecoration: "none", 
                color: location.pathname === "/worker/profile" ? "#2563eb" : "#64748b", 
                fontWeight: "600" 
              }}
            >
              Digital ID & Profile
            </Link>

            {/* AI Skill Profiler link SIRF AI Profiler page par hi dikhega */}
            {location.pathname === "/worker/skill-profiler" && (
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                AI Skill Profiler
              </span>
            )}
          </>
        )}

        {user && (
          <span style={{ background: "#f1f5f9", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "#334155" }}>
            {user.name || user.email} ({user.role})
          </span>
        )}

        {user && (
          <button 
            onClick={onLogout} 
            style={{ 
              background: "#fee2e2", 
              color: "#ef4444", 
              border: "none", 
              padding: "6px 14px", 
              borderRadius: "6px", 
              cursor: "pointer", 
              fontWeight: "bold" 
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}