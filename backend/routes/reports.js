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

router.get('/overdue-vehicles', verifyToken, checkPermission('view_reports'), async (req, res) => {
  try {
    const [vehicles] = await db.query(`
      SELECT v.id, v.name, MAX(i.inspection_date) AS last_inspection_date,
        DATEDIFF(CURDATE(), MAX(i.inspection_date)) AS days_since_inspection
      FROM vehicles v
      LEFT JOIN inspections i ON v.id = i.vehicle_id
      GROUP BY v.id, v.name
      HAVING last_inspection_date IS NULL OR days_since_inspection > 30
      ORDER BY days_since_inspection DESC
    `);
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.get('/recurring-issues', verifyToken, checkPermission('view_reports'), async (req, res) => {
  try {
    const [issues] = await db.query(`
      SELECT v.name AS vehicle_name, ii.name AS item_name, COUNT(*) AS times_flagged
      FROM inspection_results ir
      JOIN inspections i ON ir.inspection_id = i.id
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN inspection_items ii ON ir.inspection_item_id = ii.id
      WHERE ir.status IN ('faulty', 'needs_attention')
      GROUP BY v.id, v.name, ii.id, ii.name
      HAVING times_flagged >= 2
      ORDER BY times_flagged DESC
    `);
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.get('/dashboard-stats', verifyToken, checkPermission('view_reports'), async (req, res) => {
  try {
    const [[{ totalVehicles }]] = await db.query("SELECT COUNT(*) AS totalVehicles FROM vehicles WHERE status <> 'inactive'");

    const [[{ openFaults }]] = await db.query(
      `SELECT COUNT(*) AS openFaults FROM inspection_results WHERE status IN ('faulty', 'needs_attention')`
    );

    const [overdueRows] = await db.query(`
      SELECT v.id
      FROM vehicles v
      LEFT JOIN inspections i ON v.id = i.vehicle_id
      GROUP BY v.id
      HAVING MAX(i.inspection_date) IS NULL OR DATEDIFF(CURDATE(), MAX(i.inspection_date)) > 30
    `);

    const [[{ weekCount }]] = await db.query(
      `SELECT COUNT(*) AS weekCount FROM inspections WHERE inspection_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    );

    res.json({
      totalVehicles,
      openFaults,
      overdueCount: overdueRows.length,
      weekCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;