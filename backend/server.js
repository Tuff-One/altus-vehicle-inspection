const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const inspectionItemRoutes = require('./routes/inspectionItems');
const inspectionRoutes = require('./routes/inspections');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspection-items', inspectionItemRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Altus ICT backend is running.');
});

db.query('SELECT 1')
  .then(() => console.log('Database connected successfully.'))
  .catch((err) => console.error('Database connection failed:', err.message));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});