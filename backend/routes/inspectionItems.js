const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM inspection_items WHERE is_active = 1 ORDER BY name'
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;