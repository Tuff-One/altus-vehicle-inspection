const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();

router.get('/outstanding-issues', verifyToken, checkPermission('view_reports'), async (req, res) => {
  try {
    const [issues] = await db.query(`
      SELECT v.name AS vehicle_name, ii.name AS item_name, ir.status, ir.comment, i.inspection_date
      FROM inspection_results ir
      JOIN inspections i ON ir.inspection_id = i.id
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN inspection_items ii ON ir.inspection_item_id = ii.id
      WHERE ir.status IN ('faulty', 'needs_attention')
      ORDER BY i.inspection_date DESC
    `);
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;