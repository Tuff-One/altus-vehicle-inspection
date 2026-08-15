const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const [vehicles] = await db.query('SELECT * FROM vehicles ORDER BY name');
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const checkPermission = require('../middleware/checkPermission');

router.post('/', verifyToken, checkPermission('manage_vehicles'), async (req, res) => {
  const { name, type, registration_number, vin, current_mileage, department, status, disk_expiry_date } = req.body;

  if (!name || !type || !registration_number) {
    return res.status(400).json({ error: 'Name, type, and registration number are required.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO vehicles (name, type, registration_number, vin, current_mileage, department, status, disk_expiry_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, type, registration_number, vin || null, current_mileage || 0, department || null, status || 'active', disk_expiry_date || null]
    );

    res.status(201).json({ message: 'Vehicle added.', vehicleId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;