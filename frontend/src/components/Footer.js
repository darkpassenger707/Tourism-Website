import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="grid-4" style={{ gap: '48px' }}>
        <div>
          <div className="footer-logo">Wander<span>lust</span></div>
          <p style={{ fontSize:'0.88rem', lineHeight:1.8, marginBottom:24 }}>
            Crafting extraordinary journeys since 2015. We believe travel transforms lives. Let us transform yours.
          </p>
          <div className="social-links">
            {['𝕏','in','f','📷'].map((s,i) => (
              <a key={i} href="#!" className="social-link">{s}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h5>Explore</h5>
          <ul>
            {[['Tour Packages','/packages'],['AI Recommender','/ai-recommender'],['Transport','/transport'],['Visa Services','/visa'],['Special Offers','/packages?category=budget']].map(([label,to]) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            {['About Us','Careers','Press','Blog','Sustainability','Partners'].map(l => (
              <li key={l}><a href="#!">{l}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <ul style={{ gap:14 }}>
            <li style={{ fontSize:'0.85rem' }}>📍 42 Travel Lane, Mumbai 400021</li>
            <li style={{ fontSize:'0.85rem' }}>📞 +91 98765 43210</li>
            <li style={{ fontSize:'0.85rem' }}>✉️ talk2@wanderlust.tours</li>
            <li style={{ fontSize:'0.85rem' }}>🕐 Mon–Sat 9am–8pm IST</li>
          </ul>
          <div style={{ marginTop:20 }}>
            <p style={{ fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:12 }}>Newsletter</p>
            <div style={{ display:'flex', gap:0 }}>
              <input placeholder="your@email.com" style={{ flex:1, padding:'10px 14px', borderRadius:'8px 0 0 8px', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:'0.85rem' }} />
              <button style={{ padding:'10px 16px', background:'var(--gold)', color:'var(--forest)', fontWeight:600, fontSize:'0.8rem', borderRadius:'0 8px 8px 0' }}>→</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Wanderlust Tours. All rights reserved.</p>
        <div style={{ display:'flex', gap:24 }}>
          {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
            <a key={l} href="#!" style={{ fontSize:'0.82rem', transition:'color 0.3s' }}
              onMouseEnter={e => e.target.style.color='var(--gold)'}
              onMouseLeave={e => e.target.style.color=''}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
