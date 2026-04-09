import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVendors } from '../utils/api';
import VendorCard from '../components/common/VendorCard';
import './VendorsPage.css';

const TYPES = [
  'Bricks Factory','Cement Dealer','Sand (Balu) Supplier',
  'Chhar/Gitti Supplier','Wood & Timber','Tiles & Marble',
  'Iron & Steel','Paint Dealer','Other',
];
const DISTRICTS = [
  'Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Ara (Bhojpur)',
  'Begusarai','Munger','Chapra (Saran)','Samastipur','Nalanda','Vaishali',
  'Sitamarhi','Madhubani','Supaul','Araria','Purnia','Katihar',
  'Rohtas','Kaimur','Buxar','Gopalganj','West Champaran','East Champaran',
  'Siwan','Khagaria','Begusarai',
];

export default function VendorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);

  const [filters, setFilters] = useState({
    search:       searchParams.get('search') || '',
    district:     searchParams.get('district') || '',
    businessType: searchParams.get('businessType') || '',
  });

  const fetchVendors = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await getVendors(params);
      setVendors(res.data.vendors || []);
      setTotal(res.data.total || 0);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchVendors(1); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchVendors(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', district: '', businessType: '' });
    setSearchParams({});
    setTimeout(() => fetchVendors(1), 0);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="vendors-layout">
          {/* Sidebar Filters */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h3>🔍 Filter Vendors</h3>
              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            </div>
            <form onSubmit={handleFilter}>
              <div className="form-group">
                <label>Search</label>
                <input
                  type="text" placeholder="Search by name..."
                  value={filters.search}
                  onChange={e => setFilters(f => ({...f, search: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <select value={filters.district}
                  onChange={e => setFilters(f => ({...f, district: e.target.value}))}>
                  <option value="">All Districts</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Material Type</label>
                <select value={filters.businessType}
                  onChange={e => setFilters(f => ({...f, businessType: e.target.value}))}>
                  <option value="">All Types</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full">Apply Filters</button>
            </form>
          </aside>

          {/* Results */}
          <div className="vendors-results">
            <div className="results-header">
              <h2>Construction Material Suppliers</h2>
              <span className="results-count">{total} vendors found</span>
            </div>

            {loading ? (
              <div className="loader"><div className="spinner"/></div>
            ) : vendors.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🏭</div>
                <h3>No vendors found</h3>
                <p>Try changing your filters or search term</p>
                <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid-3">
                  {vendors.map(v => <VendorCard key={v._id} vendor={v} />)}
                </div>
                {total > 12 && (
                  <div className="pagination">
                    <button className="btn btn-outline btn-sm"
                      disabled={page === 1} onClick={() => fetchVendors(page - 1)}>← Prev</button>
                    <span>Page {page} of {Math.ceil(total/12)}</span>
                    <button className="btn btn-outline btn-sm"
                      disabled={vendors.length < 12} onClick={() => fetchVendors(page + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
