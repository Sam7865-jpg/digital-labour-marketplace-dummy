import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SkillProfiler from '../components/SkillProfiler';

const WorkerProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Alialllll',
    trade: 'Plumber',
    category: 'Home Maintenance',
    experienceYears: 5,
    hourlyRate: 1200,
    city: 'Islamabad',
    sector: 'H-8/4',
    bio: ''
  });

  const [aiSummary, setAiSummary] = useState('');
  const [aiSkills, setAiSkills] = useState([]);
  
  const [isProfileCreated, setIsProfileCreated] = useState(true);
  const [showProfilerModal, setShowProfilerModal] = useState(false);
  const [message, setMessage] = useState('');

  // Handle Sync from AI Profiler
  const handleProfileSynced = (aiData) => {
    if (aiData.professionalSummary) {
      setAiSummary(aiData.professionalSummary);
    }
    if (aiData.categorizedSkills) {
      const flattened = [];
      aiData.categorizedSkills.forEach(group => {
        group.skills.forEach(skill => {
          flattened.push({ name: skill.name, proficiency: skill.proficiency, category: group.categoryName });
        });
      });
      setAiSkills(flattened);
    }
    setMessage('AI Skills & Professional Summary synchronized with Digital Identity Card!');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsProfileCreated(true);
    setMessage('Profile successfully updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar 
        onOpenProfiler={() => setShowProfilerModal(true)} 
        isProfileCreated={isProfileCreated} 
      />

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        
        {isProfileCreated && (
          <div style={{ background: 'linear-gradient(90deg, #ede9fe 0%, #f3e8ff 100%)', border: '1px solid #c084fc', padding: '14px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <strong style={{ color: '#5b21b6', fontSize: '15px' }}>🚀 AI Profiler Ready:</strong>
              <span style={{ color: '#4c1d95', fontSize: '14px', marginLeft: '8px' }}>Extract structured trade skills & auto-sync to Digital ID Card.</span>
            </div>
            <button 
              onClick={() => setShowProfilerModal(true)}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ✨ Open AI Skill Profiler
            </button>
          </div>
        )}

        <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '4px' }}>Worker Digital Identity</h2>
        <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Manage your verified trade qualifications and hourly wage details.</p>

        {message && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          
          {/* LABOUR IDENTITY CARD (Auto-Synced with AI Summary & Skills) */}
          <div style={{ background: '#0f172a', color: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#94a3b8' }}>LABOUR IDENTITY CARD</span>
              <span style={{ background: '#059669', color: '#ecfdf5', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>● ACTIVE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold' }}>
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{profile.name}</h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>{profile.trade}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#1e293b', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>EXPERIENCE</span>
                <strong>{profile.experienceYears} Years</strong>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>HOURLY RATE</span>
                <strong style={{ color: '#38bdf8' }}>Rs. {profile.hourlyRate}</strong>
              </div>
            </div>

            {/* AI Verified Summary Section */}
            {aiSummary && (
              <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', borderLeft: '3px solid #a855f7' }}>
                <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 'bold', letterSpacing: '0.5px' }}>✨ AI VERIFIED SUMMARY</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#e2e8f0', lineHeight: '1.3' }}>{aiSummary}</p>
              </div>
            )}

            {/* AI Synced Skills Badges */}
            {aiSkills.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>VERIFIED TRADE SKILLS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {aiSkills.map((s, idx) => (
                    <span key={idx} style={{ background: '#334155', color: '#f8fafc', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', border: '1px solid #475569' }}>
                      {s.name} <strong style={{ color: '#34d399', fontSize: '10px' }}>({s.proficiency})</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              <p style={{ margin: '2px 0' }}><strong>Category:</strong> {profile.category}</p>
              <p style={{ margin: '2px 0' }}><strong>Location:</strong> {profile.city}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Occupation / Trade</label>
                  <input type="text" value={profile.trade} onChange={(e) => setProfile({...profile, trade: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Category</label>
                  <select value={profile.category} onChange={(e) => setProfile({...profile, category: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Home Maintenance">Home Maintenance</option>
                    <option value="Construction">Construction</option>
                    <option value="Electrical Work">Electrical Work</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Years of Experience</label>
                  <input type="number" value={profile.experienceYears} onChange={(e) => setProfile({...profile, experienceYears: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Hourly Rate (PKR)</label>
                  <input type="number" value={profile.hourlyRate} onChange={(e) => setProfile({...profile, hourlyRate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Profile
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Profiler Modal */}
      {showProfilerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', position: 'relative', padding: '24px' }}>
            <button 
              onClick={() => setShowProfilerModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: '#64748b' }}
            >
              ✕
            </button>
            <SkillProfiler 
              initialCategory={profile.trade} 
              onSyncProfile={handleProfileSynced} 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerProfile;
