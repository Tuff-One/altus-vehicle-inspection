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

module.exports = router;