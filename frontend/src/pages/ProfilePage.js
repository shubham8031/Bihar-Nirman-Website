import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import toast from 'react-hot-toast';
import './ProfilePage.css';

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

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    address: user?.address || '', district: user?.district || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      login({ ...user, ...res.data });
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          {/* Left: User Card */}
          <div className="profile-sidebar">
            <div className="profile-card card">
              <div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
              <h3>{user?.name}</h3>
              <span className={`badge ${user?.role==='admin'?'badge-danger':user?.role==='vendor'?'badge-warning':'badge-info'}`}>
                {user?.role?.toUpperCase()}
              </span>
              <div className="profile-meta">
                <div>📧 {user?.email}</div>
                <div>📞 {user?.phone}</div>
                {user?.district && <div>📍 {user?.district}</div>}
              </div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="profile-main">
            <div className="card" style={{padding:28}}>
              <h3 style={{marginBottom:20}}>✏️ Edit Profile</h3>
              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label>District</label>
                  <select value={form.district} onChange={e=>setForm(f=>({...f,district:e.target.value}))}>
                    <option value="">Select District</option>
                    {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading?'Saving...':'💾 Save Changes'}
                </button>
              </form>
            </div>

            {/* Account Info */}
            <div className="card" style={{padding:24,marginTop:20}}>
              <h4 style={{marginBottom:14}}>🔐 Account Info</h4>
              <div style={{fontSize:14,color:'#636e72',lineHeight:2}}>
                <div><strong>Email:</strong> {user?.email} (cannot be changed)</div>
                <div><strong>Role:</strong> {user?.role}</div>
                <div><strong>Member since:</strong> {new Date().getFullYear()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
