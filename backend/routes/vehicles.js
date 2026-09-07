const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const [vehicles] = await db.query("SELECT * FROM vehicles WHERE status <> 'inactive' ORDER BY name");
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

router.put('/:id', verifyToken, checkPermission('manage_vehicles'), async (req, res) => {
  const { id } = req.params;
  const { name, type, registration_number, vin, current_mileage, department, status, disk_expiry_date } = req.body;

  if (!name || !type || !registration_number) {
    return res.status(400).json({ error: 'Name, type, and registration number are required.' });
  }

  try {
    const [result] = await db.query(
      `UPDATE vehicles
       SET name = ?, type = ?, registration_number = ?, vin = ?, current_mileage = ?, department = ?, status = ?, disk_expiry_date = ?
       WHERE id = ?`,
      [name, type, registration_number, vin || null, current_mileage || 0, department || null, status || 'active', disk_expiry_date || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.json({ message: 'Vehicle updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.delete('/:id', verifyToken, checkPermission('manage_vehicle_status'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE vehicles SET status = ? WHERE id = ?', ['inactive', id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    res.json({ message: 'Vehicle removed.' });
  } catch (err) {
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ error: 'A vehicle with this registration number already exists.' });
  }
  res.status(500).json({ error: 'Something went wrong.' });
}
});

router.get('/inactive', verifyToken, checkPermission('manage_vehicles'), async (req, res) => {
  try {
    const [vehicles] = await db.query("SELECT * FROM vehicles WHERE status = 'inactive' ORDER BY name");
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.patch('/:id/reactivate', verifyToken, checkPermission('manage_vehicle_status'), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("UPDATE vehicles SET status = 'active' WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    res.json({ message: 'Vehicle reactivated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;