import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product, onBook }) {
  const { isLoggedIn } = useAuth();

  return (
    <div className="product-card card">
      <div className="pc-top">
        <div className="pc-info">
          <h4 className="pc-name">{product.name}</h4>
          {product.brand  && <span className="pc-brand">🏷️ {product.brand}</span>}
          {product.grade  && <span className="pc-grade">{product.grade}</span>}
          {product.productCode && <span className="pc-code">#{product.productCode}</span>}
        </div>
        <div className="pc-stock">
          {product.inStock
            ? <span className="badge badge-success">✅ In Stock</span>
            : <span className="badge badge-danger">❌ Out of Stock</span>
          }
        </div>
      </div>

      {product.description && (
        <p className="pc-desc">{product.description}</p>
      )}

      {/* Specs */}
      {product.specifications?.length > 0 && (
        <div className="pc-specs">
          {product.specifications.slice(0, 4).map((s, i) => (
            <div key={i} className="spec-item">
              <span className="spec-key">{s.key}</span>
              <span className="spec-val">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Price Box */}
      <div className="pc-price-box">
        <div className="pc-price-main">
          <span className="pc-price">₹{product.price?.toLocaleString('en-IN')}</span>
          <span className="pc-unit">{product.priceUnit}</span>
        </div>
        {product.gstPercent > 0 && (
          <span className="pc-gst">+ {product.gstPercent}% GST</span>
        )}
        {product.priceNegotiable && (
          <span className="badge badge-info" style={{fontSize:'11px'}}>💬 Negotiable</span>
        )}
      </div>

      {product.minOrderQty && (
        <div className="pc-minorder">
          📦 Min. Order: {product.minOrderUnit || `${product.minOrderQty} units`}
        </div>
      )}
      {product.stockQty && (
        <div className="pc-avail">📊 {product.stockQty}</div>
      )}

      {/* Book Button */}
      <button
        className={`btn btn-primary btn-full pc-book ${!product.inStock ? 'disabled' : ''}`}
        onClick={() => product.inStock && isLoggedIn && onBook(product)}
        disabled={!product.inStock}
      >
        {!isLoggedIn ? '🔐 Login to Book' : !product.inStock ? '❌ Out of Stock' : '📋 Book Now'}
      </button>
    </div>
  );
}
