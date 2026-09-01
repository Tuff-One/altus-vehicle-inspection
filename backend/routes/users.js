const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();

async function requesterCanManageBossAccounts(roleId) {
  const [rows] = await db.query(
    `SELECT 1 FROM role_permissions rp
     JOIN permissions p ON rp.permission_id = p.id
     WHERE rp.role_id = ? AND p.name = 'manage_boss_accounts'`,
    [roleId]
  );
  return rows.length > 0;
}

router.get('/', verifyToken, checkPermission('manage_users'), async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id, u.name, u.email, u.is_active, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.name`
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.post('/', verifyToken, checkPermission('manage_users'), async (req, res) => {
  const { name, email, password, role_id } = req.body;

  if (!name || !email || !password || !role_id) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  try {
    const [[role]] = await db.query('SELECT name FROM roles WHERE id = ?', [role_id]);
    if (!role) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    if (['admin', 'boss'].includes(role.name)) {
      const allowed = await requesterCanManageBossAccounts(req.user.role_id);
      if (!allowed) {
        return res.status(403).json({ error: 'You are not allowed to create an account with this role.' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role_id]
    );

    res.status(201).json({ message: 'User created.', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.delete('/:id', verifyToken, checkPermission('manage_users'), async (req, res) => {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot deactivate your own account.' });
  }

  try {
    const [[targetUser]] = await db.query(
      `SELECT u.id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [id]
    );

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (['admin', 'boss'].includes(targetUser.role_name)) {
      const allowed = await requesterCanManageBossAccounts(req.user.role_id);
      if (!allowed) {
        return res.status(403).json({ error: 'You are not allowed to deactivate this account.' });
      }
    }

    await db.query('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'User deactivated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.patch('/:id/reactivate', verifyToken, checkPermission('manage_users'), async (req, res) => {
  const { id } = req.params;

  try {
    const [[targetUser]] = await db.query(
      `SELECT u.id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [id]
    );

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (['admin', 'boss'].includes(targetUser.role_name)) {
      const allowed = await requesterCanManageBossAccounts(req.user.role_id);
      if (!allowed) {
        return res.status(403).json({ error: 'You are not allowed to reactivate this account.' });
      }
    }

    await db.query('UPDATE users SET is_active = 1 WHERE id = ?', [id]);
    res.json({ message: 'User reactivated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;