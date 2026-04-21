require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');

const authRoutes      = require('./routes/auth');
const packagesRoutes  = require('./routes/packages');
const transportRoutes = require('./routes/transport');
const bookingRoutes   = require('./routes/booking');
const paymentRoutes   = require('./routes/payment');
const visaRoutes      = require('./routes/visa');
const aiRoutes        = require('./routes/ai');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests. Please try again later.' } });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { success: false, message: 'Too many AI requests. Please wait a minute.' } });
app.use(limiter);

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/packages',  packagesRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/visa',      visaRoutes);
app.use('/api/ai',        aiLimiter, aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Wanderlust API is running 🌍', version: '1.0.0', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Wanderlust API running on http://localhost:${PORT}`);
  console.log(`📖 Health: http://localhost:${PORT}/api/health\n`);
});
