import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenProfiler, isProfileCreated = true }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', textDecoration: 'none' }}>
          Digital Labour Marketplace
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {token ? (
          <>
            <Link to="/worker-profile" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold', fontSize: '14px' }}>
              Digital ID & Profile
            </Link>

            {/* AI Skill Profiler Button (Profile create hone ke baad dikhega) */}
            {isProfileCreated && onOpenProfiler && (
              <button
                onClick={onOpenProfiler}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
                }}
              >
                <span>✨</span> AI Skill Profiler
              </button>
            )}

            <span style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px' }}>
              {user.name || 'User'} ({user.role || 'worker'})
            </span>

            <button
              onClick={handleLogout}
              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Sign In</Link>
            <Link to="/register" style={{ background: '#2563eb', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Create Account</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
