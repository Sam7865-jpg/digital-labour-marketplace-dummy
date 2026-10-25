import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SkillProfiler from '../components/SkillProfiler';

const WorkerProfile = () => {
  const getInitialProfile = () => {
    const saved = localStorage.getItem('workerProfileData');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return {
      name: 'Alialllll',
      trade: 'Plumber',
      category: 'Home Maintenance',
      experienceYears: 5,
      hourlyRate: 1200,
      city: 'Islamabad',
      sector: 'H-8/4',
      summary: '',
      skills: []
    };
  };

  const [profile, setProfile] = useState(getInitialProfile);
  const [isProfileCreated, setIsProfileCreated] = useState(true);
  const [showProfilerModal, setShowProfilerModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileSynced = (aiData) => {
    const summaryText = aiData.professionalSummary || `${profile.trade} specialist with verified practical field experience.`;
    
    let extractedList = [];
    if (aiData.categorizedSkills && aiData.categorizedSkills.length > 0) {
      aiData.categorizedSkills.forEach(group => {
        if (group.skills) {
          group.skills.forEach(s => {
            extractedList.push({ name: s.name, proficiency: s.proficiency || 'Intermediate' });
          });
        }
      });
    } else if (aiData.extractedSkills && aiData.extractedSkills.length > 0) {
      extractedList = aiData.extractedSkills.map(s => ({
        name: s.name,
        proficiency: s.proficiency || 'Intermediate'
      }));
    }

    const updatedProfile = {
      ...profile,
      summary: summaryText,
      skills: extractedList
    };

    setProfile(updatedProfile);
    localStorage.setItem('workerProfileData', JSON.stringify(updatedProfile));
    
    setMessage('✨ AI Verified Skills & Summary saved to worker profile!');
    setShowProfilerModal(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('workerProfileData', JSON.stringify(profile));
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

      <div style={{ maxWidth: '850px', margin: '30px auto', padding: '0 20px' }}>
        
        {isProfileCreated && (
          <div style={{ background: 'linear-gradient(90deg, #ede9fe 0%, #f3e8ff 100%)', border: '1px solid #c084fc', padding: '14px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <strong style={{ color: '#5b21b6', fontSize: '15px' }}>🚀 AI Profiler Ready:</strong>
              <span style={{ color: '#4c1d95', fontSize: '14px', marginLeft: '8px' }}>Extract structured trade skills using Gemini AI.</span>
            </div>
            <button 
              onClick={() => setShowProfilerModal(true)}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ✨ Open AI Skill Profiler
            </button>
          </div>
        )}

        <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '4px' }}>Worker Profile</h2>
        <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Manage your verified trade qualifications and hourly wage details.</p>

        {message && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
            {message}
          </div>
        )}

        {/* Full-Width Clean Profile Form */}
        <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Occupation / Trade</label>
                <input type="text" value={profile.trade} onChange={(e) => setProfile({...profile, trade: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Category</label>
                <select value={profile.category} onChange={(e) => setProfile({...profile, category: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="Home Maintenance">Home Maintenance</option>
                  <option value="Construction">Construction</option>
                  <option value="Electrical Work">Electrical Work</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Years of Experience</label>
                <input type="number" value={profile.experienceYears} onChange={(e) => setProfile({...profile, experienceYears: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Hourly Rate (PKR)</label>
                <input type="number" value={profile.hourlyRate} onChange={(e) => setProfile({...profile, hourlyRate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>City</label>
                <input type="text" value={profile.city} onChange={(e) => setProfile({...profile, city: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>Area / Sector</label>
              <input type="text" value={profile.sector} onChange={(e) => setProfile({...profile, sector: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>

            {/* AI Summary Section */}
            {profile.summary && (
              <div style={{ background: '#f3e8ff', borderLeft: '4px solid #7c3aed', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6d28d9', display: 'block', textTransform: 'uppercase' }}>
                  AI Professional Summary
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4c1d95', lineHeight: '1.4' }}>
                  {profile.summary}
                </p>
              </div>
            )}

            {/* AI Extracted Skills Chips */}
            {profile.skills && profile.skills.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '13px', color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Verified Trade Skills:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.skills.map((s, idx) => (
                    <span key={idx} style={{ background: '#ede9fe', color: '#5b21b6', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #c084fc' }}>
                      {s.name} <span style={{ color: '#059669', marginLeft: '4px' }}>({s.proficiency})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Profile
            </button>
          </form>
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
