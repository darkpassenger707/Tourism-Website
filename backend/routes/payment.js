const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();

// POST initiate payment
router.post('/', auth, async (req, res) => {
  const { booking_id, method, currency = 'USD' } = req.body;
  if (!booking_id || !method) return res.status(400).json({ success: false, message: 'booking_id and method are required.' });

  try {
    // Verify booking belongs to user
    const [[booking]] = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [booking_id, req.user.id]
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Booking is cancelled.' });

    // Simulate payment gateway (In production, integrate Stripe/Razorpay)
    const transaction_id = 'TXN-' + uuidv4().toUpperCase().replace(/-/g,'').slice(0, 12);
    const paymentSuccess = Math.random() > 0.05; // 95% success simulation

    const status = paymentSuccess ? 'success' : 'failed';
    const [result] = await db.query(
      `INSERT INTO payments (booking_id, amount, currency, method, status, transaction_id, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [booking_id, booking.total_amount, currency, method, status, transaction_id, paymentSuccess ? new Date() : null]
    );

    if (paymentSuccess) {
      await db.query("UPDATE bookings SET status = 'confirmed' WHERE id = ?", [booking_id]);
    }

    res.json({
      success: paymentSuccess,
      payment_id: result.insertId,
      transaction_id,
      status,
      amount: booking.total_amount,
      currency,
      message: paymentSuccess ? 'Payment successful! Your booking is confirmed.' : 'Payment failed. Please try again.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET payment history
router.get('/history', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, b.booking_ref, tp.title AS package_title
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN tour_packages tp ON b.package_id = tp.id
       WHERE b.user_id = ? ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, payments: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
