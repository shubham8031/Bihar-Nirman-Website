import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../utils/api';
import toast from 'react-hot-toast';
import './BookingsPage.css';

const STATUS_COLORS = {
  Pending:    'badge-warning',
  Confirmed:  'badge-info',
  Processing: 'badge-info',
  Dispatched: 'badge-primary',
  Delivered:  'badge-success',
  Cancelled:  'badge-danger',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    getMyBookings()
      .then(r => setBookings(r.data || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(b => b.map(bk => bk._id === id ? {...bk, status: 'Cancelled'} : bk));
      toast.success('Booking cancelled');
    } catch { toast.error('Cancel failed'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">📦 My Bookings</h2>
        <p className="section-sub">Track all your material booking requests</p>

        {/* Filter tabs */}
        <div className="booking-tabs">
          {['all','Pending','Confirmed','Dispatched','Delivered','Cancelled'].map(s => (
            <button key={s}
              className={`booking-tab ${filter===s?'active':''}`}
              onClick={() => setFilter(s)}>
              {s === 'all' ? `All (${bookings.length})` : s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"/></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No bookings found</h3>
            <p>Browse vendors and book construction materials</p>
            <Link to="/vendors" className="btn btn-primary" style={{marginTop:14}}>Browse Vendors</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(b => (
              <div key={b._id} className="booking-card card">
                <div className="booking-header">
                  <div>
                    <h4>{b.product?.name || 'Product'}</h4>
                    <p className="booking-vendor">
                      🏭 {b.vendor?.businessName} · 📍 {b.vendor?.district}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </div>

                <div className="booking-details">
                  <div className="bd-item">
                    <span className="bd-key">Quantity</span>
                    <span>{b.quantity} {b.quantityUnit}</span>
                  </div>
                  <div className="bd-item">
                    <span className="bd-key">Total Amount</span>
                    <span className="bd-amount">₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bd-item">
                    <span className="bd-key">Payment Mode</span>
                    <span>{b.paymentMode}</span>
                  </div>
                  <div className="bd-item">
                    <span className="bd-key">Booked On</span>
                    <span>{new Date(b.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
                  </div>
                  {b.deliveryDate && (
                    <div className="bd-item">
                      <span className="bd-key">Delivery Date</span>
                      <span>{new Date(b.deliveryDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                  <div className="bd-item">
                    <span className="bd-key">Delivery Address</span>
                    <span>{b.deliveryAddress}, {b.deliveryDistrict}</span>
                  </div>
                </div>

                {/* Status Timeline */}
                {b.statusHistory?.length > 0 && (
                  <div className="status-timeline">
                    <div className="st-label">Status History:</div>
                    {b.statusHistory.map((h, i) => (
                      <div key={i} className="st-item">
                        <span className="st-dot"/>
                        <span className="st-status">{h.status}</span>
                        <span className="st-note">{h.note}</span>
                        <span className="st-time">{new Date(h.updatedAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="booking-footer">
                  <div className="booking-contact">
                    <span>📞 Vendor: </span>
                    <a href={`tel:${b.vendorPhone}`} className="btn btn-outline btn-sm">
                      {b.vendorPhone || b.vendor?.ownerPhone}
                    </a>
                  </div>
                  {b.specialNote && (
                    <p className="booking-note">📝 {b.specialNote}</p>
                  )}
                  {b.status === 'Pending' && (
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
