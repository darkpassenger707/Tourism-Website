const express = require('express');
const db      = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET visa requirements
router.get('/requirements', async (req, res) => {
  try {
    const { country, nationality } = req.query;
    let sql = 'SELECT * FROM visa_requirements WHERE 1=1';
    const params = [];
    if (country)     { sql += ' AND country LIKE ?';     params.push(`%${country}%`); }
    if (nationality) { sql += ' AND nationality LIKE ?'; params.push(`%${nationality}%`); }
    sql += ' ORDER BY country';
    const [rows] = await db.query(sql, params);
    res.json({ success: true, requirements: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET all countries list
router.get('/countries', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT country FROM visa_requirements ORDER BY country');
    res.json({ success: true, countries: rows.map(r => r.country) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET user visa applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM visa_applications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, applications: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST submit visa application
router.post('/apply', auth, async (req, res) => {
  const { destination_country, visa_type, passport_number, travel_date, documents_submitted, notes } = req.body;
  if (!destination_country || !passport_number)
    return res.status(400).json({ success: false, message: 'Destination country and passport number are required.' });

  try {
    const [result] = await db.query(
      `INSERT INTO visa_applications (user_id, destination_country, visa_type, passport_number, travel_date, status, documents_submitted, notes, applied_at)
       VALUES (?, ?, ?, ?, ?, 'submitted', ?, ?, NOW())`,
      [req.user.id, destination_country, visa_type || 'tourist', passport_number,
       travel_date || null, JSON.stringify(documents_submitted || []), notes || null]
    );
    res.status(201).json({ success: true, application_id: result.insertId, message: 'Visa application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
