import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const POPULAR = ['Indonesia','Greece','Japan','Peru','Maldives','Tanzania','France','New Zealand'];

const Visa = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading]  = useState(false);
  const [country, setCountry]  = useState('');
  const [nationality, setNationality] = useState('Indian');
  const [searched, setSearched] = useState(false);
  const [applying, setApplying] = useState(null); // country name if applying
  const [applyForm, setApplyForm] = useState({ passport_number:'', travel_date:'', visa_type:'tourist', notes:'' });
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const search = async (countryOverride) => {
    const c = countryOverride || country;
    setLoading(true); setSearched(true);
    try {
      const { data } = await axios.get(`/api/visa/requirements?country=${c}&nationality=${nationality}`);
      if (data.success) setRequirements(data.requirements);
    } catch { setRequirements([]); }
    finally { setLoading(false); }
  };

  const handleApply = async () => {
    if (!applyForm.passport_number) { setApplyError('Passport number is required.'); return; }
    setApplyError('');
    try {
      await axios.post('/api/visa/apply', { destination_country: applying, ...applyForm });
      setApplySuccess(true);
    } catch (e) { setApplyError(e.response?.data?.message || 'Submission failed.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">Travel Documentation</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>Visa Information</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:480, margin:'0 auto' }}>
            Check entry requirements, apply for visas, and track your applications — all in one place.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Search */}
          <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-md)', marginBottom:40 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:20 }}>Check Visa Requirements</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:16, alignItems:'flex-end' }}>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">Destination Country</label>
                <input value={country} onChange={e => setCountry(e.target.value)}
                  className="form-control" placeholder="e.g. Japan, France, Maldives…" />
              </div>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">Your Nationality</label>
                <input value={nationality} onChange={e => setNationality(e.target.value)}
                  className="form-control" placeholder="Indian" />
              </div>
              <button onClick={() => search()} className="btn btn-primary" style={{ height:48 }}>
                {loading ? 'Checking…' : 'Check →'}
              </button>
            </div>

            {/* Popular destinations */}
            <div style={{ marginTop:20 }}>
              <p style={{ fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:12 }}>Popular Destinations</p>
              <div className="filter-chips">
                {POPULAR.map(p => (
                  <button key={p} className="chip" onClick={() => { setCountry(p); search(p); }}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {loading && <div className="spinner" />}

          {!loading && searched && requirements.length === 0 && (
            <div className="text-center" style={{ padding:'60px 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>🔍</div>
              <h3 style={{ fontFamily:'var(--font-display)' }}>No results found</h3>
              <p className="text-muted">Try a different country name or nationality.</p>
            </div>
          )}

          {!loading && requirements.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {requirements.map((r, i) => (
                <div key={i} style={{ background:'var(--white)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                  {/* Header */}
                  <div style={{ background:'var(--forest)', padding:'20px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                    <div>
                      <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--white)', marginBottom:4 }}>{r.country}</h3>
                      <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.65)' }}>For {r.nationality} passport holders</p>
                    </div>
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                      {r.visa_on_arrival && <span className="badge badge-success">✓ Visa on Arrival</span>}
                      {r.e_visa_available && <span className="badge badge-info">💻 e-Visa Available</span>}
                      {!r.visa_required && <span className="badge badge-success">✓ Visa Free</span>}
                      {r.visa_required && !r.visa_on_arrival && <span className="badge badge-warning">⚠ Visa Required</span>}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ padding:28 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:16, marginBottom:24 }}>
                      {[
                        { label:'Processing Time', value: r.processing_days === 0 ? 'On Arrival' : `${r.processing_days} Working Days`, icon:'⏱' },
                        { label:'Visa Fee', value: r.fee_usd === 0 ? 'Free' : `$${r.fee_usd}`, icon:'💰' },
                        { label:'Validity', value: r.validity_days ? `${r.validity_days} Days` : 'Varies', icon:'📅' },
                        { label:'Max Stay', value: r.max_stay_days ? `${r.max_stay_days} Days` : 'Varies', icon:'🏠' },
                      ].map((d,j) => (
                        <div key={j} style={{ background:'var(--cream-dk)', borderRadius:10, padding:16, textAlign:'center' }}>
                          <div style={{ fontSize:'1.4rem', marginBottom:6 }}>{d.icon}</div>
                          <div style={{ fontWeight:700, fontSize:'1rem', color:'var(--forest)', marginBottom:4 }}>{d.value}</div>
                          <div style={{ fontSize:'0.72rem', color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{d.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Documents Required */}
                    {r.documents_required && (
                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 12 }}>
                          Documents Required
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 8 }}>
                          {(() => {
                            try {
                              // 1. If it's already a list (Array), just use it.
                              // 2. If it's a string, try to parse it.
                              // 3. If it fails, return an empty list so the page doesn't crash.
                              const docList = Array.isArray(r.documents_required) 
                                ? r.documents_required 
                                : JSON.parse(r.documents_required);

                              return docList.map((doc, j) => (
                                <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', background: 'var(--cream-dk)', borderRadius: 8 }}>
                                  <span style={{ color: 'var(--forest)', fontWeight: 700, fontSize: '0.9rem' }}>✓</span>
                                  <span style={{ fontSize: '0.85rem' }}>{doc}</span>
                                </div>
                              ));
                            } catch (e) {
                              console.error("JSON Error:", e);
                              return <p style={{ fontSize: '0.85rem', color: 'red' }}>Error loading documents.</p>;
                            }
                          })()}
                        </div>
                      </div>
                    )}

                    {r.notes && (
                      <div style={{ background:'rgba(200,169,110,0.1)', border:'1px solid rgba(200,169,110,0.3)', borderRadius:10, padding:14, marginBottom:20 }}>
                        <p style={{ fontSize:'0.85rem', color:'var(--forest)' }}>💡 <strong>Note:</strong> {r.notes}</p>
                      </div>
                    )}

                    <button onClick={() => { setApplying(r.country); setApplySuccess(false); setApplyForm({passport_number:'',travel_date:'',visa_type:'tourist',notes:''}); }}
                      className="btn btn-primary btn-sm">
                      Apply for Visa →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Modal */}
          {applying && (
            <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
              <div style={{ background:'var(--white)', borderRadius:20, padding:'36px 40px', width:'100%', maxWidth:520, boxShadow:'var(--shadow-lg)', maxHeight:'90vh', overflowY:'auto' }}>
                {applySuccess ? (
                  <div style={{ textAlign:'center' }}>
                    <div style={{ width:64, height:64, borderRadius:'50%', background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 20px' }}>✓</div>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', marginBottom:8 }}>Application Submitted!</h3>
                    <p className="text-muted" style={{ marginBottom:24 }}>Your visa application for <strong>{applying}</strong> has been submitted. Track progress in My Account.</p>
                    <button onClick={() => setApplying(null)} className="btn btn-primary">Done</button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', marginBottom:4 }}>Apply for {applying} Visa</h3>
                    <p className="text-muted" style={{ fontSize:'0.85rem', marginBottom:24 }}>Fill in your details to submit your visa application.</p>

                    {!user && <div className="alert alert-info">Please sign in to submit a visa application.</div>}

                    <div className="form-group">
                      <label className="form-label">Passport Number *</label>
                      <input value={applyForm.passport_number} onChange={e => setApplyForm({...applyForm, passport_number:e.target.value})}
                        className="form-control" placeholder="A1234567" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Visa Type</label>
                        <select value={applyForm.visa_type} onChange={e => setApplyForm({...applyForm, visa_type:e.target.value})} className="form-control">
                          {['tourist','business','transit','student'].map(v => <option key={v} value={v} style={{ textTransform:'capitalize' }}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Intended Travel Date</label>
                        <input type="date" value={applyForm.travel_date} onChange={e => setApplyForm({...applyForm, travel_date:e.target.value})} className="form-control" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Additional Notes</label>
                      <textarea value={applyForm.notes} onChange={e => setApplyForm({...applyForm, notes:e.target.value})}
                        className="form-control" rows={3} placeholder="Any special circumstances or notes…" style={{ resize:'vertical' }} />
                    </div>

                    {applyError && <div className="alert alert-error">{applyError}</div>}

                    <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:8 }}>
                      <button onClick={() => setApplying(null)} className="btn btn-outline">Cancel</button>
                      <button onClick={handleApply} className="btn btn-primary" disabled={!user}>Submit Application</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Info Cards */}
          {!searched && (
            <div className="grid-3" style={{ marginTop:8 }}>
              {[
                { icon:'🌍', title:'120+ Countries', desc:'Visa information and entry requirements for destinations worldwide, updated regularly.' },
                { icon:'⚡', title:'Fast Processing',   desc:'We partner with embassies and official channels to expedite your visa applications.' },
                { icon:'📋', title:'Document Checklist', desc:'Know exactly what you need before applying — our checklists save you from rejections.' },
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

export default Visa;
