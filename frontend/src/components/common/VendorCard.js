import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiStar, FiCheckCircle, FiTruck } from 'react-icons/fi';
import './VendorCard.css';

export default function VendorCard({ vendor }) {
  const stars = Math.round(vendor.rating || 0);
  return (
    <div className="vendor-card card">
      {/* Header */}
      <div className="vc-header">
        <div className="vc-logo">
          {vendor.logo
            ? <img src={vendor.logo} alt={vendor.businessName} />
            : <span className="vc-icon">{vendor.category?.icon || '🏭'}</span>
          }
        </div>
        <div className="vc-badges">
          {vendor.isFeatured  && <span className="badge badge-warning">⭐ Featured</span>}
          {vendor.isVerified  && <span className="badge badge-verified"><FiCheckCircle size={11}/> Verified</span>}
        </div>
      </div>

      {/* Info */}
      <div className="vc-body">
        <h3 className="vc-name">{vendor.businessName}</h3>
        <span className="vc-type">{vendor.businessType}</span>

        <div className="vc-meta">
          <span><FiMapPin size={13}/> {vendor.district}</span>
          {vendor.deliveryAvailable && <span><FiTruck size={13}/> Delivery Available</span>}
        </div>

        {vendor.ownerName && (
          <div className="vc-owner">
            <span>👤 {vendor.ownerName}</span>
            <a href={`tel:${vendor.ownerPhone}`} className="vc-phone">
              <FiPhone size={13}/> {vendor.ownerPhone}
            </a>
          </div>
        )}

        {/* Rating */}
        <div className="vc-rating">
          <span className="stars">
            {[1,2,3,4,5].map(i => <span key={i}>{i <= stars ? '★' : '☆'}</span>)}
          </span>
          <span className="vc-rv">
            {vendor.rating ? vendor.rating : 'New'} ({vendor.reviewCount || 0} reviews)
          </span>
        </div>

        {vendor.description && (
          <p className="vc-desc">{vendor.description.slice(0, 100)}...</p>
        )}
      </div>

      {/* Footer */}
      <div className="vc-footer">
        <div className="vc-stats">
          <span>📦 {vendor.totalBookings || 0} bookings</span>
          {vendor.establishedYear && <span>📅 Est. {vendor.establishedYear}</span>}
        </div>
        <Link to={`/vendors/${vendor._id}`} className="btn btn-primary btn-sm">
          View Details →
        </Link>
      </div>
    </div>
  );
}
