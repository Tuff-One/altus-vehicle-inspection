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

  // Step 2c: create boss and supervisor test users
  const [bossRole] = await db.query('SELECT id FROM roles WHERE name = ?', ['boss']);
  const bossRoleId = bossRole[0].id;
  const bossPasswordHash = await bcrypt.hash('bosspass123', 10);
  await db.query(
    'INSERT IGNORE INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    ['Test Boss', 'boss@altus.com', bossPasswordHash, bossRoleId]
  );

  const [supervisorRole] = await db.query('SELECT id FROM roles WHERE name = ?', ['supervisor']);
  const supervisorRoleId = supervisorRole[0].id;
  const supervisorPasswordHash = await bcrypt.hash('supervisorpass123', 10);
  await db.query(
    'INSERT IGNORE INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    ['Test Supervisor', 'supervisor@altus.com', supervisorPasswordHash, supervisorRoleId]
  );

// Step 3: insert permissions
  const permissions = [
    'manage_vehicles',
    'manage_inspections',
    'manage_inspection_items',
    'manage_users',
    'manage_boss_accounts',
    'view_reports',
    'manage_vehicle_status',
  ];
  for (const perm of permissions) {
    await db.query('INSERT IGNORE INTO permissions (name) VALUES (?)', [perm]);
  }

  // Step 4: map roles to permissions, based on the Phase 3 matrix
  const rolePermissionMap = {
    admin: ['manage_vehicles', 'manage_inspections', 'manage_inspection_items', 'manage_users', 'manage_boss_accounts', 'view_reports', 'manage_vehicle_status'],
    boss: ['manage_vehicles', 'manage_inspections', 'manage_inspection_items', 'manage_users', 'view_reports', 'manage_vehicle_status'],
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

  // Step 5: seed a starter set of inspection items
  const items = ['Brakes', 'Lights', 'Tyres', 'Oil Level', 'Wipers', 'Horn'];
  for (const item of items) {
    await db.query('INSERT IGNORE INTO inspection_items (name) VALUES (?)', [item]);
  }

  console.log('Seed complete.');
  process.exit();
}

seed();