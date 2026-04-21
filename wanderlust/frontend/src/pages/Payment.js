import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PAYMENT_METHODS = [
  { id:'card',       icon:'💳', label:'Credit / Debit Card' },
  { id:'upi',        icon:'📱', label:'UPI' },
  { id:'netbanking', icon:'🏦', label:'Net Banking' },
  { id:'wallet',     icon:'👜', label:'Mobile Wallet' },
  { id:'emi',        icon:'📅', label:'EMI (0% interest)' },
];

const Payment = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  const amount    = searchParams.get('amount') || '0';
  const { user }  = useAuth();

  const [method, setMethod]     = useState('card');
  const [processing, setProcessing] = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');

  const [card, setCard] = useState({ number:'', name:'', expiry:'', cvv:'' });
  const [upi, setUpi]   = useState('');
  const [bank, setBank] = useState('');

  const formatCard = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v) => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=3 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  const handlePay = async () => {
    if (!user) { setError('Please sign in to complete payment.'); return; }
    if (!bookingId) { setError('No booking found. Please start over.'); return; }
    setError(''); setProcessing(true);
    try {
      const { data } = await axios.post('/api/payments', { booking_id: +bookingId, method, currency:'USD' });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream)', paddingTop:80 }}>
        <div style={{ textAlign:'center', maxWidth:500, padding:'60px 40px', background:'var(--white)', borderRadius:24, boxShadow:'var(--shadow-lg)' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background: result.success ? '#e8f5e9' : '#fce4ec', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 24px' }}>
            {result.success ? '✓' : '✗'}
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color: result.success ? 'var(--forest)' : '#c62828', marginBottom:12 }}>
            {result.success ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p style={{ color:'var(--muted)', marginBottom:24 }}>{result.message}</p>
          {result.success && (
            <div style={{ background:'var(--cream-dk)', borderRadius:12, padding:'16px 24px', marginBottom:24, textAlign:'left' }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span style={{ fontSize:'0.85rem', color:'var(--muted)' }}>Transaction ID</span>
                <span style={{ fontWeight:600, fontSize:'0.82rem', fontFamily:'monospace' }}>{result.transaction_id}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span style={{ fontSize:'0.85rem', color:'var(--muted)' }}>Amount Paid</span>
                <span style={{ fontWeight:700, color:'var(--forest)' }}>${Number(result.amount).toFixed(2)} {result.currency}</span>
              </div>
            </div>
          )}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {result.success ? (
              <>
                <Link to="/account" className="btn btn-primary">View My Bookings →</Link>
                <Link to="/" className="btn btn-outline">Back to Home</Link>
              </>
            ) : (
              <>
                <button onClick={() => setResult(null)} className="btn btn-primary">Try Again</button>
                <Link to="/" className="btn btn-outline">Cancel</Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">Secure Checkout</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>Complete Payment</h1>
          <p style={{ color:'rgba(255,255,255,0.65)' }}>Your data is protected with 256-bit SSL encryption.</p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container" style={{ maxWidth:1040 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:40, alignItems:'start' }}>

            {/* Left */}
            <div>
              {/* Security Badge */}
              <div style={{ display:'flex', gap:12, alignItems:'center', background:'#e8f5e9', border:'1px solid #a5d6a7', borderRadius:12, padding:'12px 18px', marginBottom:28 }}>
                <span style={{ fontSize:'1.4rem' }}>🔒</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.88rem', color:'#2e7d32' }}>Secure Payment Gateway</div>
                  <div style={{ fontSize:'0.78rem', color:'#388e3c' }}>256-bit SSL encrypted · PCI DSS compliant</div>
                </div>
              </div>

              {/* Method Selection */}
              <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-sm)', marginBottom:24 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:20 }}>Payment Method</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} style={{
                      display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
                      borderRadius:10, cursor:'pointer', transition:'all 0.2s',
                      border:`1.5px solid ${method===m.id ? 'var(--forest)' : 'var(--cream-dk)'}`,
                      background: method===m.id ? 'rgba(26,58,42,0.04)' : 'var(--white)',
                    }}>
                      <input type="radio" name="method" value={m.id} checked={method===m.id} onChange={() => setMethod(m.id)} style={{ accentColor:'var(--forest)' }} />
                      <span style={{ fontSize:'1.3rem' }}>{m.icon}</span>
                      <span style={{ fontWeight:500, fontSize:'0.92rem' }}>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Details Form */}
              <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-sm)', marginBottom:24 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:24 }}>
                  {method==='card' ? 'Card Details' : method==='upi' ? 'UPI Details' : method==='netbanking' ? 'Bank Selection' : method==='wallet' ? 'Wallet Details' : 'EMI Details'}
                </h3>

                {method === 'card' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input value={card.number} onChange={e => setCard({...card, number:formatCard(e.target.value)})}
                        className="form-control" placeholder="4242 4242 4242 4242" maxLength={19} style={{ fontFamily:'monospace', letterSpacing:'0.08em' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input value={card.name} onChange={e => setCard({...card, name:e.target.value})}
                        className="form-control" placeholder="As it appears on your card" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input value={card.expiry} onChange={e => setCard({...card, expiry:formatExpiry(e.target.value)})}
                          className="form-control" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input value={card.cvv} onChange={e => setCard({...card, cvv:e.target.value.replace(/\D/g,'').slice(0,4)})}
                          className="form-control" placeholder="•••" type="password" maxLength={4} />
                      </div>
                    </div>
                  </>
                )}

                {method === 'upi' && (
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input value={upi} onChange={e => setUpi(e.target.value)}
                      className="form-control" placeholder="yourname@upi" />
                    <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:6 }}>e.g. name@okaxis, name@ybl, name@paytm</p>
                  </div>
                )}

                {method === 'netbanking' && (
                  <div className="form-group">
                    <label className="form-label">Select Your Bank</label>
                    <select value={bank} onChange={e => setBank(e.target.value)} className="form-control">
                      <option value="">-- Select Bank --</option>
                      {['SBI','HDFC Bank','ICICI Bank','Axis Bank','Kotak Bank','Yes Bank','Punjab National Bank','Bank of Baroda','IndusInd Bank','Canara Bank'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                )}

                {method === 'wallet' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {['Paytm','PhonePe','Google Pay','Amazon Pay','Mobikwik','Freecharge'].map(w => (
                      <button key={w} type="button" style={{ padding:'12px 8px', borderRadius:10, border:'1.5px solid var(--cream-dk)', background:'var(--white)', fontSize:'0.82rem', fontWeight:500, cursor:'pointer', transition:'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--forest)'; e.currentTarget.style.background='rgba(26,58,42,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--cream-dk)'; e.currentTarget.style.background='var(--white)'; }}>
                        {w}
                      </button>
                    ))}
                  </div>
                )}

                {method === 'emi' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {[3,6,9,12,18,24].map(m => (
                      <div key={m} style={{ border:'1.5px solid var(--cream-dk)', borderRadius:10, padding:14, textAlign:'center', cursor:'pointer' }}>
                        <div style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--forest)' }}>{m}</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>months</div>
                        <div style={{ fontSize:'0.8rem', fontWeight:600, marginTop:4 }}>${(+amount/m).toFixed(0)}/mo</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button onClick={handlePay} className="btn btn-primary btn-lg w-full" disabled={processing} style={{ justifyContent:'center', fontSize:'1rem' }}>
                {processing ? '🔄  Processing…' : `🔒  Pay $${Number(amount).toFixed(2)}`}
              </button>

              <p style={{ textAlign:'center', fontSize:'0.78rem', color:'var(--muted)', marginTop:16 }}>
                By completing this payment you agree to our <a href="#!" style={{ color:'var(--forest)', textDecoration:'underline' }}>Terms of Service</a> and <a href="#!" style={{ color:'var(--forest)', textDecoration:'underline' }}>Cancellation Policy</a>.
              </p>
            </div>

            {/* Right: Order Summary */}
            <div style={{ position:'sticky', top:96 }}>
              <div style={{ background:'var(--white)', borderRadius:16, padding:28, boxShadow:'var(--shadow-md)', marginBottom:16 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:20 }}>Order Summary</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem' }}>
                    <span className="text-muted">Booking Reference</span>
                    <span style={{ fontWeight:600 }}>#{bookingId}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem' }}>
                    <span className="text-muted">Payment Method</span>
                    <span style={{ fontWeight:500 }}>{PAYMENT_METHODS.find(m=>m.id===method)?.label}</span>
                  </div>
                  <div style={{ borderTop:'2px solid var(--cream-dk)', paddingTop:14, display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700 }}>Total Due</span>
                    <span style={{ fontWeight:800, fontSize:'1.6rem', color:'var(--forest)', fontFamily:'var(--font-display)' }}>${Number(amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{ background:'var(--cream-dk)', borderRadius:12, padding:20 }}>
                <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', marginBottom:14 }}>Need Help?</h4>
                {['📞 +91 98765 43210','✉️ payments@wanderlust.tours','💬 Live chat (9am–8pm)'].map((t,i) => (
                  <div key={i} style={{ fontSize:'0.83rem', color:'var(--muted)', marginBottom:i<2?8:0 }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Payment;
