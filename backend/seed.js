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

  console.log('Seed complete.');
  process.exit();
}

seed();