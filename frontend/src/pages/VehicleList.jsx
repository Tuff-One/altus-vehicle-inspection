import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getVehicles, removeVehicle } from '../services/vehicleService.js';

function VehicleList() {
  const { token, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getVehicles(token);
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, [token]);

  async function handleRemove(id) {
    if (!window.confirm('Remove this vehicle? It will no longer appear in the active list.')) return;
    try {
      await removeVehicle(id, token);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div>
      <h1>Vehicles</h1>
      {user?.role_id !== 4 && <Link to="/vehicles/add" className="page-action">+ Add Vehicle</Link>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Registration</th>
            <th>Mileage</th>
            <th>Status</th>
            {user?.role_id !== 4 && <th></th>}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.type}</td>
              <td>{v.registration_number}</td>
              <td>{v.current_mileage}</td>
              <td>{v.status}</td>
              {user?.role_id !== 4 && (
                <td><button onClick={() => handleRemove(v.id)}>Remove</button></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleList;