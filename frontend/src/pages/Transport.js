import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TRANSPORT_TYPES = [
  { id:'flight',     icon:'✈️', label:'Flights',     desc:'Domestic & international flights with all major airlines' },
  { id:'train',      icon:'🚂', label:'Trains',      desc:'Scenic rail journeys across breathtaking landscapes' },
  { id:'bus',        icon:'🚌', label:'Bus / Coach', desc:'Comfortable intercity coach services' },
  { id:'cruise',     icon:'🛳️', label:'Cruises',     desc:'Luxury ocean and river cruise experiences' },
  { id:'car_rental', icon:'🚗', label:'Car Rental',  desc:'Self-drive adventures with flexible pick-up & drop-off' },
];

const MOCK_RESULTS = {
  flight: [
    { id:1, provider:'Air India', origin:'Mumbai (BOM)', destination:'Bali (DPS)', departure:'08:30', arrival:'15:45', duration:'7h 15m', price:320, class:'Economy', seats:42, stops:'1 Stop via Singapore' },
    { id:2, provider:'IndiGo',    origin:'Mumbai (BOM)', destination:'Bali (DPS)', departure:'22:10', arrival:'07:30+1', duration:'9h 20m', price:268, class:'Economy', seats:8, stops:'1 Stop via Kuala Lumpur' },
    { id:3, provider:'Air India', origin:'Mumbai (BOM)', destination:'Bali (DPS)', departure:'14:15', arrival:'21:00', duration:'6h 45m', price:780, class:'Business', seats:4, stops:'Non-stop' },
  ],
  train: [
    { id:4, provider:'Indian Railways', origin:'Mumbai CSMT', destination:'Goa', departure:'06:10', arrival:'14:25', duration:'8h 15m', price:45, class:'2AC', seats:62, stops:'Express' },
    { id:5, provider:'Vande Bharat',    origin:'Mumbai Central', destination:'Ahmedabad', departure:'07:00', arrival:'12:10', duration:'5h 10m', price:35, class:'Executive', seats:18, stops:'Express' },
  ],
  bus: [
    { id:6, provider:'VRL Travels',  origin:'Bangalore', destination:'Goa', departure:'21:30', arrival:'07:00+1', duration:'9h 30m', price:18, class:'Sleeper', seats:24, stops:'Express' },
    { id:7, provider:'SRS Travels',  origin:'Bangalore', destination:'Goa', departure:'20:00', arrival:'06:30+1', duration:'10h 30m', price:14, class:'Semi-Sleeper', seats:38, stops:'Express' },
  ],
  cruise: [
    { id:8, provider:'MSC Cruises', origin:'Mumbai', destination:'Maldives', departure:'Day 1 18:00', arrival:'Day 4 09:00', duration:'4 Nights', price:1299, class:'Balcony Cabin', seats:12, stops:'Luxury Cruise' },
  ],
  car_rental: [
    { id:9,  provider:'Zoomcar',   origin:'Bali Airport', destination:'Self-Drive', departure:'Anytime', arrival:'Flexible', duration:'Per Day', price:38, class:'Compact', seats:99, stops:'Unlimited KM' },
    { id:10, provider:'Hertz',     origin:'Santorini Airport', destination:'Self-Drive', departure:'Anytime', arrival:'Flexible', duration:'Per Day', price:72, class:'SUV', seats:99, stops:'Unlimited KM' },
  ],
};

const Transport = () => {
  const [activeType, setActiveType] = useState('flight');
  const [from, setFrom]   = useState('');
  const [to, setTo]       = useState('');
  const [date, setDate]   = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setResults(MOCK_RESULTS[activeType] || []);
      setSearching(false);
    }, 900);
  };

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">Get Around the World</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>Transport Options</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:480, margin:'0 auto' }}>
            Flights, trains, cruises, and more. Seamless connections for every leg of your journey.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Type Selector */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:40 }}>
            {TRANSPORT_TYPES.map(t => (
              <button key={t.id} onClick={() => { setActiveType(t.id); setResults(null); }}
                style={{
                  display:'flex', alignItems:'center', gap:10, padding:'14px 24px',
                  borderRadius:12, border:`2px solid ${activeType===t.id ? 'var(--forest)':'var(--cream-dk)'}`,
                  background: activeType===t.id ? 'var(--forest)' : 'var(--white)',
                  color: activeType===t.id ? 'var(--white)' : 'var(--ink)',
                  transition:'all 0.3s ease', cursor:'pointer',
                }}>
                <span style={{ fontSize:'1.4rem' }}>{t.icon}</span>
                <span style={{ fontWeight:500, fontSize:'0.9rem' }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Active type description */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <p style={{ color:'var(--muted)', fontSize:'0.9rem' }}>
              {TRANSPORT_TYPES.find(t => t.id === activeType)?.desc}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ background:'var(--white)', borderRadius:16, padding:32, boxShadow:'var(--shadow-md)', marginBottom:40 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:16, alignItems:'flex-end' }}>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">From</label>
                <input value={from} onChange={e => setFrom(e.target.value)} className="form-control"
                  placeholder={activeType==='flight' ? 'Mumbai (BOM)' : activeType==='train' ? 'Mumbai CSMT' : 'City or Region'} />
              </div>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">To</label>
                <input value={to} onChange={e => setTo(e.target.value)} className="form-control"
                  placeholder={activeType==='flight' ? 'Bali (DPS)' : activeType==='train' ? 'Goa' : 'Destination'} />
              </div>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">{activeType==='car_rental' ? 'Pick-up Date' : 'Departure Date'}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height:48, paddingTop:0, paddingBottom:0, whiteSpace:'nowrap' }}>
                {searching ? 'Searching…' : 'Search →'}
              </button>
            </div>
          </form>

          {/* Results */}
          {searching && <div className="spinner" />}

          {!searching && results !== null && (
            results.length === 0 ? (
              <div className="text-center" style={{ padding:'60px 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:16 }}>🔍</div>
                <h3 style={{ fontFamily:'var(--font-display)' }}>No results found</h3>
                <p className="text-muted">Try different cities or dates.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <p style={{ color:'var(--muted)', fontSize:'0.88rem' }}>{results.length} option{results.length!==1?'s':''} found</p>
                {results.map(r => <TransportCard key={r.id} item={r} type={activeType} />)}
              </div>
            )
          )}

          {!results && !searching && (
            /* Feature Cards */
            <div className="grid-3" style={{ marginTop:20 }}>
              {[
                { icon:'💰', title:'Best Price Guarantee', desc:'We match any lower price you find within 24 hours of booking.' },
                { icon:'🔄', title:'Free Cancellation', desc:'Most tickets can be cancelled or rescheduled up to 24 hours before departure.' },
                { icon:'📱', title:'Instant Confirmation', desc:'E-tickets delivered to your inbox seconds after booking is confirmed.' },
              ].map((f,i) => (
                <div key={i} style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-sm)', textAlign:'center' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:14 }}>{f.icon}</div>
                  <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:8 }}>{f.title}</h4>
                  <p style={{ fontSize:'0.88rem', color:'var(--muted)', lineHeight:1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const TransportCard = ({ item, type }) => (
  <div style={{ background:'var(--white)', borderRadius:16, padding:'24px 28px', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', gap:24, flexWrap:'wrap', transition:'all 0.3s', border:'1.5px solid transparent' }}
    onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold)'}
    onMouseLeave={e => e.currentTarget.style.borderColor='transparent'}>

    <div style={{ minWidth:140 }}>
      <div style={{ fontWeight:700, fontSize:'1rem', color:'var(--forest)' }}>{item.provider}</div>
      <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:4 }}>{item.stops}</div>
    </div>

    {type !== 'car_rental' && (
      <div style={{ flex:1, minWidth:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'1.4rem', fontWeight:700, fontFamily:'var(--font-display)' }}>{item.departure}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>{item.origin}</div>
          </div>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', letterSpacing:'0.08em' }}>{item.duration}</div>
            <div style={{ height:1, background:'var(--cream-dk)', position:'relative', margin:'4px 0' }}>
              <div style={{ position:'absolute', left:'50%', top:-5, transform:'translateX(-50%)', fontSize:'0.8rem' }}>✈</div>
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'1.4rem', fontWeight:700, fontFamily:'var(--font-display)' }}>{item.arrival}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>{item.destination}</div>
          </div>
        </div>
      </div>
    )}

    {type === 'car_rental' && (
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600 }}>{item.origin}</div>
        <div style={{ fontSize:'0.82rem', color:'var(--muted)' }}>{item.class} · {item.stops}</div>
      </div>
    )}

    <div style={{ minWidth:80, textAlign:'center' }}>
      <span style={{ background:'var(--cream-dk)', padding:'4px 10px', borderRadius:6, fontSize:'0.78rem', color:'var(--muted)' }}>{item.class}</span>
    </div>

    <div style={{ minWidth:80, textAlign:'center' }}>
      <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>{item.seats} seats left</div>
      {item.seats < 10 && <div style={{ fontSize:'0.7rem', color:'var(--terra)', fontWeight:600 }}>Almost full!</div>}
    </div>

    <div style={{ minWidth:160, textAlign:'right' }}>
      <div style={{ fontSize:'1.6rem', fontWeight:700, color:'var(--forest)', fontFamily:'var(--font-display)' }}>
        ${item.price}
      </div>
      <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>per person</div>
      <Link to={`/booking?transport=${item.id}`} className="btn btn-primary btn-sm" style={{ marginTop:8, display:'inline-flex', justifyContent:'center', width:'100%' }}>
        Select
      </Link>
    </div>
  </div>
);

export default Transport;
