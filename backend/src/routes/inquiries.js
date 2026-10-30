const router = require('express').Router();
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const USER_TYPES = ['Parent', 'Student', 'School'];
const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];
const STATUSES = ['New', 'In Progress', 'Resolved'];

// PUBLIC: submit inquiry
router.post('/', async (req, res) => {
  const { user_type, category, name, email, phone, message } = req.body || {};

  if (!USER_TYPES.includes(user_type)) return res.status(400).json({ error: 'Invalid user type' });
  if (!CATEGORIES.includes(category)) return res.status(400).json({ error: 'Invalid category' });
  if (!name?.trim() || !message?.trim()) return res.status(400).json({ error: 'Name and message required' });
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return res.status(400).json({ error: 'Invalid email' });
  if (!/^[+]?[\d\s-]{7,15}$/.test(phone || '')) return res.status(400).json({ error: 'Invalid phone' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO inquiries (user_type, category, name, email, phone, message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, created_at`,
      [user_type, category, name.trim(), email.trim().toLowerCase(), phone.trim(), message.trim()]
    );
    res.status(201).json({ message: 'Inquiry submitted', ...rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PROTECTED: list with filters + search
router.get('/', requireAuth, async (req, res) => {
  const { category, user_type, search } = req.query;
  const where = [];
  const params = [];

  if (category) { params.push(category); where.push(`category = $${params.length}`); }
  if (user_type) { params.push(user_type); where.push(`user_type = $${params.length}`); }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length})`);
  }

  const sql = `SELECT * FROM inquiries
               ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
               ORDER BY created_at DESC`;
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PROTECTED: update status
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const { rows } = await pool.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;