const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();

// Helper: generate booking ref
const genRef = () => 'WL-' + uuidv4().toUpperCase().replace(/-/g,'').slice(0,8);

// POST create booking
router.post('/', auth, async (req, res) => {
  const { package_id, transport_id, check_in_date, check_out_date, num_adults, num_children, special_requests } = req.body;
  if (!check_in_date) return res.status(400).json({ success: false, message: 'Check-in date is required.' });

  try {
    // Calculate total
    let total = 0;
    const guests = (+num_adults || 1) + (+num_children || 0) * 0.5;

    if (package_id) {
      const [[pkg]] = await db.query('SELECT price_per_person FROM tour_packages WHERE id = ?', [package_id]);
      if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
      total += pkg.price_per_person * guests;
    }
    if (transport_id) {
      const [[t]] = await db.query('SELECT price FROM transport_options WHERE id = ?', [transport_id]);
      if (!t) return res.status(404).json({ success: false, message: 'Transport not found.' });
      total += t.price * (+num_adults || 1);
    }

    const booking_ref = genRef();
    const [result] = await db.query(
      `INSERT INTO bookings (booking_ref, user_id, package_id, transport_id, check_in_date, check_out_date, num_adults, num_children, total_amount, special_requests)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [booking_ref, req.user.id, package_id||null, transport_id||null, check_in_date, check_out_date||null, num_adults||1, num_children||0, total, special_requests||null]
    );
    res.status(201).json({ success: true, booking_id: result.insertId, booking_ref, total_amount: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET user bookings
router.get('/my', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, tp.title AS package_title, tp.image_url, d.name AS destination, d.country
       FROM bookings b
       LEFT JOIN tour_packages tp ON b.package_id = tp.id
       LEFT JOIN destinations d ON tp.destination_id = d.id
       WHERE b.user_id = ? ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, bookings: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET single booking
router.get('/:ref', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, tp.title AS package_title, tp.image_url, tp.duration_days,
              d.name AS destination, d.country, p.status AS payment_status, p.amount AS paid_amount
       FROM bookings b
       LEFT JOIN tour_packages tp ON b.package_id = tp.id
       LEFT JOIN destinations d ON tp.destination_id = d.id
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.booking_ref = ? AND b.user_id = ?`,
      [req.params.ref, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, booking: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status != 'completed'",
      [req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(400).json({ success: false, message: 'Cannot cancel this booking.' });
    res.json({ success: true, message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
