const express = require('express');
const db      = require('../db');

const router = express.Router();

// GET transport options
router.get('/', async (req, res) => {
  try {
    const { type, origin, destination, date } = req.query;
    let sql = 'SELECT * FROM transport_options WHERE is_active = TRUE';
    const params = [];

    if (type)        { sql += ' AND type = ?';                         params.push(type); }
    if (origin)      { sql += ' AND origin LIKE ?';                    params.push(`%${origin}%`); }
    if (destination) { sql += ' AND destination LIKE ?';               params.push(`%${destination}%`); }
    if (date)        { sql += ' AND DATE(departure_datetime) = ?';     params.push(date); }

    sql += ' ORDER BY price ASC';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, transport: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET transport types summary
router.get('/types', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT type, COUNT(*) as count, MIN(price) as min_price, MAX(price) as max_price
       FROM transport_options WHERE is_active = TRUE GROUP BY type`
    );
    res.json({ success: true, types: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
