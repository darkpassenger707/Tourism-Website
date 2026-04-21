import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AccountDetails = () => {
  const [searchParams] = useSearchParams();
  const { user, login, register, logout, updateUser } = useAuth();
  const [tab, setTab]    = useState(searchParams.get('tab') || (user ? 'profile' : 'login'));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]    = useState({ text:'', type:'' });

  // Login form
  const [loginForm, setLoginForm]       = useState({ email:'', password:'' });
  // Register form
  const [regForm, setRegForm]           = useState({ full_name:'', email:'', password:'', phone:'' });
  // Profile form
  const [profileForm, setProfileForm]   = useState({ full_name:'', phone:'', passport_number:'', nationality:'', date_of_birth:'' });
  // Password form
  const [pwdForm, setPwdForm]           = useState({ current_password:'', new_password:'', confirm:'' });
  // Bookings
  const [bookings, setBookings]         = useState([]);
  const [bookingsLoading, setBL]        = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '', phone: user.phone || '',
        passport_number: user.passport_number || '', nationality: user.nationality || '',
        date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
      });
      if (tab === 'bookings') loadBookings();
    }
  }, [user, tab]);

  const loadBookings = async () => {
    setBL(true);
    try {
      const { data } = await axios.get('/api/bookings/my');
      if (data.success) setBookings(data.bookings);
    } catch { }
    finally { setBL(false); }
  };

  const showMsg = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg({text:'',type:''}), 4000); };

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = await login(loginForm.email, loginForm.password);
      if (data.success) { setTab('profile'); showMsg('Welcome back! You are signed in.'); }
      else showMsg(data.message || 'Invalid credentials.', 'error');
    } catch (err) { showMsg(err.response?.data?.message || 'Login failed.', 'error'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = await register(regForm);
      if (data.success) { setTab('profile'); showMsg('Account created! Welcome to Wanderlust.'); }
      else showMsg(data.message || 'Registration failed.', 'error');
    } catch (err) { showMsg(err.response?.data?.message || 'Registration failed.', 'error'); }
    finally { setLoading(false); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.put('/api/auth/profile', profileForm);
      updateUser(profileForm);
      showMsg('Profile updated successfully!');
    } catch { showMsg('Failed to update profile.', 'error'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.new_password !== pwdForm.confirm) { showMsg('New passwords do not match.', 'error'); return; }
    setLoading(true);
    try {
      await axios.put('/api/auth/change-password', { current_password: pwdForm.current_password, new_password: pwdForm.new_password });
      showMsg('Password changed successfully!');
      setPwdForm({ current_password:'', new_password:'', confirm:'' });
    } catch (err) { showMsg(err.response?.data?.message || 'Failed.', 'error'); }
    finally { setLoading(false); }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.put(`/api/bookings/${id}/cancel`);
      loadBookings();
      showMsg('Booking cancelled.');
    } catch { showMsg('Cannot cancel this booking.', 'error'); }
  };

  // ── Auth UI ────────────────────────────────
  if (!user) return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">Welcome</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:12 }}>
            {tab === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h1>
        </div>
      </div>

      <section className="section-sm">
        <div className="container" style={{ maxWidth:480 }}>
          <div className="card" style={{ padding:'40px 44px' }}>
            {/* Tab Switch */}
            <div style={{ display:'flex', gap:4, background:'var(--cream-dk)', borderRadius:10, padding:4, marginBottom:32 }}>
              {[['login','Sign In'],['register','Create Account']].map(([t,label]) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex:1, padding:'10px 0', borderRadius:8, fontWeight:600, fontSize:'0.88rem',
                  background: tab===t ? 'var(--white)' : 'transparent',
                  color: tab===t ? 'var(--forest)' : 'var(--muted)',
                  boxShadow: tab===t ? 'var(--shadow-sm)' : 'none',
                  transition:'all 0.2s', cursor:'pointer', border:'none',
                }}>{label}</button>
              ))}
            </div>

            {msg.text && <div className={`alert alert-${msg.type==='error'?'error':'success'}`}>{msg.text}</div>}

            {tab === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email:e.target.value})}
                    className="form-control" placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password:e.target.value})}
                    className="form-control" placeholder="Enter your password" required />
                </div>
                <div style={{ textAlign:'right', marginBottom:20 }}>
                  <a href="#!" style={{ fontSize:'0.82rem', color:'var(--forest)', textDecoration:'underline' }}>Forgot password?</a>
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent:'center' }}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input value={regForm.full_name} onChange={e => setRegForm({...regForm, full_name:e.target.value})}
                    className="form-control" placeholder="John Smith" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" value={regForm.email} onChange={e => setRegForm({...regForm, email:e.target.value})}
                    className="form-control" placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input value={regForm.phone} onChange={e => setRegForm({...regForm, phone:e.target.value})}
                    className="form-control" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" value={regForm.password} onChange={e => setRegForm({...regForm, password:e.target.value})}
                    className="form-control" placeholder="At least 6 characters" required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent:'center' }}>
                  {loading ? 'Creating account…' : 'Create Account →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );

  // ── Authenticated UI ────────────────────────
  const accountTabs = [
    { id:'profile',  label:'👤 Profile' },
    { id:'bookings', label:'🧳 My Bookings' },
    { id:'security', label:'🔒 Security' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="section-label">My Account</span>
          <h1 className="display-md" style={{ color:'var(--white)', marginBottom:8 }}>
            Welcome back, {user.full_name?.split(' ')[0]}!
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)' }}>Manage your profile, bookings, and travel documents.</p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container" style={{ maxWidth:1040 }}>
          {msg.text && <div className={`alert alert-${msg.type==='error'?'error':'success'}`} style={{ marginBottom:24 }}>{msg.text}</div>}

          <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:32, alignItems:'start' }}>

            {/* Sidebar */}
            <div>
              {/* Avatar */}
              <div style={{ background:'var(--white)', borderRadius:16, padding:24, boxShadow:'var(--shadow-sm)', marginBottom:16, textAlign:'center' }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--forest)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', fontWeight:800, fontSize:'1.8rem', fontFamily:'var(--font-display)', margin:'0 auto 14px' }}>
                  {user.full_name?.charAt(0)}
                </div>
                <div style={{ fontWeight:700, fontSize:'1.05rem', marginBottom:4 }}>{user.full_name}</div>
                <div style={{ fontSize:'0.8rem', color:'var(--muted)' }}>{user.email}</div>
                <div style={{ marginTop:14, fontSize:'0.75rem', color:'var(--muted)' }}>
                  Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month:'long', year:'numeric' })}
                </div>
              </div>

              {/* Nav */}
              <div style={{ background:'var(--white)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                {accountTabs.map((t, i) => (
                  <button key={t.id} onClick={() => { setTab(t.id); if(t.id==='bookings') loadBookings(); }}
                    style={{
                      display:'block', width:'100%', textAlign:'left', padding:'14px 20px',
                      borderBottom: i < accountTabs.length-1 ? '1px solid var(--cream-dk)' : 'none',
                      background: tab===t.id ? 'var(--cream-dk)' : 'transparent',
                      color: tab===t.id ? 'var(--forest)' : 'var(--muted)',
                      fontWeight: tab===t.id ? 600 : 400, fontSize:'0.9rem',
                      cursor:'pointer', border:'none', transition:'all 0.2s',
                    }}>
                    {t.label}
                  </button>
                ))}
                <button onClick={logout} style={{ display:'block', width:'100%', textAlign:'left', padding:'14px 20px', background:'transparent', color:'#c62828', fontSize:'0.9rem', cursor:'pointer', border:'none', borderTop:'1px solid var(--cream-dk)' }}>
                  🚪 Sign Out
                </button>
              </div>
            </div>

            {/* Main content */}
            <div>

              {/* Profile Tab */}
              {tab === 'profile' && (
                <div style={{ background:'var(--white)', borderRadius:16, padding:32, boxShadow:'var(--shadow-sm)' }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:24 }}>Personal Information</h3>
                  <form onSubmit={handleProfileSave}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name:e.target.value})} className="form-control" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone:e.target.value})} className="form-control" placeholder="+91 98765 43210" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Passport Number</label>
                        <input value={profileForm.passport_number} onChange={e => setProfileForm({...profileForm, passport_number:e.target.value})} className="form-control" placeholder="A1234567" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nationality</label>
                        <input value={profileForm.nationality} onChange={e => setProfileForm({...profileForm, nationality:e.target.value})} className="form-control" placeholder="Indian" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" value={profileForm.date_of_birth} onChange={e => setProfileForm({...profileForm, date_of_birth:e.target.value})} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input value={user.email} disabled className="form-control" style={{ background:'var(--cream-dk)', cursor:'not-allowed' }} />
                      <p style={{ fontSize:'0.75rem', color:'var(--muted)', marginTop:4 }}>Email cannot be changed.</p>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving…' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Bookings Tab */}
              {tab === 'bookings' && (
                <div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:24 }}>My Bookings</h3>
                  {bookingsLoading && <div className="spinner" />}
                  {!bookingsLoading && bookings.length === 0 && (
                    <div style={{ background:'var(--white)', borderRadius:16, padding:48, boxShadow:'var(--shadow-sm)', textAlign:'center' }}>
                      <div style={{ fontSize:'3rem', marginBottom:16 }}>🧳</div>
                      <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', marginBottom:8 }}>No bookings yet</h4>
                      <p className="text-muted" style={{ marginBottom:24 }}>Start planning your next adventure!</p>
                      <Link to="/packages" className="btn btn-primary">Browse Packages →</Link>
                    </div>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {bookings.map(b => (
                      <div key={b.id} style={{ background:'var(--white)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-sm)', display:'flex' }}>
                        {b.image_url && <img src={b.image_url} alt={b.package_title} style={{ width:120, objectFit:'cover' }} />}
                        <div style={{ padding:20, flex:1 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
                            <div>
                              <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:4 }}>{b.package_title || 'Custom Booking'}</h4>
                              <p style={{ fontSize:'0.82rem', color:'var(--muted)' }}>
                                📍 {b.destination}, {b.country} · 🗓 {new Date(b.check_in_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                              </p>
                              <p style={{ fontSize:'0.8rem', color:'var(--muted)', marginTop:4 }}>Ref: <strong style={{ color:'var(--forest)' }}>{b.booking_ref}</strong> · {b.num_adults} Adult{b.num_adults>1?'s':''}{b.num_children>0?` + ${b.num_children} Child`:''}</p>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontSize:'1.3rem', fontWeight:700, color:'var(--forest)', fontFamily:'var(--font-display)' }}>${Number(b.total_amount).toFixed(2)}</div>
                              <span className={`badge ${b.status==='confirmed'?'badge-success':b.status==='cancelled'?'badge-danger':b.status==='completed'?'badge-info':'badge-warning'}`} style={{ marginTop:4 }}>
                                {b.status.charAt(0).toUpperCase()+b.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:10, marginTop:16 }}>
                            {b.status === 'pending' && (
                              <>
                                <Link to={`/payment?booking=${b.id}&amount=${b.total_amount}`} className="btn btn-primary btn-sm">Complete Payment</Link>
                                <button onClick={() => cancelBooking(b.id)} className="btn btn-outline btn-sm" style={{ color:'#c62828', borderColor:'#c62828' }}>Cancel</button>
                              </>
                            )}
                            {b.status === 'confirmed' && <span style={{ fontSize:'0.82rem', color:'#2e7d32' }}>✓ All set! Your adventure is confirmed.</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {tab === 'security' && (
                <div style={{ background:'var(--white)', borderRadius:16, padding:32, boxShadow:'var(--shadow-sm)' }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:8 }}>Change Password</h3>
                  <p className="text-muted" style={{ marginBottom:28, fontSize:'0.88rem' }}>Use a strong, unique password to keep your account safe.</p>
                  <form onSubmit={handlePasswordChange}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input type="password" value={pwdForm.current_password} onChange={e => setPwdForm({...pwdForm, current_password:e.target.value})} className="form-control" required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input type="password" value={pwdForm.new_password} onChange={e => setPwdForm({...pwdForm, new_password:e.target.value})} className="form-control" minLength={6} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm:e.target.value})} className="form-control" required />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Updating…' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountDetails;
