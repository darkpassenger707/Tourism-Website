import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HERO_BG = 'https://images.unsplash.com/photo-1658311086271-768699115b31?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9yZXN0JTIwcml2ZXJ8ZW58MHx8MHx8fDA%3D';

const stats = [
  { value: '120+', label: 'Destinations' },
  { value: '40K+', label: 'Happy Travelers' },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '10+',  label: 'Years of Excellence' },
];

const whyUs = [
  { icon: '🌍', title: 'Curated Experiences', desc: 'Every itinerary is handpicked by expert travel designers who know each destination intimately.' },
  { icon: '🛡️', title: 'Travel Guarantee',   desc: 'Our price-match guarantee and 24/7 support means you travel with absolute peace of mind.' },
  { icon: '🤖', title: 'AI-Powered Planning', desc: 'Our intelligent recommender learns your preferences and crafts journeys uniquely yours.' },
  { icon: '✈️', title: 'End-to-End Service',  desc: 'From visa assistance to airport transfers, we handle every detail of your adventure.' },
];

const testimonials = [
  { name: 'Priya Sharma', loc: 'Mumbai', rating: 5, text: 'The Bali package was nothing short of magical. Every detail was thoughtfully arranged and the local guides were exceptional.', avatar: 'PS' },
  { name: 'Arjun Menon',  loc: 'Bangalore', rating: 5, text: 'Wanderlust turned our Kyoto trip into a cultural odyssey we will cherish forever. The Tsushima sightseeing was phenomenal.', avatar: 'AM' },
  { name: 'Leila Hassan', loc: 'Delhi', rating: 5, text: 'The AI recommender suggested Queenstown, a destination I\'d never considered. Best adventure of my life. Truly outstanding.', avatar: 'LH' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch]     = useState({ destination:'', date:'', guests:1 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/packages?featured=true&sort=rating&order=DESC')
      .then(({ data }) => { if (data.success) setFeatured(data.packages.slice(0, 6)); })
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/packages?search=${search.destination}`);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────── */}
      <section className="hero" style={{ minHeight:'100vh' }}>
        <div className="hero-bg" style={{ backgroundImage:`url(${HERO_BG})` }} />
        <div className="hero-overlay" />

        <div className="container hero-content" style={{ paddingTop:80 }}>
          <div className="hero-eyebrow anim-fade-in">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">World's Finest Travel Curator</span>
          </div>

          <h1 className="display-xl anim-fade-up" style={{ color:'var(--white)', maxWidth:780, animationDelay:'0.1s' }}>
            Where Every Journey Becomes a{' '}
            <em style={{ fontStyle:'italic', color:'var(--gold-lt)' }}>Story</em>
          </h1>

          <p className="body-lg anim-fade-up" style={{ color:'rgba(255,255,255,0.8)', maxWidth:540, margin:'24px 0 48px', animationDelay:'0.2s' }}>
            Discover handcrafted travel experiences across 120+ destinations. Luxury, adventure, culture crafted around you.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="anim-fade-up" style={{ animationDelay:'0.3s' }}>
            <div style={{
              display:'flex', gap:0, background:'var(--white)', borderRadius:14,
              padding:8, boxShadow:'0 24px 80px rgba(0,0,0,0.25)', maxWidth:760,
              flexWrap:'wrap',
            }}>
              <div style={{ flex:2, minWidth:180, padding:'8px 16px', borderRight:'1px solid #eee' }}>
                <label style={{ display:'block', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>Where to?</label>
                <input value={search.destination} onChange={e => setSearch({...search, destination:e.target.value})}
                  placeholder="Bali, Paris, Kyoto…" style={{ border:'none', outline:'none', fontSize:'0.95rem', width:'100%', color:'var(--ink)' }} />
              </div>
              <div style={{ flex:1.5, minWidth:140, padding:'8px 16px', borderRight:'1px solid #eee' }}>
                <label style={{ display:'block', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>Travel Date</label>
                <input type="date" value={search.date} onChange={e => setSearch({...search, date:e.target.value})}
                  style={{ border:'none', outline:'none', fontSize:'0.9rem', width:'100%', color:'var(--ink)' }} />
              </div>
              <div style={{ flex:1, minWidth:110, padding:'8px 16px' }}>
                <label style={{ display:'block', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>Guests</label>
                <select value={search.guests} onChange={e => setSearch({...search, guests:+e.target.value})}
                  style={{ border:'none', outline:'none', fontSize:'0.9rem', color:'var(--ink)', background:'transparent', width:'100%' }}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-gold" style={{ margin:2, borderRadius:10, whiteSpace:'nowrap', letterSpacing:'0.1em' }}>
                Search ✦
              </button>
            </div>
          </form>

          {/* Hero Tags */}
          <div className="anim-fade-up" style={{ display:'flex', gap:12, marginTop:32, flexWrap:'wrap', animationDelay:'0.4s' }}>
            {['🏝 Beach Escapes','🏔 Mountain Treks','🏛 Cultural Tours','🦁 Wildlife Safaris'].map(tag => (
              <span key={tag} style={{ padding:'8px 16px', border:'1px solid rgba(255,255,255,0.3)', borderRadius:20, fontSize:'0.82rem', color:'rgba(255,255,255,0.85)', backdropFilter:'blur(8px)', cursor:'pointer' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────── */}
      <section style={{ background:'var(--forest)', padding:'60px 0' }}>
        <div className="container">
          <div className="grid-4" style={{ gap:0 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign:'center', padding:'0 24px', borderRight: i<3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div className="stat-value" style={{ color:'var(--gold)' }}>{s.value}</div>
                <div className="stat-label" style={{ color:'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PACKAGES ─────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Handpicked for You</span>
            <h2 className="display-md">Featured Journeys</h2>
            <div className="section-divider" />
            <p className="body-lg text-muted" style={{ maxWidth:520, margin:'0 auto' }}>
              From sun-kissed shores to ancient highlands. Each package crafted for the explorers.
            </p>
          </div>

          <div className="grid-3">
            {featured.length ? featured.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            )) : (
              // Skeleton loaders
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ minHeight:380 }}>
                  <div style={{ height:240, background:'linear-gradient(110deg, #f0ebe2 30%, #faf7f2 50%, #f0ebe2 70%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite' }} />
                  <div className="card-body">
                    <div style={{ height:12, width:'60%', background:'#f0ebe2', borderRadius:6, marginBottom:12 }} />
                    <div style={{ height:20, width:'80%', background:'#f0ebe2', borderRadius:6, marginBottom:8 }} />
                    <div style={{ height:16, width:'40%', background:'#f0ebe2', borderRadius:6 }} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center" style={{ marginTop:48 }}>
            <Link to="/packages" className="btn btn-outline">View All Packages →</Link>
          </div>
        </div>
      </section>

      {/* ── WHY WANDERLUST ────────────────────── */}
      <section className="section" style={{ background:'var(--cream-dk)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
            <div>
              <span className="section-label">Why Choose Us</span>
              <h2 className="display-md" style={{ marginTop:16, marginBottom:24 }}>
                Travel Designed<br />Around <em style={{ color:'var(--terra)', fontStyle:'italic' }}>You</em>
              </h2>
              <p className="body-lg text-muted" style={{ marginBottom:40 }}>
                We go beyond booking. Every element of your journey is thoughtfully curated from the moment you dream it to the moment you return home transformed.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
                {whyUs.map((w, i) => (
                  <div key={i} style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
                    <div style={{ width:52, height:52, minWidth:52, borderRadius:14, background:'var(--white)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', boxShadow:'var(--shadow-sm)' }}>
                      {w.icon}
                    </div>
                    <div>
                      <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', marginBottom:4 }}>{w.title}</h4>
                      <p style={{ fontSize:'0.88rem', color:'var(--muted)', lineHeight:1.7 }}>{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:40 }}>
                <Link to="/packages" className="btn btn-primary btn-lg">Start Your Journey</Link>
              </div>
            </div>

            {/* Right: image mosaic */}
            <div style={{ position:'relative', height:560 }}>
              <img src="https://img.freepik.com/free-photo/cherry-blossoms-spring-chureito-pagoda-fuji-mountain-japan_335224-213.jpg?semt=ais_hybrid&w=740&q=80" alt="Travel" style={{ width:'70%', height:360, objectFit:'cover', borderRadius:20, position:'absolute', top:0, right:0, boxShadow:'var(--shadow-lg)' }} />
              <img src="https://img.freepik.com/free-photo/beautiful-shot-natural-scenery-autumn_181624-25934.jpg?semt=ais_hybrid&w=740&q=80" alt="Destination" style={{ width:'55%', height:260, objectFit:'cover', borderRadius:20, position:'absolute', bottom:0, left:0, boxShadow:'var(--shadow-lg)', border:'6px solid var(--cream-dk)' }} />
              {/* Floating badge */}
              <div style={{ position:'absolute', top:280, left:'30%', background:'var(--white)', borderRadius:14, padding:'16px 20px', boxShadow:'var(--shadow-md)', zIndex:10 }}>
                <div style={{ fontSize:'1.5rem', marginBottom:4 }}>⭐ 7.9</div>
                <div style={{ fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS GRID ─────────────────── */}
<section className="section">
  <div className="container">
    <div className="section-header">
      <span className="section-label">Top Destinations</span>
      <h2 className="display-md">The World Awaits</h2>
      <div className="section-divider" />
    </div>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gridTemplateRows: 'repeat(2, 220px)', 
      gap: 16 
    }}>
      {[
        // Bali: Starts at line 1, ends at line 3 (Takes 2 spots)
        { name:'Bali', country:'Indonesia', img:'https://www.johansens.com/wp-content/uploads/2016/08/Thailand-AYANA-Estate-Bali-73-e1673272835586.jpg', span:'1 / 3', row:'1' },
        // Santorini: Stays in spot 3
        { name:'Santorini', country:'Greece', img:'https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/2023/11/santorini-4825173_1280-1024x675.jpg', span:'3 / 4', row:'1' },
        // Kyoto: Stays in spot 4
        { name:'Kyoto', country:'Japan', img:'https://www.planetware.com/img/gallery/kyotos-10-most-amazing-tourist-attractions-to-add-to-your-itinerary/l-intro-1764346932.jpg', span:'4 / 5', row:'1' },
        // Maldives: First spot of row 2
        { name:'Maldives', country:'Maldives', img:'https://media.cntraveler.com/photos/66aa859b257a60dbb6105d8f/16:9/w_2560%2Cc_limit/Six%2520Senses%2520Kanuhura_The%2520Point%2520aerial.jpg', span:'1 / 2', row:'2' },
        // Machu Picchu: Starts at line 2, ends at line 4 (Takes 2 spots)
        { name:'Machu Picchu', country:'Peru', img:'https://images.goway.com/production/styles/wide/s3/hero/iStock-1339071089.jpg.webp?VersionId=wh9Eb9ZGF3Srb6suNykdRW0Fat.4X9Ua&itok=ofMMTLit', span:'2 / 4', row:'2' },
        // Serengeti: Last spot of row 2
        { name:'Serengeti', country:'Tanzania', img:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400', span:'4 / 5', row:'2' },
      ].map((d, i) => (
        <Link key={i} to={`/packages?search=${d.name}`}
          style={{ 
            gridColumn: d.span, // This now uses the '1 / 3' style syntax
            gridRow: d.row, 
            borderRadius: 16, 
            overflow: 'hidden', 
            position: 'relative', 
            display: 'block' 
          }}>
          <img src={d.img} alt={d.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', // This prevents the images from looking "irregular" or stretched
              transition: 'transform 0.5s ease' 
            }}
            onMouseEnter={e => e.target.style.transform='scale(1.06)'}
            onMouseLeave={e => e.target.style.transform='scale(1)'} />
          
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
          
          <div style={{ position:'absolute', bottom:20, left:20 }}>
            <div style={{ fontSize:'1.2rem', fontFamily:'var(--font-display)', fontWeight:600, color:'var(--white)' }}>{d.name}</div>
            <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.75)', letterSpacing:'0.06em' }}>{d.country}</div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* ── AI CTA ────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg, var(--forest) 0%, #0f2419 100%)', padding:'100px 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:600, height:600, borderRadius:'50%', background:'rgba(200,169,110,0.06)' }} />
        <div style={{ position:'absolute', bottom:'-30%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'rgba(200,169,110,0.04)' }} />
        <div className="container text-center" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label" style={{ color:'var(--gold)', display:'block', marginBottom:16 }}>Powered by AI</span>
          <h2 className="display-md" style={{ color:'var(--white)', maxWidth:640, margin:'0 auto 20px' }}>
            Let Our smart AI tailor your perfect journey
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:500, margin:'0 auto 40px', fontSize:'1rem', lineHeight:1.8 }}>
            Tell us your budget, interests, and dream vibe. Our intelligent travel guide will recommend destinations perfectly tailored to you.
          </p>
          <Link to="/ai-recommender" className="btn btn-gold btn-lg">
            ✦ Try our AI Recommender
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Traveler Stories</span>
            <h2 className="display-md">Words from Our Explorers</h2>
            <div className="section-divider" />
          </div>

          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding:32 }}>
                <div style={{ fontSize:'2rem', color:'var(--gold)', marginBottom:16, fontFamily:'Georgia', lineHeight:1 }}>"</div>
                <p style={{ fontSize:'0.95rem', lineHeight:1.8, color:'#444', marginBottom:24 }}>{t.text}</p>
                <div style={{ display:'flex', alignItems:'center', gap:14, paddingTop:20, borderTop:'1px solid var(--cream-dk)' }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:'var(--forest)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', fontWeight:700, fontSize:'0.9rem' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.95rem' }}>{t.name}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--muted)' }}>{t.loc}</div>
                  </div>
                  <div style={{ marginLeft:'auto' }}>
                    {'⭐'.repeat(t.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ────────────────────── */}
      <section style={{ background:'var(--gold-lt)', padding:'80px 0' }}>
        <div className="container text-center">
          <span className="section-label" style={{ color:'var(--forest)', display:'block', marginBottom:16 }}>Stay Inspired</span>
          <h2 className="display-md" style={{ marginBottom:16 }}>Get Travel Inspiration Weekly</h2>
          <p style={{ color:'var(--muted)', maxWidth:440, margin:'0 auto 36px' }}>
            Exclusive deals, destination guides, and insider tips delivered to your inbox.
          </p>
          <div style={{ display:'flex', gap:0, maxWidth:460, margin:'0 auto', borderRadius:10, overflow:'hidden', boxShadow:'var(--shadow-md)' }}>
            <input placeholder="your@email.com" style={{ flex:1, padding:'16px 20px', border:'none', fontSize:'0.95rem', outline:'none' }} />
            <button className="btn btn-primary" style={{ borderRadius:0, letterSpacing:'0.1em' }}>Subscribe</button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer { to { background-position: -200% 0; } }
      `}</style>
    </>
  );
};

// ── Package Card Component ──────────────────────────
const PackageCard = ({ pkg }) => (
  <Link to={`/booking?package=${pkg.id}`} className="card" style={{ display:'block', textDecoration:'none' }}>
    <div style={{ overflow:'hidden', height:240, position:'relative' }}>
      <img src={pkg.image_url} alt={pkg.title} className="card-img" />
      {pkg.original_price && (
        <div style={{ position:'absolute', top:16, right:16, background:'var(--terra)', color:'#fff', borderRadius:6, padding:'4px 10px', fontSize:'0.75rem', fontWeight:600 }}>
          SAVE ${(pkg.original_price - pkg.price_per_person).toFixed(0)}
        </div>
      )}
      <div style={{ position:'absolute', bottom:16, left:16 }}>
        <span style={{ background:'rgba(26,58,42,0.85)', backdropFilter:'blur(8px)', color:'var(--gold)', padding:'5px 12px', borderRadius:20, fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>
          {pkg.category}
        </span>
      </div>
    </div>
    <div className="card-body">
      <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:6 }}>{pkg.destination_name}, {pkg.country} · {pkg.duration_days} Days</p>
      <h3 className="card-title">{pkg.title}</h3>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:16 }}>
        <div>
          {pkg.original_price && <span className="card-original">${pkg.original_price.toLocaleString()}</span>}
          <span className="card-price">${pkg.price_per_person.toLocaleString()}</span>
          <span className="card-price-note"> /person</span>
        </div>
        <div className="card-rating">
          <span className="star">★</span>
          <span style={{ fontWeight:600 }}>{Number(pkg.rating).toFixed(1)}</span>
          <span style={{ fontSize:'0.75rem' }}>({pkg.review_count})</span>
        </div>
      </div>
    </div>
  </Link>
);

export default Home;
