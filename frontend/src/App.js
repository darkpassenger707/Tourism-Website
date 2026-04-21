import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TourPackages from './pages/TourPackages';
import Transport from './pages/Transport';
import AIRecommender from './pages/AIRecommender';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Visa from './pages/Visa';
import AccountDetails from './pages/AccountDetails';
import './styles/global.css';

// Layout wrapper — adds top padding on non-home pages
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <main style={{ minHeight:'100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/packages"      element={<TourPackages />} />
            <Route path="/transport"     element={<Transport />} />
            <Route path="/ai-recommender" element={<AIRecommender />} />
            <Route path="/booking"       element={<Booking />} />
            <Route path="/payment"       element={<Payment />} />
            <Route path="/visa"          element={<Visa />} />
            <Route path="/account"       element={<AccountDetails />} />
            <Route path="*" element={
              <div style={{ textAlign:'center', padding:'200px 24px' }}>
                <div style={{ fontSize:'5rem', marginBottom:24 }}>🗺️</div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', marginBottom:16 }}>Page Not Found</h2>
                <p style={{ color:'var(--muted)', marginBottom:32 }}>Looks like this destination doesn't exist.</p>
                <a href="/" className="btn btn-primary">Back to Home</a>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
