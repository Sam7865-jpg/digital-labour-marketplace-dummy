import { useState, useEffect } from 'react';
import API from '../api';
import SkillProfiler from '../components/SkillProfiler';

export default function WorkerProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [profile, setProfile] = useState({
    occupation: '',
    category: 'Home Maintenance',
    experienceYears: '',
    hourlyRate: '',
    city: 'Islamabad',
    address: '',
    bio: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfilerModal, setShowProfilerModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let res;
        try {
          res = await API.get('/workers/profile');
        } catch {
          res = await API.get('/worker/profile');
        }
        if (res?.data) setProfile(res.data);
      } catch (err) {
        console.log('No profile found yet');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let res;
      try {
        res = await API.post('/workers/profile', profile);
      } catch {
        res = await API.post('/worker/profile', profile);
      }
      setMessage(res?.data?.message || 'Profile successfully updated!');
      setShowProfilerModal(true); // Popup Modal Auto-launch!
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-dashboard" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>Worker Digital Identity</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Manage your verified trade qualifications and hourly wage details.
        </p>
      </div>

      {message && <div style={{ background: '#ecfdf5', border: '1px solid #34d399', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{message}</div>}

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        {/* Left: Smart ID Preview */}
        <div className="digital-id-card" style={{ background: '#0f172a', color: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
          <div className="card-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px' }}>
              LABOUR IDENTITY CARD
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '700' }}>
              ● ACTIVE
            </span>
          </div>

          <div className="id-user-info" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div className="id-avatar" style={{ width: '50px', height: '50px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {user.name ? user.name[0].toUpperCase() : 'W'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>{user.name || 'Worker'}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{profile.occupation || 'Trade Not Added'}</p>
            </div>
          </div>

          <div className="stat-pills-row" style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>EXPERIENCE</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{profile.experienceYears || '0'} Years</span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>HOURLY RATE</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8' }}>
                Rs. {profile.hourlyRate || '0'}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <div><strong>Category:</strong> {profile.category}</div>
            <div><strong>Location:</strong> {profile.city || 'Islamabad'}</div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="form-panel" style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Occupation / Trade</label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="e.g. Electrician"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                  value={profile.occupation}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Category</label>
                <select name="category" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }} value={profile.category} onChange={handleChange}>
                  <option value="Home Maintenance">Home Maintenance</option>
                  <option value="Construction & Masonry">Construction & Masonry</option>
                  <option value="Carpentry & Woodwork">Carpentry & Woodwork</option>
                  <option value="Painting & Renovation">Painting & Renovation</option>
                  <option value="Cleaning & Sanitation">Cleaning & Sanitation</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  placeholder="e.g. 4"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                  value={profile.experienceYears}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Hourly Rate (PKR)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  placeholder="e.g. 1200"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                  value={profile.hourlyRate}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>City</label>
                <input
                  type="text"
                  name="city"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                  value={profile.city}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Area / Sector</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Sector I-8"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                  value={profile.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' }}>Short Bio</label>
              <textarea
                name="bio"
                rows="3"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '600', boxSizing: 'border-box' }}
                placeholder="Describe your trade background..."
                value={profile.bio}
                onChange={handleChange}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }} disabled={loading}>
              {loading ? 'Saving...' : 'Save & Launch AI Skill Profiler 🚀'}
            </button>
          </form>
        </div>
      </div>

      {/* Module 2 AI Skill Profiler Popup Modal */}
      {showProfilerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '700px', borderRadius: '16px', padding: '25px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowProfilerModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}>
              ✕
            </button>
            <SkillProfiler />
          </div>
        </div>
      )}
    </div>
  );
}