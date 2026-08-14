require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function seed() {
  // Step 1: insert roles
  const roles = ['admin', 'boss', 'supervisor', 'driver'];
  for (const role of roles) {
    await db.query('INSERT IGNORE INTO roles (name) VALUES (?)', [role]);
  }

  // Step 2: create one admin user to log in with
  const [adminRole] = await db.query('SELECT id FROM roles WHERE name = ?', ['admin']);
  const adminRoleId = adminRole[0].id;

  const passwordHash = await bcrypt.hash('changeme123', 10);

  await db.query(
    'INSERT IGNORE INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    ['Ope', 'ope@altus.com', passwordHash, adminRoleId]
  );

  // Step 2b: create a driver user with zero permissions, for testing authorization denial
  const [driverRole] = await db.query('SELECT id FROM roles WHERE name = ?', ['driver']);
  const driverRoleId = driverRole[0].id;

  const driverPasswordHash = await bcrypt.hash('driverpass123', 10);

  await db.query(
    'INSERT IGNORE INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    ['Test Driver', 'driver@altus.com', driverPasswordHash, driverRoleId]
  );

// Step 3: insert permissions
  const permissions = [
    'manage_vehicles',
    'manage_inspections',
    'manage_inspection_items',
    'manage_users',
    'manage_boss_accounts',
    'view_reports',
  ];
  for (const perm of permissions) {
    await db.query('INSERT IGNORE INTO permissions (name) VALUES (?)', [perm]);
  }

  // Step 4: map roles to permissions, based on the Phase 3 matrix
  const rolePermissionMap = {
    admin: ['manage_vehicles', 'manage_inspections', 'manage_inspection_items', 'manage_users', 'manage_boss_accounts', 'view_reports'],
    boss: ['manage_vehicles', 'manage_inspections', 'manage_inspection_items', 'manage_users', 'view_reports'],
    supervisor: ['manage_vehicles', 'manage_inspections', 'manage_inspection_items', 'view_reports'],
    driver: [],
  };

  for (const [roleName, permNames] of Object.entries(rolePermissionMap)) {
    const [roleRows] = await db.query('SELECT id FROM roles WHERE name = ?', [roleName]);
    const roleId = roleRows[0].id;

    for (const permName of permNames) {
      const [permRows] = await db.query('SELECT id FROM permissions WHERE name = ?', [permName]);
      const permId = permRows[0].id;

      await db.query(
        'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [roleId, permId]
      );
    }
  }

  console.log('Seed complete.');
  process.exit();
}

seed();