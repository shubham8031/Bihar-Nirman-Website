import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginAPI(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}! 👋`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box card">
        <div className="auth-logo">🏗️</div>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Login to Bihar Nirman Hub</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-links">
          <span>Don't have an account?</span>
          <Link to="/register" className="btn btn-outline btn-sm">Register Now</Link>
        </div>

        {/* Demo credentials */}
        <div className="demo-creds">
          <strong>Demo Admin:</strong> admin@bihar.com / admin123<br/>
          <strong>Demo User:</strong> user@bihar.com / user123
        </div>
      </div>
    </div>
  );
}
