const db = require('../config/db');

function checkPermission(permissionName) {
  return async (req, res, next) => {
    try {
      const [rows] = await db.query(
        `SELECT p.name
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ? AND p.name = ?`,
        [req.user.role_id, permissionName]
      );

      if (rows.length === 0) {
        return res.status(403).json({ error: 'You do not have permission to do this.' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  };
}

module.exports = checkPermission;