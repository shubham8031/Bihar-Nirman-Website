import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const DISTRICTS = [
  'Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga',
  'Vaishali','Rohtas','Begusarai','Munger','Nalanda',
  'Sitamarhi','Samastipur','Bhojpur (Ara)','Aurangabad',
  'Buxar','Kaimur (Bhabua)','Saran (Chhapra)','Siwan',
  'Gopalganj','East Champaran (Motihari)','West Champaran (Bettiah)',
  'Sheohar','Madhubani','Supaul','Araria',
  'Kishanganj','Purnia','Katihar','Madhepura',
  'Saharsa','Khagaria','Jamui','Banka',
  'Lakhisarai','Sheikhpura','Jehanabad','Arwal'
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    role: 'user', district: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const upd = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data);
      toast.success(`Welcome to Bihar Nirman Hub, ${res.data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box auth-box-wide card">
        <div className="auth-logo">🏗️</div>
        <h2>Create Account</h2>
        <p className="auth-sub">Join Bihar Nirman Hub — Bihar ka #1 Construction Marketplace</p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Role Toggle */}
        <div className="role-toggle">
          <button type="button"
            className={`role-btn ${form.role==='user'?'active':''}`}
            onClick={() => upd('role','user')}>
            👤 I'm a Buyer
          </button>
          <button type="button"
            className={`role-btn ${form.role==='vendor'?'active':''}`}
            onClick={() => upd('role','vendor')}>
            🏭 I'm a Vendor/Supplier
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="Ram Kumar Singh" required
                value={form.name} onChange={e => upd('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" placeholder="9801234567" required
                value={form.phone} onChange={e => upd('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => upd('email', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Min 6 characters" required minLength={6}
                value={form.password} onChange={e => upd('password', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Your District</label>
              <select value={form.district} onChange={e => upd('district', e.target.value)}>
                <option value="">Select District</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Your address or business address"
              value={form.address} onChange={e => upd('address', e.target.value)} />
          </div>

          {form.role === 'vendor' && (
            <div className="alert alert-info" style={{fontSize:13}}>
              📢 After registration, you can add your business listing and products from your profile.
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : '✅ Create Account'}
          </button>
        </form>

        <div className="auth-links" style={{marginTop:16}}>
          <span>Already have an account?</span>
          <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
        </div>
      </div>
    </div>
  );
}
