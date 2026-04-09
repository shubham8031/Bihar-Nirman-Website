import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="f-logo">🏗️ Bihar Nirman Hub</div>
          <p>बिहार का सबसे बड़ा निर्माण सामग्री मार्केटप्लेस।<br/>
            Find verified suppliers of bricks, cement, sand, tiles, wood and more.</p>
          <p className="f-contact">📞 Support: <a href="tel:+918001234567">+91 8001234567</a></p>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/category/bricks">🧱 Bricks (ईंट)</Link>
          <Link to="/category/cement">🏗️ Cement (सीमेंट)</Link>
          <Link to="/category/balu">🪨 Sand / Balu</Link>
          <Link to="/category/chhar">⛏️ Chhar / Gitti</Link>
          <Link to="/category/wood">🪵 Wood (लकड़ी)</Link>
          <Link to="/category/tiles">🔲 Tiles & Marble</Link>
          <Link to="/category/iron">⚙️ Iron & Steel</Link>
          <Link to="/category/paint">🎨 Paint (रंग)</Link>
        </div>

        <div className="footer-col">
          <h4>Districts</h4>
          <Link to="/vendors?district=Patna">Patna</Link>
          <Link to="/vendors?district=Gaya">Gaya</Link>
          <Link to="/vendors?district=Muzaffarpur">Muzaffarpur</Link>
          <Link to="/vendors?district=Bhagalpur">Bhagalpur</Link>
          <Link to="/vendors?district=Darbhanga">Darbhanga</Link>
          <Link to="/vendors?district=Vaishali">Vaishali</Link>
          <Link to="/vendors?district=Rohtas">Rohtas</Link>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/vendors">All Vendors</Link>
          <Link to="/register">Register as Vendor</Link>
          <Link to="/login">Login</Link>
          <Link to="/bookings">My Bookings</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© 2024 Bihar Nirman Hub. All rights reserved.</span>
          <span>Made with ❤️ for Bihar</span>
        </div>
      </div>
    </footer>
  );
}
