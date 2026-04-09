import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVendors, getCategories } from '../utils/api';
import VendorCard from '../components/common/VendorCard';
import shubhamPic from '../shubham.jpeg';
import './HomePage.css';

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

export default function HomePage() {
  const [featured, setFeatured]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [district, setDistrict]     = useState('');
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getVendors({ featured: true, limit: 6 }),
      getCategories(),
    ]).then(([vRes, cRes]) => {
      setFeatured(vRes.data.vendors || []);
      setCategories(cRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search)   params.set('search', search);
    if (district) params.set('district', district);
    navigate(`/vendors?${params.toString()}`);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">🏗️ Bihar's #1 Construction Marketplace</div>
          <h1>
            घर बनाओ आसानी से<br />
            <span>Find Best Construction Material Suppliers in Bihar</span>
          </h1>
          <p>
            Verified suppliers of Bricks, Cement, Sand, Gitti, Wood, Tiles & more —
            directly from factories across all 38 districts of Bihar.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search vendors, bricks, cement, tiles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={district} onChange={e => setDistrict(e.target.value)}>
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">🔍 Search</button>
          </form>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Verified Vendors</span></div>
            <div className="stat"><strong>38</strong><span>Districts Covered</span></div>
            <div className="stat"><strong>8+</strong><span>Material Types</span></div>
            <div className="stat"><strong>10,000+</strong><span>Happy Customers</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">सामग्री खोजें — Browse by Category</h2>
          <p className="section-sub">Click any category to see all suppliers</p>
          <div className="cat-grid">
            {categories.map(cat => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="cat-card">
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
            {categories.length === 0 && [
              {slug:'bricks',icon:'🧱',name:'Bricks (ईंट)'},
              {slug:'cement',icon:'🏗️',name:'Cement (सीमेंट)'},
              {slug:'balu',icon:'🪨',name:'Sand / Balu'},
              {slug:'chhar',icon:'⛏️',name:'Chhar / Gitti'},
              {slug:'wood',icon:'🪵',name:'Wood (लकड़ी)'},
              {slug:'tiles',icon:'🔲',name:'Tiles & Marble'},
              {slug:'iron',icon:'⚙️',name:'Iron & Steel'},
              {slug:'paint',icon:'🎨',name:'Paint (रंग)'},
            ].map(c => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="cat-card">
                <span className="cat-icon">{c.icon}</span>
                <span className="cat-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <h2 className="section-title">कैसे काम करता है?</h2>
          <p className="section-sub">Just 3 simple steps to get your materials</p>
          <div className="how-grid">
            {[
              { step:'1', icon:'🔍', title:'Search', desc:'Search by category or district to find verified suppliers near you.' },
              { step:'2', icon:'📋', title:'Book',   desc:'Select your material, quantity and place a booking request instantly.' },
              { step:'3', icon:'🚚', title:'Receive', desc:'Supplier confirms and delivers material to your construction site.' },
            ].map(h => (
              <div key={h.step} className="how-card">
                <div className="how-num">{h.step}</div>
                <div className="how-icon">{h.icon}</div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">⭐ Featured Suppliers</h2>
              <p className="section-sub">Top rated and verified construction material suppliers</p>
            </div>
            <Link to="/vendors" className="btn btn-outline">View All →</Link>
          </div>
          {loading ? (
            <div className="loader"><div className="spinner"/></div>
          ) : (
            <div className="grid-3">
              {featured.map(v => <VendorCard key={v._id} vendor={v} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section district-section">
        <div className="container">
          <h2 className="section-title">📍 Browse by District</h2>
          <p className="section-sub">Find suppliers in your district</p>
          <div className="district-grid">
            {DISTRICTS.map(d => (
              <Link key={d} to={`/vendors?district=${d}`} className="district-chip">
                📍 {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>क्या आप एक Supplier हैं?</h2>
            <p>Register your factory or shop and reach thousands of customers across Bihar for FREE.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            🏭 Register as Vendor
          </Link>
        </div>
      </section>

      {/* ── Founder Section ── */}
      <section className="founder-section">
        <div className="container">
          <h2 className="section-title">👨‍💻 Meet the Founder</h2>
          <p className="section-sub">The mind behind Bihar Nirman Hub</p>
          <div className="founder-card">
            <div className="founder-img-wrap">
              <img src={shubhamPic} alt="Shubham Singh" className="founder-img" />
              <div className="founder-badge-tag">🚀 Founder & Developer</div>
            </div>
            <div className="founder-info">
              <h3 className="founder-name">Shubham Singh</h3>
              <p className="founder-role">
                <span className="role-chip">👨‍🎓 B.Tech CSE — 3rd Year</span>
                <span className="role-chip">💼 Entrepreneur</span>
                <span className="role-chip">💻 Full Stack Developer</span>
              </p>
              <p className="founder-city">📍 Patna, Bihar</p>
              <p className="founder-bio">
                Shubham Singh is a passionate B.Tech Computer Science student and young
                entrepreneur from Patna, Bihar. He built <strong>Bihar Nirman Hub</strong> with
                a vision to digitize and empower Bihar's construction industry —
                connecting verified local suppliers directly with customers across all 38 districts.
                With a deep love for technology and his home state, Shubham is on a mission to make
                घर बनाना आसान for every family in Bihar. 🏗️❤️
              </p>
              <div className="founder-socials">
                <a href="https://www.linkedin.com/in/shubham-singh" target="_blank" rel="noreferrer" className="social-btn linkedin">
                  <span>in</span> LinkedIn
                </a>
                <a href="https://www.instagram.com/shubham603singh?igsh=bmN6dTEwdnJ0NzFs" target="_blank" rel="noreferrer" className="social-btn instagram">
                  <span>📸</span> Instagram
                </a>
              </div>
              <p className="founder-credit">
                🛠️ <strong>Designed & Developed by Shubham Singh</strong> — Built with React, Node.js & MongoDB
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}