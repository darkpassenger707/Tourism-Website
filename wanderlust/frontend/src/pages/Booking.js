import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const [searchParams]  = useSearchParams();
  const packageId       = searchParams.get('package');
  const { user }        = useAuth();
  const navigate        = useNavigate();

  const [pkg, setPkg]       = useState(null);
  const [loading, setLoading] = useState(!!packageId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    check_in_date: '', check_out_date: '', num_adults: 2, num_children: 0,
    special_requests: '', traveler_name: user?.full_name || '', traveler_email: user?.email || '',
    traveler_phone: user?.phone || '',
  });

  useEffect(() => {
    if (packageId) {
      axios.get(`/api/packages/${packageId}`)
        .then(({ data }) => { if (data.success) setPkg(data.package); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [packageId]);

  const totalGuests  = +form.num_adults + +form.num_children * 0.5;
  const packageTotal = pkg ? (pkg.price_per_person * totalGuests).toFixed(2) : 0;
  const taxes        = pkg ? (packageTotal * 0.12).toFixed(2) : 0;
  const grandTotal   = pkg ? (+packageTotal + +taxes).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/account?tab=login&redirect=/booking' + (packageId ? `?package=${packageId}` : '')); return; }
    if (!form.check_in_date) { setError('Please select a check-in date.'); return; }
    setError(''); setSubmitting(true);
    try {
      const { data } = await axios.post('/api/bookings', {
        package_id: packageId || null, check_in_date: form.check_in_date,
        check_out_date: form.check_out_date || null, num_adults: form.num_adults,
        num_children: form.num_children, special_requests: form.special_requests,
      });
      if (data.success) {
        setSuccess(data);
      } else {
        setError(data.message || 'Booking failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream)', paddingTop:80 }}>
        <div style={{ textAlign:'center', maxWidth:520, padding:'60px 40px', background:'var(--white)', borderRadius:24, boxShadow:'var(--shadow-lg)' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 24px' }}>✓</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--forest)', marginBottom:12 }}>Booking Confirmed!</h2>
          <p style={{ color:'var(--muted)', lineHeight:1.7, marginBottom:8 }}>Your adventure awaits. Here are your booking details:</p>
          <div style={{ background:'var(--cream-dk)', borderRadius:12, padding:'20px 28px', margin:'24px 0', textAlign:'left' }}>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #e0d8cc' }}>
              <span style={{ fontSize:'0.85rem', color:'var(--muted)' }}>Booking Reference</span>
              <span style={{ fontWeight:700, color:'var(--forest)', letterSpacing:'0.05em' }}>{success.booking_ref}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #e0d8cc' }}>
              <span style={{ fontSize:'0.85rem', color:'var(--muted)' }}>Package</span>
              <span style={{ fontWeight:600 }}>{pkg?.title || 'Your Package'}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0' }}>
              <span style={{ fontSize:'0.85rem', color:'var(--muted)' }}>Total Amount</span>
              <span style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--forest)' }}>${Number(success.total_amount).toFixed(2)}</span>
            </div>
          </div>
          <p style={{ fontSize:'0.85rem', color:'var(--muted)', marginBottom:32 }}>Complete your payment to confirm the booking. We've sent a summary to your email.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to={`/payment?booking=${success.booking_id}&amount=${success.total_amount}`} className="btn btn-primary btn-lg">
              Proceed to Payment →
            </Link>
            <Link to="/account" className="btn btn-outline">View My Bookings</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">Reserve Your Spot</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>Complete Your Booking</h1>
          <p style={{ color:'rgba(255,255,255,0.65)' }}>Fill in your details to secure your dream journey.</p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container" style={{ maxWidth:1100 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:40, alignItems:'start' }}>

              {/* Left: Form */}
              <div>
                {/* Package selector if no packageId */}
                {!packageId && (
                  <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-sm)', marginBottom:24 }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:16 }}>Choose a Package</h3>
                    <p className="text-muted" style={{ marginBottom:16, fontSize:'0.88rem' }}>No package selected. Browse our collection first.</p>
                    <Link to="/packages" className="btn btn-outline">Browse Packages →</Link>
                  </div>
                )}

                {/* Selected Package */}
                {loading && <div className="spinner" />}
                {pkg && !loading && (
                  <div style={{ background:'var(--white)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-sm)', marginBottom:24 }}>
                    <div style={{ display:'flex', gap:0 }}>
                      <img src={pkg.image_url} alt={pkg.title} style={{ width:140, height:140, objectFit:'cover' }} />
                      <div style={{ padding:20, flex:1 }}>
                        <span className="card-tag" style={{ textTransform:'capitalize' }}>{pkg.category}</span>
                        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', marginBottom:4 }}>{pkg.title}</h3>
                        <p style={{ fontSize:'0.82rem', color:'var(--muted)' }}>📍 {pkg.destination_name}, {pkg.country} · 🗓 {pkg.duration_days} Days</p>
                        <div style={{ marginTop:8 }}>
                          <span style={{ fontSize:'1.3rem', fontWeight:700, fontFamily:'var(--font-display)', color:'var(--forest)' }}>${Number(pkg.price_per_person).toLocaleString()}</span>
                          <span style={{ fontSize:'0.78rem', color:'var(--muted)' }}> /person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Travel Dates */}
                <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-sm)', marginBottom:24 }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:24 }}>Travel Dates</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Departure / Check-in Date *</label>
                      <input type="date" value={form.check_in_date} onChange={e => setForm({...form, check_in_date:e.target.value})}
                        className="form-control" min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Return / Check-out Date</label>
                      <input type="date" value={form.check_out_date} onChange={e => setForm({...form, check_out_date:e.target.value})}
                        className="form-control" min={form.check_in_date || new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Adults (12+ years)</label>
                      <select value={form.num_adults} onChange={e => setForm({...form, num_adults:+e.target.value})} className="form-control">
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Children (2–11 years)</label>
                      <select value={form.num_children} onChange={e => setForm({...form, num_children:+e.target.value})} className="form-control">
                        {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} {n===1?'Child':'Children'}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Traveler Info */}
                <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-sm)', marginBottom:24 }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:24 }}>Lead Traveler Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name (as per passport)</label>
                      <input value={form.traveler_name} onChange={e => setForm({...form, traveler_name:e.target.value})}
                        className="form-control" placeholder="John Smith" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" value={form.traveler_email} onChange={e => setForm({...form, traveler_email:e.target.value})}
                        className="form-control" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input value={form.traveler_phone} onChange={e => setForm({...form, traveler_phone:e.target.value})}
                      className="form-control" placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Requests / Dietary Requirements</label>
                    <textarea value={form.special_requests} onChange={e => setForm({...form, special_requests:e.target.value})}
                      className="form-control" rows={3} placeholder="Vegetarian meals, wheelchair access, anniversary celebration…" style={{ resize:'vertical' }} />
                  </div>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {!user && <div className="alert alert-info">💡 You'll be asked to sign in before your booking is confirmed.</div>}

                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting} style={{ justifyContent:'center' }}>
                  {submitting ? 'Processing…' : 'Confirm Booking →'}
                </button>
              </div>

              {/* Right: Price Summary */}
              <div style={{ position:'sticky', top:96 }}>
                <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-md)' }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:24 }}>Price Summary</h3>

                  {pkg ? (
                    <>
                      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
                        {[
                          [`${pkg.title}`, `$${Number(pkg.price_per_person).toLocaleString()} × ${form.num_adults} adult${form.num_adults>1?'s':''}`],
                          form.num_children > 0 ? [`Children (${form.num_children})`, `$${(pkg.price_per_person * 0.5 * form.num_children).toFixed(0)} (50% off)`] : null,
                          ['Taxes & Fees (12%)', `$${taxes}`],
                        ].filter(Boolean).map(([label, value], i) => (
                          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem' }}>
                            <span style={{ color:'var(--muted)' }}>{label}</span>
                            <span style={{ fontWeight:500 }}>{value}</span>
                          </div>
                        ))}
                        <div style={{ borderTop:'2px solid var(--cream-dk)', paddingTop:14, display:'flex', justifyContent:'space-between' }}>
                          <span style={{ fontWeight:700, fontSize:'1rem' }}>Total</span>
                          <span style={{ fontWeight:800, fontSize:'1.4rem', color:'var(--forest)', fontFamily:'var(--font-display)' }}>${grandTotal}</span>
                        </div>
                      </div>

                      <div style={{ background:'var(--cream-dk)', borderRadius:10, padding:16, marginBottom:16 }}>
                        {['✅ Free cancellation up to 30 days before','🛡️ Price match guarantee','📞 24/7 concierge support'].map((t,i) => (
                          <div key={i} style={{ fontSize:'0.8rem', color:'var(--forest)', marginBottom: i<2 ? 8 : 0 }}>{t}</div>
                        ))}
                      </div>

                      <div style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'center', padding:'12px 0', borderTop:'1px solid var(--cream-dk)' }}>
                        {['💳','🏦','📱'].map((icon,i) => (
                          <span key={i} style={{ fontSize:'1.2rem' }}>{icon}</span>
                        ))}
                        <span style={{ fontSize:'0.78rem', color:'var(--muted)' }}>Secure payment options</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign:'center', padding:'24px 0' }}>
                      <div style={{ fontSize:'2rem', marginBottom:12 }}>🧳</div>
                      <p style={{ color:'var(--muted)', fontSize:'0.88rem' }}>Select a package to see pricing.</p>
                      <Link to="/packages" className="btn btn-outline btn-sm" style={{ marginTop:16 }}>Browse Packages</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Booking;
