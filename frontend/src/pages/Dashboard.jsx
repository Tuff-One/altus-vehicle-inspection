import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';
import { getDashboardStats } from '../services/reportService.js';

function Dashboard() {
  const { user, token } = useAuth();
  const isDriver = user?.role_id === 4;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isDriver) return;
    async function loadStats() {
      try {
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, [isDriver, user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.name}</p>

      {isDriver ? (
        <p>My recent inspections will go here.</p>
      ) : (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-value">{stats ? stats.totalVehicles : '--'}</span>
            <span className="stat-label">Total Vehicles</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats ? stats.openFaults : '--'}</span>
            <span className="stat-label">Open Faults</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats ? stats.overdueCount : '--'}</span>
            <span className="stat-label">Overdue Inspections</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats ? stats.weekCount : '--'}</span>
            <span className="stat-label">This Week's Inspections</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;