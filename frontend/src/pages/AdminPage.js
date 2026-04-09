import { useState, useEffect } from 'react';
import { getAdminStats, getAdminBookings, getAdminUsers, getVendors, verifyVendor, featureVendor } from '../utils/api';
import toast from 'react-hot-toast';
import './AdminPage.css';

export default function AdminPage() {
  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [vendors,  setVendors]  = useState([]);
  const [tab,      setTab]      = useState('dashboard');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminBookings(), getAdminUsers(), getVendors({ limit: 50 })])
      .then(([s, b, u, v]) => {
        setStats(s.data);
        setBookings(b.data || []);
        setUsers(u.data || []);
        setVendors(v.data.vendors || []);
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyVendor(id);
      setVendors(vs => vs.map(v => v._id === id ? {...v, isVerified: true} : v));
      toast.success('Vendor verified ✅');
    } catch { toast.error('Failed'); }
  };

  const handleFeature = async (id) => {
    try {
      await featureVendor(id);
      setVendors(vs => vs.map(v => v._id === id ? {...v, isFeatured: !v.isFeatured} : v));
      toast.success('Updated!');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">🛡️ Admin Panel</h2>
        <p className="section-sub">Bihar Nirman Hub — Admin Dashboard</p>

        {/* Admin Tabs */}
        <div className="admin-tabs">
          {[
            {key:'dashboard', label:'📊 Dashboard'},
            {key:'vendors',   label:`🏭 Vendors (${vendors.length})`},
            {key:'bookings',  label:`📦 Bookings (${bookings.length})`},
            {key:'users',     label:`👤 Users (${users.length})`},
          ].map(t => (
            <button key={t.key} className={`admin-tab ${tab===t.key?'active':''}`}
              onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {/* ── Dashboard Stats ── */}
        {tab === 'dashboard' && stats && (
          <div>
            <div className="stats-grid">
              {[
                {icon:'👤', label:'Total Users',    val: stats.users},
                {icon:'🏭', label:'Active Vendors', val: stats.vendors},
                {icon:'📦', label:'Total Bookings', val: stats.bookings},
                {icon:'⭐', label:'Pending Reviews',val: stats.pendingReviews},
              ].map(s => (
                <div key={s.label} className="stat-card card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-info card" style={{padding:24,marginTop:20}}>
              <h4 style={{marginBottom:12}}>⚡ Quick Actions</h4>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <button className="btn btn-primary" onClick={() => setTab('vendors')}>Manage Vendors</button>
                <button className="btn btn-secondary" onClick={() => setTab('bookings')}>View Bookings</button>
                <button className="btn btn-outline" onClick={() => setTab('users')}>View Users</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Vendors Tab ── */}
        {tab === 'vendors' && (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Business</th><th>Type</th><th>District</th>
                  <th>Owner</th><th>Phone</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v._id}>
                    <td><strong>{v.businessName}</strong></td>
                    <td><span style={{fontSize:12}}>{v.businessType}</span></td>
                    <td>{v.district}</td>
                    <td>{v.ownerName}</td>
                    <td><a href={`tel:${v.ownerPhone}`}>{v.ownerPhone}</a></td>
                    <td>
                      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                        {v.isVerified  && <span className="badge badge-success" style={{fontSize:11}}>✅ Verified</span>}
                        {v.isFeatured  && <span className="badge badge-warning" style={{fontSize:11}}>⭐ Featured</span>}
                        {!v.isVerified && <span className="badge badge-danger"  style={{fontSize:11}}>Unverified</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        {!v.isVerified && (
                          <button className="btn btn-success btn-sm" onClick={() => handleVerify(v._id)}>Verify</button>
                        )}
                        <button className="btn btn-outline btn-sm" onClick={() => handleFeature(v._id)}>
                          {v.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Bookings Tab ── */}
        {tab === 'bookings' && (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr><th>Customer</th><th>Vendor</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.user?.name}<br/><small>{b.user?.phone}</small></td>
                    <td>{b.vendor?.businessName}</td>
                    <td>{b.product?.name}</td>
                    <td>₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-info" style={{fontSize:11}}>{b.status}</span></td>
                    <td style={{fontSize:12}}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>District</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td><span className={`badge ${u.role==='admin'?'badge-danger':u.role==='vendor'?'badge-warning':'badge-info'}`} style={{fontSize:11}}>{u.role}</span></td>
                    <td>{u.district || '—'}</td>
                    <td style={{fontSize:12}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
