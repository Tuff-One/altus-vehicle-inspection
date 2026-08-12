const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Altus ICT backend is running.');
});

db.query('SELECT 1')
  .then(() => console.log('Database connected successfully.'))
  .catch((err) => console.error('Database connection failed:', err.message));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});