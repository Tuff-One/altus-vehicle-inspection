import { useAuth } from '../context/useAuth.js';

function Dashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.name}</p>
      <button onClick={logoutUser}>Log Out</button>
    </div>
  );
}

export default Dashboard;