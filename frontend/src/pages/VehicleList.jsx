import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getVehicles, removeVehicle, getInactiveVehicles, reactivateVehicle } from '../services/vehicleService.js';

function VehicleList() {
  const { token, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [inactiveVehicles, setInactiveVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDriver = user?.role_id === 4;
  const canManageVehicleStatus = user?.role_id === 1 || user?.role_id === 2;

  useEffect(() => {
    async function loadAll() {
      try {
        const activeData = await getVehicles(token);
        setVehicles(activeData);

        if (!isDriver) {
          const inactiveData = await getInactiveVehicles(token);
          setInactiveVehicles(inactiveData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [token, isDriver]);

  async function refreshVehicles() {
    try {
      const activeData = await getVehicles(token);
      setVehicles(activeData);

      if (!isDriver) {
        const inactiveData = await getInactiveVehicles(token);
        setInactiveVehicles(inactiveData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemove(id) {
    if (!window.confirm('Remove this vehicle? It will no longer appear in the active list.')) return;
    try {
      await removeVehicle(id, token);
      refreshVehicles();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReactivate(id) {
    try {
      await reactivateVehicle(id, token);
      refreshVehicles();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div>
      <h1>Vehicles</h1>
      {!isDriver && <Link to="/vehicles/add" className="page-action">+ Add Vehicle</Link>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Registration</th>
            <th>Mileage</th>
            <th>Status</th>
            {!isDriver && <th></th>}
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
              {!isDriver && (
                <td>{canManageVehicleStatus && <button onClick={() => handleRemove(v.id)}>Remove</button>}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!isDriver && inactiveVehicles.length > 0 && (
        <>
          <h2>Inactive Vehicles</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Registration</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inactiveVehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.type}</td>
                  <td>{v.registration_number}</td>
                  <td>{canManageVehicleStatus && <button onClick={() => handleReactivate(v.id)}>Reactivate</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default VehicleList;