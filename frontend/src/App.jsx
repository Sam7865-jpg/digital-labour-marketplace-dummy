import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import WorkerProfilePage from './pages/WorkerProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function NavigationBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          fontSize: '1.3rem', 
          fontWeight: '800', 
          color: '#0f172a',
          letterSpacing: '-0.5px'
        }}>
          Digital Labour Marketplace
        </span>
      </Link>

      {!token ? (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            to="/login"
            style={{ textDecoration: 'none', color: '#475569', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem' }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            style={{ textDecoration: 'none', background: '#2563eb', color: 'white', fontWeight: '600', padding: '9px 18px', borderRadius: '10px', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}
          >
            Create Account
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user.role === 'worker' && (
            <Link to="/worker-profile" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.92rem' }}>
              Digital ID & Profile
            </Link>
          )}
          {user.role === 'customer' && (
            <Link to="/customer-dashboard" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.92rem' }}>
              Job Postings
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '6px 14px', borderRadius: '24px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
              {user.name} <span style={{ color: '#94a3b8' }}>({user.role})</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{ padding: '7px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/worker-profile"
          element={
            <ProtectedRoute allowedRole="worker">
              <WorkerProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
              <div style={{ maxWidth: '800px', margin: '60px auto', padding: '40px', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Customer Portal</h2>
                <p style={{ color: '#64748b' }}>Post projects and review explainable worker matches.</p>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}