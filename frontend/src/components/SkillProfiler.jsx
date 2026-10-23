import { useState, useEffect } from 'react';
import API from '../api';

export default function SkillProfiler() {
  const [experienceText, setExperienceText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Endpoint paths - Apne backend ke according adjust karein (/worker ya /workers)
  const SKILLS_ENDPOINT = '/worker/skills';
  const EXTRACT_ENDPOINT = '/worker/extract-skills';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get(SKILLS_ENDPOINT);
        if (res?.data) {
          setExperienceText(res.data.experienceText || '');
          setExtractedSkills(res.data.extractedSkills || []);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData(localUser);
        setFetching(false);
      }
    };

    fetchSkills();
  }, []);

  const handleAIExtract = async (e) => {
    e.preventDefault();
    if (!experienceText.trim()) {
      setMessage({ text: 'Barah-e-karam apna tajurba tafseel se likhein.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await API.post(EXTRACT_ENDPOINT, { experienceText });
      
      setMessage({ 
        text: res.data.message || 'AI ne kamyabi se skills extract kar lein!', 
        type: 'success' 
      });

      const skills = res.data.skillProfile ? res.data.skillProfile.extractedSkills : res.data.extractedSkills;
      setExtractedSkills(skills || []);
    } catch (err) {
      console.error('AI Extraction Error:', err);
      setMessage({ 
        text: err.response?.data?.message || 'AI extraction mein error aaya. Backend server check karein.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Field relevant dynamic skill recommendations
  const getRelevantSuggestions = () => {
    const text = (experienceText + " " + extractedSkills.map(s => s.skillName).join(" ")).toLowerCase();

    if (text.includes('electric') || text.includes('wiring') || text.includes('circuit') || text.includes('bijli')) {
      return [
        'Advanced Circuit Troubleshooting',
        'Solar Panel Installation & Maintenance',
        'Industrial Electrical Safety Standards',
        'Smart Home Automation Wiring'
      ];
    } else if (text.includes('plumb') || text.includes('pipe') || text.includes('water') || text.includes('sanitary') || text.includes('nal')) {
      return [
        'Advanced Pipe Fitting & Welding',
        'Modern Drainage System Design',
        'Water Filtration & Pump Maintenance',
        'Advanced Sanitary Installation'
      ];
    } else if (text.includes('mason') || text.includes('brick') || text.includes('mistry') || text.includes('construction') || text.includes('cement')) {
      return [
        'Civil Engineering Fundamentals Course',
        'Advanced Blueprint & Plan Reading',
        'Structural Safety Standards & OSHA',
        'Project Cost Estimation & Budgeting'
      ];
    } else {
      return [
        'Advanced Professional Certification',
        'Safety Standards & Compliance',
        'Client Communication & Quality Assurance',
        'Emergency Quick Response Management'
      ];
    }
  };

  if (fetching) {
    return (
      <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'center', padding: '20px', color: '#64748b' }}>
        Loading skill profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '10px auto', padding: '15px', background: '#fff', borderRadius: '12px' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '22px', fontWeight: 'bold' }}>
        AI Experience & Skill Profiler
      </h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
        Apna tajurba ya kaam ki tafseel yahan likhein, AI aapka data analyze karke ek professional structured profile taiyar karega:
      </p>

      {message.text && (
        <p style={{
          color: message.type === 'error' ? '#dc2626' : '#16a34a',
          fontWeight: 'bold',
          marginBottom: '15px',
          background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          padding: '10px',
          borderRadius: '6px',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleAIExtract} style={{ marginBottom: '25px' }}>
        <textarea
          rows="4"
          placeholder="Misal: Main 5 saal se wiring, circuit breaker fixing aur ac repair ka kaam kar raha hoon..."
          value={experienceText}
          onChange={(e) => setExperienceText(e.target.value)}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px',
            border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#0f172a',
            fontWeight: '500', boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px'
          }}
        >
          {loading ? 'AI Profile Generate Kar Raha Hai... ⏳' : 'Generate & Save Structured Profile 🚀'}
        </button>
      </form>

      {/* --- CLICKABLE STRUCTURED PROFILE CARD --- */}
      {extractedSkills.length > 0 && (
        <div
          onClick={() => setShowDetailModal(true)}
          style={{
            border: '2px solid #3b82f6',
            borderRadius: '10px',
            padding: '20px',
            background: '#f8fafc',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '45px', height: '45px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                👤
              </div>
              <div>
                <h3 style={{ margin: '0 0 3px 0', color: '#0f172a', fontSize: '16px' }}>{userData.name || 'Worker Profile'}</h3>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                  Verified Professional • Click for Details 🔍
                </span>
              </div>
            </div>
            <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '13px' }}>View Detail &rarr;</span>
          </div>

          <div style={{ marginTop: '12px', color: '#475569', fontSize: '13px' }}>
            <strong>Extracted Skills Preview:</strong> {extractedSkills.map(s => s.skillName || s).join(', ')}
          </div>
        </div>
      )}

      {/* --- DETAILED PROFILE MODAL (POPUP) --- */}
      {showDetailModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
        }}>
          <div style={{
            background: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '600px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
          }}>

            <button
              onClick={() => setShowDetailModal(false)}
              style={{
                position: 'absolute', top: '15px', right: '15px', background: '#ef4444', color: 'white',
                border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
              <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{userData.name || 'Worker Name'}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Email: {userData.email || 'N/A'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#334155', marginBottom: '6px', fontSize: '14px' }}>📄 Complete Professional Bio:</h4>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', fontSize: '13px', lineHeight: '1.5' }}>
                {experienceText || 'No experience details provided.'}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#334155', marginBottom: '8px', fontSize: '14px' }}>⚡ Extracted Skills & Proficiency:</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {extractedSkills.map((s, index) => (
                  <div key={index} style={{ background: '#e0e7ff', color: '#3730a3', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    🛠️ {s.skillName || s} {s.proficiency && <span style={{ background: '#c7d2fe', padding: '2px 5px', borderRadius: '4px', marginLeft: '4px' }}>{s.proficiency}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Potential Skill Suggestions */}
            {extractedSkills.length > 0 && (
              <div style={{ marginBottom: '20px', background: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '15px' }}>
                <h4 style={{ color: '#854d0e', marginBottom: '6px', fontSize: '14px' }}>
                  💡 AI Potential Skill Suggestions (Relevant to Your Field)
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {getRelevantSuggestions().map((suggestion, idx) => (
                    <span key={idx} style={{ background: '#fef08a', color: '#713f12', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      ✨ {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetailModal(false)}
              style={{
                width: '100%', padding: '10px', background: '#0f172a', color: 'white',
                border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Close Detailed Profile
            </button>

          </div>
        </div>
      )}
    </div>
  );
}