import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function Navbar() {
  const { user, logoutUser } = useAuth();
  const isDriver = user?.role_id === 4;

  return (
    <nav>
      <img src="/altus-logo.png" alt="Altus ICT" className="navbar-logo" />
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/vehicles">Vehicles</Link>
      <Link to="/inspections">Inspections</Link>
      {!isDriver && <Link to="/reports">Reports</Link>}
      {(user?.role_id === 1 || user?.role_id === 2) && <Link to="/users">Users</Link>}
      <button onClick={logoutUser}>Log Out</button>
    </nav>
  );
}

export default Navbar;