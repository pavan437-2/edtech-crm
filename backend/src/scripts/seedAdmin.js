require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../db');

(async () => {
  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await pool.query(
    'INSERT INTO admins (email, password_hash) VALUES ($1,$2) ON CONFLICT (email) DO NOTHING',
    [email, hash]
  );
  console.log('Admin ready:', email);
  await pool.end();
})();