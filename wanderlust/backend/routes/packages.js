const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET all packages (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, min_price, max_price, duration, featured, search, sort = 'created_at', order = 'DESC' } = req.query;
    let sql = `SELECT tp.*, d.name AS destination_name, d.country FROM tour_packages tp
               LEFT JOIN destinations d ON tp.destination_id = d.id
               WHERE tp.is_active = TRUE`;
    const params = [];

    if (category)   { sql += ' AND tp.category = ?';                    params.push(category); }
    if (min_price)  { sql += ' AND tp.price_per_person >= ?';            params.push(+min_price); }
    if (max_price)  { sql += ' AND tp.price_per_person <= ?';            params.push(+max_price); }
    if (duration)   { sql += ' AND tp.duration_days <= ?';               params.push(+duration); }
    if (featured === 'true') { sql += ' AND tp.is_featured = TRUE'; }
    if (search)     { sql += ' AND (tp.title LIKE ? OR d.name LIKE ?)';  params.push(`%${search}%`, `%${search}%`); }

    const allowedSort = ['price_per_person','rating','duration_days','created_at'];
    const safeSort = allowedSort.includes(sort) ? sort : 'created_at';
    sql += ` ORDER BY tp.${safeSort} ${order === 'ASC' ? 'ASC' : 'DESC'}`;

    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, packages: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET single package
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tp.*, d.name AS destination_name, d.country, d.description AS destination_desc,
              d.avg_temp_celsius, d.best_months
       FROM tour_packages tp
       LEFT JOIN destinations d ON tp.destination_id = d.id
       WHERE tp.id = ? AND tp.is_active = TRUE`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Package not found.' });

    const [reviews] = await db.query(
      `SELECT r.*, u.full_name, u.avatar_url FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.package_id = ? ORDER BY r.created_at DESC LIMIT 10`,
      [req.params.id]
    );
    res.json({ success: true, package: rows[0], reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET destinations
router.get('/meta/destinations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM destinations ORDER BY name');
    res.json({ success: true, destinations: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST review (protected)
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, title, body } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be 1-5.' });
  try {
    await db.query(
      'INSERT INTO reviews (user_id, package_id, rating, title, body) VALUES (?,?,?,?,?)',
      [req.user.id, req.params.id, rating, title, body]
    );
    // Update avg rating
    await db.query(
      'UPDATE tour_packages SET rating=(SELECT AVG(rating) FROM reviews WHERE package_id=?), review_count=(SELECT COUNT(*) FROM reviews WHERE package_id=?) WHERE id=?',
      [req.params.id, req.params.id, req.params.id]
    );
    res.status(201).json({ success: true, message: 'Review submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
