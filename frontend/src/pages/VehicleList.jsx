import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';
import { getVehicles } from '../services/vehicleService.js';

function VehicleList() {
  const { token } = useAuth();
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

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div>
      <h1>Vehicles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Registration</th>
            <th>Mileage</th>
            <th>Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleList;