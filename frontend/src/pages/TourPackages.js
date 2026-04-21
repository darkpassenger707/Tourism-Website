import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['all','adventure','cultural','beach','wildlife','city','luxury','budget'];
const SORT_OPTIONS = [
  { value:'rating-DESC',        label:'Top Rated' },
  { value:'price_per_person-ASC', label:'Price: Low to High' },
  { value:'price_per_person-DESC',label:'Price: High to Low' },
  { value:'duration_days-ASC',  label:'Shortest First' },
  { value:'created_at-DESC',    label:'Newest' },
];

const TourPackages = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort]         = useState('rating-DESC');
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(6000);

  useEffect(() => {
    setLoading(true);
    const [sortField, sortOrder] = sort.split('-');
    const params = new URLSearchParams({
      sort: sortField, order: sortOrder, max_price: maxPrice,
      ...(category !== 'all' && { category }),
      ...(search && { search }),
    });
    axios.get(`/api/packages?${params}`)
      .then(({ data }) => { if (data.success) setPackages(data.packages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, sort, search, maxPrice]);

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">Explore the World</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>Tour Packages</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:480, margin:'0 auto' }}>
            {packages.length} curated journeys across 6 continents. Find the one that speaks to your soul.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Filters Row */}
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center', marginBottom:40, padding:'24px', background:'var(--white)', borderRadius:16, boxShadow:'var(--shadow-sm)' }}>
            {/* Search */}
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍  Search destinations, packages…"
              className="form-control" style={{ flex:'1 1 220px', margin:0 }} />

            {/* Price Range */}
            <div style={{ flex:'1 1 200px' }}>
              <label className="form-label">Max Budget: ${maxPrice.toLocaleString()}/person</label>
              <input type="range" min={500} max={6000} step={100} value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                style={{ width:'100%', accentColor:'var(--forest)' }} />
            </div>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="form-control" style={{ flex:'0 0 200px', margin:0 }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Category Chips */}
          <div className="filter-chips" style={{ marginBottom:40 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`chip ${category === c ? 'active' : ''}`}
                style={{ textTransform:'capitalize' }}>
                {c === 'all' ? '🌍 All' : c === 'adventure' ? '🧗 Adventure' : c === 'cultural' ? '🏛 Cultural' : c === 'beach' ? '🏖 Beach' : c === 'wildlife' ? '🦁 Wildlife' : c === 'city' ? '🌆 City' : c === 'luxury' ? '💎 Luxury' : '💰 Budget'}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid-3">
              {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center" style={{ padding:'80px 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>🗺️</div>
              <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>No packages found</h3>
              <p className="text-muted">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid-3">
              {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const PackageCard = ({ pkg }) => (
  <div className="card">
    <Link to={`/booking?package=${pkg.id}`} style={{ display:'block' }}>
      <div style={{ overflow:'hidden', height:220, position:'relative' }}>
        <img src={pkg.image_url} alt={pkg.title} className="card-img" style={{ height:220 }} />
        <div style={{ position:'absolute', top:14, left:14 }}>
          <span className="card-tag" style={{ textTransform:'capitalize' }}>{pkg.category}</span>
        </div>
        {pkg.original_price > pkg.price_per_person && (
          <div style={{ position:'absolute', top:14, right:14, background:'var(--terra)', color:'#fff', borderRadius:6, padding:'4px 10px', fontSize:'0.72rem', fontWeight:700 }}>
            -{Math.round((1 - pkg.price_per_person/pkg.original_price)*100)}% OFF
          </div>
        )}
      </div>
    </Link>

    <div className="card-body">
      <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:6 }}>
        📍 {pkg.destination_name || 'International'}, {pkg.country} &nbsp;·&nbsp; 🗓 {pkg.duration_days} Days
      </p>
      <h3 className="card-title" style={{ fontSize:'1.2rem' }}>{pkg.title}</h3>

      <div style={{ display:'flex', gap:12, margin:'12px 0', flexWrap:'wrap' }}>
        <span style={{ fontSize:'0.78rem', color:'var(--muted)' }}>👥 Max {pkg.max_group_size} pax</span>
        <span style={{ fontSize:'0.78rem', color:'var(--muted)', textTransform:'capitalize' }}>
          {pkg.difficulty === 'easy' ? '🟢' : pkg.difficulty === 'moderate' ? '🟡' : '🔴'} {pkg.difficulty}
        </span>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:16, paddingTop:16, borderTop:'1px solid var(--cream-dk)' }}>
        <div>
          {pkg.original_price > pkg.price_per_person && (
            <span className="card-original">${Number(pkg.original_price).toLocaleString()}</span>
          )}
          <span className="card-price">${Number(pkg.price_per_person).toLocaleString()}</span>
          <span className="card-price-note"> /person</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <span style={{ fontSize:'0.82rem', color:'#f5c518', fontWeight:600 }}>★ {Number(pkg.rating).toFixed(1)}</span>
          <span style={{ fontSize:'0.78rem', color:'var(--muted)' }}>({pkg.review_count})</span>
        </div>
      </div>

      <Link to={`/booking?package=${pkg.id}`} className="btn btn-primary w-full" style={{ marginTop:16, justifyContent:'center' }}>
        Book This Package
      </Link>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="card">
    <div style={{ height:220, background:'linear-gradient(110deg, #f0ebe2 30%, #faf7f2 50%, #f0ebe2 70%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite' }} />
    <div className="card-body">
      <div style={{ height:10, width:'50%', background:'#f0ebe2', borderRadius:4, marginBottom:12 }} />
      <div style={{ height:20, width:'80%', background:'#f0ebe2', borderRadius:4, marginBottom:8 }} />
      <div style={{ height:14, width:'40%', background:'#f0ebe2', borderRadius:4 }} />
    </div>
    <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
  </div>
);

export default TourPackages;
