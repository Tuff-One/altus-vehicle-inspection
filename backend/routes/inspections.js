const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { vehicle_id, inspection_date, inspection_time, overall_status, comments, results } = req.body;

  if (!vehicle_id || !inspection_date || !inspection_time || !overall_status || !results?.length) {
    return res.status(400).json({ error: 'Missing required inspection fields.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [inspectionResult] = await connection.query(
      `INSERT INTO inspections (vehicle_id, inspector_id, inspection_date, inspection_time, overall_status, comments)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicle_id, req.user.id, inspection_date, inspection_time, overall_status, comments || null]
    );

    const inspectionId = inspectionResult.insertId;

    for (const item of results) {
      await connection.query(
        `INSERT INTO inspection_results (inspection_id, inspection_item_id, status, comment)
         VALUES (?, ?, ?, ?)`,
        [inspectionId, item.inspection_item_id, item.status, item.comment || null]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Inspection created.', inspectionId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  } finally {
    connection.release();
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    let query = `
      SELECT i.*, v.name AS vehicle_name, u.name AS inspector_name
      FROM inspections i
      JOIN vehicles v ON i.vehicle_id = v.id
      JOIN users u ON i.inspector_id = u.id
    `;
    const params = [];

    if (req.user.role_id === 4) {
      query += ' WHERE i.inspector_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY i.inspection_date DESC, i.inspection_time DESC';

    const [inspections] = await db.query(query, params);
    res.json(inspections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;