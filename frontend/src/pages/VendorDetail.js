import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVendor, getProducts, getReviews, createBooking, createReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';
import './VendorDetail.css';

const DISTRICTS = [
  'Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Vaishali',
  'Rohtas','Begusarai','Nalanda','Sitamarhi','Samastipur','Munger',
  'Ara (Bhojpur)','Kaimur','Buxar','Gopalganj','West Champaran','East Champaran',
];

export default function VendorDetail() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [vendor,   setVendor]   = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  // Booking modal state
  const [bookModal,  setBookModal]  = useState(false);
  const [selProduct, setSelProduct] = useState(null);
  const [booking, setBooking] = useState({
    quantity: 1, deliveryAddress: user?.address || '',
    deliveryDistrict: user?.district || '', deliveryDate: '',
    specialNote: '', paymentMode: 'Cash',
  });
  const [bookLoading, setBookLoading] = useState(false);

  // Review state
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getVendor(id),
      getProducts({ vendor: id }),
      getReviews(id),
    ]).then(([vRes, pRes, rRes]) => {
      setVendor(vRes.data);
      setProducts(pRes.data || []);
      setReviews(rRes.data || []);
    }).catch(() => toast.error('Failed to load vendor'))
      .finally(() => setLoading(false));
  }, [id]);

  const openBookModal = (product) => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setSelProduct(product);
    setBookModal(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!booking.deliveryAddress || !booking.deliveryDistrict) {
      toast.error('Please fill delivery address and district');
      return;
    }
    setBookLoading(true);
    try {
      await createBooking({
        vendorId: vendor._id,
        productId: selProduct._id,
        ...booking,
        quantityUnit: selProduct.priceUnit,
        totalAmount: selProduct.price * booking.quantity,
      });
      toast.success('✅ Booking placed! Vendor will contact you soon.');
      setBookModal(false);
      setBooking({ quantity: 1, deliveryAddress: '', deliveryDistrict: '', deliveryDate: '', specialNote: '', paymentMode: 'Cash' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setBookLoading(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate('/login'); return; }
    setReviewLoading(true);
    try {
      await createReview({ vendor: id, ...reviewForm });
      toast.success('Review submitted! It will appear after approval.');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally { setReviewLoading(false); }
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;
  if (!vendor) return <div className="page"><div className="container"><div className="empty-state"><div className="icon">❌</div><h3>Vendor not found</h3><Link to="/vendors" className="btn btn-primary">← Back to Vendors</Link></div></div></div>;

  const stars = Math.round(vendor.rating || 0);

  return (
    <div className="page vd-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/vendors">Vendors</Link> / <span>{vendor.businessName}</span>
        </div>

        {/* ── Vendor Header ─────────────────────────────── */}
        <div className="vd-header card">
          <div className="vd-logo-wrap">
            <div className="vd-logo">{vendor.category?.icon || '🏭'}</div>
          </div>
          <div className="vd-header-info">
            <div className="vd-title-row">
              <h1>{vendor.businessName}</h1>
              <div className="vd-badges">
                {vendor.isVerified && <span className="badge badge-verified">✅ Verified</span>}
                {vendor.isFeatured && <span className="badge badge-warning">⭐ Featured</span>}
              </div>
            </div>
            <span className="vd-type">{vendor.businessType}</span>

            <div className="vd-rating-row">
              <span className="stars">
                {[1,2,3,4,5].map(i=><span key={i}>{i<=stars?'★':'☆'}</span>)}
              </span>
              <span>{vendor.rating || 'New'} ({vendor.reviewCount || 0} reviews)</span>
              <span>·</span>
              <span>📦 {vendor.totalBookings || 0} bookings</span>
            </div>

            <div className="vd-location">
              📍 {vendor.address}, {vendor.village && `${vendor.village}, `}{vendor.district} — {vendor.pincode}
              {vendor.googleMapLink && (
                <a href={vendor.googleMapLink} target="_blank" rel="noreferrer" className="map-link"> 🗺️ View on Map</a>
              )}
            </div>

            {vendor.description && <p className="vd-desc">{vendor.description}</p>}

            <div className="vd-quick-info">
              {vendor.deliveryAvailable && <span>🚚 Delivery up to {vendor.deliveryRadius}</span>}
              {vendor.minimumOrder    && <span>📦 Min: {vendor.minimumOrder}</span>}
              {vendor.workingHours    && <span>🕐 {vendor.workingHours}</span>}
              {vendor.workingDays     && <span>📅 {vendor.workingDays}</span>}
              {vendor.establishedYear && <span>🏭 Est. {vendor.establishedYear}</span>}
            </div>

            {vendor.paymentModes?.length > 0 && (
              <div className="vd-payments">
                💳 Payment: {vendor.paymentModes.map(p=>(
                  <span key={p} className="badge badge-info" style={{marginRight:4}}>{p}</span>
                ))}
              </div>
            )}
          </div>

          {/* Contact Box */}
          <div className="vd-contact-box">
            <h4>📞 Contact</h4>
            <div className="contact-row">
              <span>👤 Owner: <strong>{vendor.ownerName}</strong></span>
              <a href={`tel:${vendor.ownerPhone}`} className="btn btn-primary btn-sm">
                📞 {vendor.ownerPhone}
              </a>
            </div>
            {vendor.ownerWhatsapp && (
              <a href={`https://wa.me/91${vendor.ownerWhatsapp}`} target="_blank" rel="noreferrer"
                className="btn btn-success btn-sm btn-full" style={{marginTop:8}}>
                💬 WhatsApp
              </a>
            )}
            {vendor.managerName && (
              <div className="contact-row" style={{marginTop:10,paddingTop:10,borderTop:'1px solid #eee'}}>
                <span>👔 Manager: <strong>{vendor.managerName}</strong></span>
                {vendor.managerPhone && (
                  <a href={`tel:${vendor.managerPhone}`} className="btn btn-outline btn-sm">
                    📞 {vendor.managerPhone}
                  </a>
                )}
              </div>
            )}
            {vendor.managerEmail && (
              <a href={`mailto:${vendor.managerEmail}`} className="manager-email">
                ✉️ {vendor.managerEmail}
              </a>
            )}
            {vendor.gstNumber && (
              <div style={{fontSize:12,color:'#636e72',marginTop:8}}>
                GST: {vendor.gstNumber}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="vd-tabs">
          {['products','about','reviews'].map(tab=>(
            <button key={tab} className={`tab-btn ${activeTab===tab?'active':''}`}
              onClick={()=>setActiveTab(tab)}>
              {tab==='products'?`🧱 Products (${products.length})`
               :tab==='about'?'ℹ️ About'
               :`⭐ Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* ── Products Tab ──────────────────────────────── */}
        {activeTab==='products' && (
          <div>
            {products.length===0 ? (
              <div className="empty-state"><div className="icon">📦</div><h3>No products listed yet</h3></div>
            ) : (
              <div className="grid-3">
                {products.map(p=>(
                  <ProductCard key={p._id} product={p} onBook={openBookModal}/>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── About Tab ────────────────────────────────── */}
        {activeTab==='about' && (
          <div className="about-section card" style={{padding:28}}>
            <h3 style={{marginBottom:18}}>About {vendor.businessName}</h3>
            <div className="about-grid">
              <div className="about-item"><span className="about-key">Business Name</span><span>{vendor.businessName}</span></div>
              <div className="about-item"><span className="about-key">Type</span><span>{vendor.businessType}</span></div>
              <div className="about-item"><span className="about-key">Owner</span><span>{vendor.ownerName}</span></div>
              <div className="about-item"><span className="about-key">Owner Phone</span><a href={`tel:${vendor.ownerPhone}`}>{vendor.ownerPhone}</a></div>
              {vendor.managerName && <div className="about-item"><span className="about-key">Manager</span><span>{vendor.managerName}</span></div>}
              {vendor.managerPhone && <div className="about-item"><span className="about-key">Manager Phone</span><a href={`tel:${vendor.managerPhone}`}>{vendor.managerPhone}</a></div>}
              <div className="about-item"><span className="about-key">Address</span><span>{vendor.address}</span></div>
              {vendor.village && <div className="about-item"><span className="about-key">Village/Area</span><span>{vendor.village}</span></div>}
              {vendor.block   && <div className="about-item"><span className="about-key">Block</span><span>{vendor.block}</span></div>}
              <div className="about-item"><span className="about-key">District</span><span>{vendor.district}</span></div>
              {vendor.pincode && <div className="about-item"><span className="about-key">Pincode</span><span>{vendor.pincode}</span></div>}
              {vendor.establishedYear && <div className="about-item"><span className="about-key">Established</span><span>{vendor.establishedYear}</span></div>}
              {vendor.gstNumber && <div className="about-item"><span className="about-key">GST No.</span><span>{vendor.gstNumber}</span></div>}
              {vendor.minimumOrder && <div className="about-item"><span className="about-key">Minimum Order</span><span>{vendor.minimumOrder}</span></div>}
              {vendor.deliveryRadius && <div className="about-item"><span className="about-key">Delivery Radius</span><span>{vendor.deliveryRadius}</span></div>}
              <div className="about-item"><span className="about-key">Working Hours</span><span>{vendor.workingHours}</span></div>
              <div className="about-item"><span className="about-key">Working Days</span><span>{vendor.workingDays}</span></div>
              {vendor.paymentModes?.length>0 && <div className="about-item"><span className="about-key">Payment Modes</span><span>{vendor.paymentModes.join(', ')}</span></div>}
            </div>
          </div>
        )}

        {/* ── Reviews Tab ──────────────────────────────── */}
        {activeTab==='reviews' && (
          <div>
            {/* Write review */}
            <div className="review-form-wrap card" style={{padding:24,marginBottom:24}}>
              <h4 style={{marginBottom:14}}>✍️ Write a Review</h4>
              {isLoggedIn ? (
                <form onSubmit={handleReview}>
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="star-select">
                      {[1,2,3,4,5].map(s=>(
                        <span key={s} className={`star-opt ${reviewForm.rating>=s?'filled':''}`}
                          onClick={()=>setReviewForm(f=>({...f,rating:s}))}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Your Review</label>
                    <textarea rows={3} placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={e=>setReviewForm(f=>({...f,comment:e.target.value}))} required/>
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={reviewLoading}>
                    {reviewLoading?'Submitting...':'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="alert alert-info">
                  <Link to="/login">Login</Link> to write a review
                </div>
              )}
            </div>

            {/* Reviews list */}
            {reviews.length===0 ? (
              <div className="empty-state"><div className="icon">⭐</div><h3>No reviews yet</h3><p>Be the first to review!</p></div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {reviews.map(r=>(
                  <div key={r._id} className="review-card card" style={{padding:18}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                      <div>
                        <strong>{r.user?.name || 'User'}</strong>
                        <span className="stars" style={{marginLeft:10}}>
                          {[1,2,3,4,5].map(i=><span key={i}>{i<=r.rating?'★':'☆'}</span>)}
                        </span>
                      </div>
                      <span style={{fontSize:12,color:'#636e72'}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p style={{fontSize:14,color:'#2d3436'}}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Booking Modal ─────────────────────────────── */}
      {bookModal && selProduct && (
        <div className="modal-overlay" onClick={()=>setBookModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Book: {selProduct.name}</h3>
              <button className="modal-close" onClick={()=>setBookModal(false)}>✕</button>
            </div>

            <div className="modal-product-info">
              <span>💰 ₹{selProduct.price?.toLocaleString('en-IN')} {selProduct.priceUnit}</span>
              {selProduct.minOrderUnit && <span>📦 Min: {selProduct.minOrderUnit}</span>}
            </div>

            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" min={selProduct.minOrderQty||1} value={booking.quantity}
                  onChange={e=>setBooking(b=>({...b,quantity:Number(e.target.value)}))} required/>
                <small style={{fontSize:12,color:'#636e72'}}>Unit: {selProduct.priceUnit}</small>
              </div>

              <div className="modal-total">
                💰 Estimated Total: <strong>₹{(selProduct.price * booking.quantity).toLocaleString('en-IN')}</strong>
                {selProduct.gstPercent>0 && <small> + {selProduct.gstPercent}% GST</small>}
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea rows={2} placeholder="Full delivery address..."
                  value={booking.deliveryAddress}
                  onChange={e=>setBooking(b=>({...b,deliveryAddress:e.target.value}))} required/>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>District *</label>
                  <select value={booking.deliveryDistrict}
                    onChange={e=>setBooking(b=>({...b,deliveryDistrict:e.target.value}))} required>
                    <option value="">Select District</option>
                    {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Delivery Date</label>
                  <input type="date" value={booking.deliveryDate}
                    onChange={e=>setBooking(b=>({...b,deliveryDate:e.target.value}))}
                    min={new Date().toISOString().split('T')[0]}/>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Mode</label>
                <select value={booking.paymentMode}
                  onChange={e=>setBooking(b=>({...b,paymentMode:e.target.value}))}>
                  <option>Cash</option><option>UPI</option>
                  <option>Bank Transfer</option><option>Cheque</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Note (optional)</label>
                <textarea rows={2} placeholder="Any special requirements..."
                  value={booking.specialNote}
                  onChange={e=>setBooking(b=>({...b,specialNote:e.target.value}))}/>
              </div>

              <div className="modal-vendor-note">
                📞 Vendor will call on <strong>{vendor.ownerPhone}</strong> to confirm your booking.
              </div>

              <div style={{display:'flex',gap:10,marginTop:16}}>
                <button type="button" className="btn btn-outline" onClick={()=>setBookModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{flex:1}} disabled={bookLoading}>
                  {bookLoading?'Placing Booking...':'✅ Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
