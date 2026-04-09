import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendors, getCategories } from '../utils/api';
import VendorCard from '../components/common/VendorCard';
import './CategoryPage.css';

const DISTRICTS =[
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

export default function CategoryPage() {
  const { slug } = useParams();
  const [vendors,   setVendors]   = useState([]);
  const [category,  setCategory]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [district,  setDistrict]  = useState('');
  const [search,    setSearch]    = useState('');

  const typeMap = {
    bricks: 'Bricks Factory',
    cement: 'Cement Dealer',
    balu:   'Sand (Balu) Supplier',
    chhar:  'Chhar/Gitti Supplier',
    wood:   'Wood & Timber',
    tiles:  'Tiles & Marble',
    iron:   'Iron & Steel',
    paint:  'Paint Dealer',
  };

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { businessType: typeMap[slug], limit: 50 };
      if (district) params.district = district;
      if (search)   params.search   = search;
      const [vRes, cRes] = await Promise.all([
        getVendors(params),
        getCategories(),
      ]);
      setVendors(vRes.data.vendors || []);
      const cats = cRes.data || [];
      setCategory(cats.find(c => c.slug === slug));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [slug]);

  const handleFilter = (e) => { e.preventDefault(); fetch(); };

  const catInfo = {
    bricks: { desc: 'Find brick factories across Bihar offering 1st class, 2nd class, fly ash and more varieties with doorstep delivery.', color: '#fff3e0' },
    cement: { desc: 'Get cement from authorized dealers — Ultratech, ACC, Ambuja, JK, Shree and more at best prices.', color: '#e8f5e9' },
    balu:   { desc: 'Quality river sand and M-sand suppliers from Ganga, Gandak and Sone rivers across Bihar.', color: '#e3f2fd' },
    chhar:  { desc: 'Stone chips and gitti suppliers from Rohtas, Kaimur and other quarry districts of Bihar.', color: '#fce4ec' },
    wood:   { desc: 'Teak, sal, shisham, plywood and timber suppliers for doors, windows, furniture and roofing.', color: '#f3e5f5' },
    tiles:  { desc: 'Floor tiles, wall tiles, marble, granite and kota stone dealers across Bihar.', color: '#e0f7fa' },
    iron:   { desc: 'TMT bars, MS rods, angle iron and structural steel dealers for your construction needs.', color: '#ede7f6' },
    paint:  { desc: 'Interior, exterior, waterproof paints and primers from Asian Paints, Berger, Nerolac dealers.', color: '#fff8e1' },
  };

  const info = catInfo[slug] || { desc: 'Find verified suppliers near you.', color: '#f5f6fa' };

  return (
    <div className="page">
      <div className="container">
        {/* Category Banner */}
        <div className="cat-banner" style={{ background: info.color }}>
          <div className="cat-banner-text">
            <div className="cat-banner-icon">{category?.icon || '🏭'}</div>
            <div>
              <h1>{category?.name || typeMap[slug] || 'Suppliers'}</h1>
              <p>{info.desc}</p>
              <div className="cat-breadcrumb">
                <Link to="/">Home</Link> / <Link to="/vendors">Vendors</Link> / <span>{category?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <form className="cat-filters" onSubmit={handleFilter}>
          <input type="text" placeholder="Search by name..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select value={district} onChange={e => setDistrict(e.target.value)}>
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit" className="btn btn-primary">🔍 Filter</button>
          {(district || search) && (
            <button type="button" className="btn btn-outline"
              onClick={() => { setDistrict(''); setSearch(''); setTimeout(fetch, 0); }}>
              Clear
            </button>
          )}
        </form>

        <div className="results-meta">
          <span>{vendors.length} suppliers found{district ? ` in ${district}` : ' in Bihar'}</span>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : vendors.length === 0 ? (
          <div className="empty-state">
            <div className="icon">{category?.icon || '🏭'}</div>
            <h3>No {typeMap[slug]} found</h3>
            <p>Try a different district or check back later</p>
            <Link to="/vendors" className="btn btn-primary" style={{ marginTop: 12 }}>Browse All Vendors</Link>
          </div>
        ) : (
          <div className="grid-3">
            {vendors.map(v => <VendorCard key={v._id} vendor={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}
