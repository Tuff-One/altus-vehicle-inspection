import { useAuth } from '../context/useAuth.js';

function Dashboard() {
  const { user, /*logoutUser*/ } = useAuth();
  const isDriver = user?.role_id === 4;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.name}</p>
      {/* <button onClick={logoutUser}>Log Out</button> */}

      {isDriver ? (
  <p>My recent inspections will go here.</p>
) : (
  <div className="stat-grid">
    <div className="stat-card">
      <span className="stat-value">--</span>
      <span className="stat-label">Total Vehicles</span>
    </div>
    <div className="stat-card">
      <span className="stat-value">--</span>
      <span className="stat-label">Open Faults</span>
    </div>
    <div className="stat-card">
      <span className="stat-value">--</span>
      <span className="stat-label">Overdue Inspections</span>
    </div>
    <div className="stat-card">
      <span className="stat-value">--</span>
      <span className="stat-label">This Week's Inspections</span>
    </div>
  </div>
)}
    </div>
  );
}

export default Dashboard;