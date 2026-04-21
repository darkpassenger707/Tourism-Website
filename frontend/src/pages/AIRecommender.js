import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const INTERESTS = ['Beaches','Temples & Culture','Wildlife','Adventure Sports','Food & Cuisine','Art & Museums','Nightlife','Wellness & Spa','Photography','Hiking','History','Luxury Shopping'];
const CLIMATES  = ['Tropical','Mediterranean','Alpine / Cold','Desert','Temperate','Any'];
const STYLES    = ['Relaxed & Slow','Balanced Mix','Action Packed','Off-the-Beaten-Path','Luxury','Backpacker Budget'];
const GROUPS    = ['Solo','Couple','Family with Kids','Group of Friends','Honeymoon','Corporate'];

const AIRecommender = () => {
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError]   = useState('');
  const [form, setForm]     = useState({
    budget: '', duration: '', interests: [], climate: 'Any',
    travel_style: 'Balanced Mix', group_type: 'Couple', from_country: 'India',
  });

  const toggleInterest = (i) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x=>x!==i) : [...f.interests, i],
    }));
  };

  const handleSubmit = async () => {
    if (!form.budget || !form.duration || form.interests.length === 0) {
      setError('Please fill in budget, duration, and at least one interest.');
      return;
    }
    setError(''); setLoading(true); setResults(null);
    try {
      const { data } = await axios.post('/api/ai/recommend', {
        ...form, interests: form.interests.join(', '),
      });
      setResults(data);
      setStep(3);
    } catch {
      setError('AI service is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header" style={{ backgroundImage:'none', background:'linear-gradient(160deg, #0f2419 0%, var(--forest) 60%, #1a4a3a 100%)' }}>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(200,169,110,0.15)', border:'1px solid rgba(200,169,110,0.3)', borderRadius:24, padding:'8px 18px', marginBottom:24 }}>
            <span style={{ fontSize:'1.2rem' }}>✦</span>
            <span style={{ fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.15em', color:'var(--gold)', textTransform:'uppercase' }}>Powered by AI</span>
          </div>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>Your Personal AI Travel Guide</h1>
          <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:520, margin:'0 auto' }}>
            Answer a few questions and our AI will craft three perfect destination recommendations which are uniquely tailored to you.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container" style={{ maxWidth:860 }}>

          {/* Progress Steps */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:56 }}>
            {[
              { n:1, label:'Your Profile' },
              { n:2, label:'Preferences' },
              { n:3, label:'Recommendations' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <div style={{
                    width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:700, fontSize:'0.9rem', transition:'all 0.3s',
                    background: step >= s.n ? 'var(--forest)' : 'var(--cream-dk)',
                    color: step >= s.n ? 'var(--white)' : 'var(--muted)',
                    boxShadow: step === s.n ? '0 4px 16px rgba(26,58,42,0.3)' : 'none',
                  }}>{step > s.n ? '✓' : s.n}</div>
                  <span style={{ fontSize:'0.75rem', fontWeight:500, color: step >= s.n ? 'var(--forest)' : 'var(--muted)', whiteSpace:'nowrap' }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex:1, height:1, background: step > s.n ? 'var(--forest)' : 'var(--cream-dk)', margin:'0 12px', marginBottom:24, transition:'all 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="card" style={{ padding:'40px 48px' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:8 }}>Tell us about your trip</h2>
              <p className="text-muted" style={{ marginBottom:32 }}>Basic details to help us personalize your recommendations.</p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Budget (USD per person)</label>
                  <input type="number" value={form.budget} onChange={e => setForm({...form, budget:e.target.value})}
                    className="form-control" placeholder="e.g. 2000" />
                  <p style={{ fontSize:'0.75rem', color:'var(--muted)', marginTop:6 }}>Total budget excluding flights from home.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Trip Duration (Days)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({...form, duration:e.target.value})}
                    className="form-control" placeholder="e.g. 10" min={1} max={90} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Traveling From (Country)</label>
                  <input value={form.from_country} onChange={e => setForm({...form, from_country:e.target.value})}
                    className="form-control" placeholder="India" />
                </div>
                <div className="form-group">
                  <label className="form-label">Group Type</label>
                  <select value={form.group_type} onChange={e => setForm({...form, group_type:e.target.value})} className="form-control">
                    {GROUPS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
                <button onClick={() => { if(!form.budget||!form.duration){setError('Please fill budget and duration.');return;} setError(''); setStep(2); }}
                  className="btn btn-primary btn-lg">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="card" style={{ padding:'40px 48px' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:8 }}>What excites you?</h2>
              <p className="text-muted" style={{ marginBottom:32 }}>Select your interests and travel style to refine AI recommendations.</p>

              <div className="form-group">
                <label className="form-label">Interests (select all that apply)</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:8 }}>
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      style={{
                        padding:'9px 16px', borderRadius:20, fontSize:'0.84rem', cursor:'pointer', transition:'all 0.2s',
                        background: form.interests.includes(i) ? 'var(--forest)' : 'var(--cream-dk)',
                        color: form.interests.includes(i) ? 'var(--white)' : 'var(--ink)',
                        border:`1.5px solid ${form.interests.includes(i) ? 'var(--forest)' : 'var(--cream-dk)'}`,
                        fontWeight: form.interests.includes(i) ? 600 : 400,
                      }}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row" style={{ marginTop:8 }}>
                <div className="form-group">
                  <label className="form-label">Preferred Climate</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
                    {CLIMATES.map(c => (
                      <button key={c} onClick={() => setForm({...form, climate:c})}
                        style={{ padding:'8px 14px', borderRadius:20, fontSize:'0.82rem', cursor:'pointer', transition:'all 0.2s',
                          background: form.climate===c ? 'var(--gold)' : 'var(--white)',
                          color: form.climate===c ? 'var(--forest)' : 'var(--muted)',
                          border:`1.5px solid ${form.climate===c ? 'var(--gold)' : 'var(--cream-dk)'}`,
                          fontWeight: form.climate===c ? 600 : 400 }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Travel Style</label>
                  <select value={form.travel_style} onChange={e => setForm({...form, travel_style:e.target.value})} className="form-control">
                    {STYLES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div style={{ display:'flex', justifyContent:'space-between', marginTop:16 }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                <button onClick={handleSubmit} className="btn btn-gold btn-lg" disabled={loading}>
                  {loading ? '✦ AI Thinking…' : '✦ Get My Recommendations'}
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', border:'3px solid var(--cream-dk)', borderTopColor:'var(--forest)', animation:'spin 0.8s linear infinite', margin:'0 auto 24px' }} />
              <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>Our AI is crafting your journey…</h3>
              <p className="text-muted">Analyzing 120+ destinations for your perfect match.</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* STEP 3 — Results */}
          {step === 3 && results && !loading && (
            <div className="anim-fade-up">
              <div style={{ textAlign:'center', marginBottom:40 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#e8f5e9', border:'1px solid #a5d6a7', borderRadius:24, padding:'10px 20px', marginBottom:24 }}>
                  <span>✅</span>
                  <span style={{ fontSize:'0.85rem', color:'#2e7d32', fontWeight:600 }}>AI Recommendations Ready</span>
                </div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', marginBottom:12 }}>Your Perfect Destinations</h2>
                <p style={{ color:'var(--muted)', maxWidth:520, margin:'0 auto' }}>{results.summary}</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
                {(results.recommendations || []).map((rec, i) => (
                  <div key={i} className="card" style={{ padding:0, overflow:'hidden', border: i===0 ? '2px solid var(--gold)' : 'none' }}>
                    {i === 0 && (
                      <div style={{ background:'var(--gold)', padding:'8px 24px', display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontWeight:700, fontSize:'0.82rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--forest)' }}>✦ Top Pick for You — {rec.match_score}% Match</span>
                      </div>
                    )}
                    <div style={{ padding:'28px 32px' }}>
                      <div style={{ display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
                        <div style={{ fontSize:'3rem' }}>{rec.emoji}</div>
                        <div style={{ flex:1, minWidth:220 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:6 }}>
                            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>#{rec.rank} {rec.destination}</h3>
                            <span style={{ background:'var(--cream-dk)', padding:'4px 12px', borderRadius:20, fontSize:'0.75rem', color:'var(--muted)', fontWeight:500 }}>{rec.country}</span>
                            {i > 0 && <span style={{ background:'var(--cream-dk)', padding:'4px 12px', borderRadius:20, fontSize:'0.75rem', color:'var(--muted)' }}>{rec.match_score}% match</span>}
                          </div>
                          <p style={{ fontSize:'0.92rem', color:'#555', lineHeight:1.7, marginBottom:20 }}>{rec.why_perfect}</p>

                          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12, marginBottom:20 }}>
                            <div style={{ background:'var(--cream-dk)', borderRadius:10, padding:16 }}>
                              <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>Best Time</div>
                              <div style={{ fontWeight:600, fontSize:'0.9rem' }}>🗓 {rec.best_time}</div>
                            </div>
                            <div style={{ background:'var(--cream-dk)', borderRadius:10, padding:16 }}>
                              <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>Daily Budget</div>
                              <div style={{ fontWeight:600, fontSize:'0.9rem' }}>💰 {rec.daily_budget?.total}</div>
                            </div>
                          </div>

                          <div style={{ marginBottom:16 }}>
                            <div style={{ fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:10 }}>Top Activities</div>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                              {(rec.top_activities||[]).map((a,j) => (
                                <span key={j} style={{ background:'var(--forest)', color:'var(--white)', padding:'6px 14px', borderRadius:20, fontSize:'0.8rem' }}>{a}</span>
                              ))}
                            </div>
                          </div>

                          <div style={{ background:'rgba(200,169,110,0.1)', border:'1px solid rgba(200,169,110,0.3)', borderRadius:10, padding:14, display:'flex', gap:10 }}>
                            <span>💡</span>
                            <p style={{ fontSize:'0.85rem', color:'var(--forest)', fontStyle:'italic', margin:0 }}><strong>Insider tip:</strong> {rec.insider_tip}</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display:'flex', gap:12, marginTop:24, flexWrap:'wrap' }}>
                        <Link to={`/packages?search=${rec.destination}`} className="btn btn-primary btn-sm">View Packages →</Link>
                        <Link to={`/visa?country=${rec.country}`} className="btn btn-outline btn-sm">Visa Info</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign:'center', marginTop:40 }}>
                <button onClick={() => { setStep(1); setResults(null); setForm({budget:'',duration:'',interests:[],climate:'Any',travel_style:'Balanced Mix',group_type:'Couple',from_country:'India'}); }}
                  className="btn btn-outline">
                  ← Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AIRecommender;
