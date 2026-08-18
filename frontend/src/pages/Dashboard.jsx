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
        <p>Fleet-wide stats will go here.</p>
      )}
    </div>
  );
}

export default Dashboard;