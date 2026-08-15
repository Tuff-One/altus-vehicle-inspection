import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { addVehicle } from '../services/vehicleService.js';

function AddVehicle() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await addVehicle(
        { name, type, registration_number: registrationNumber },
        token
      );
      navigate('/vehicles');
    } catch (err) {
      console.error(err);
      setError('Could not add vehicle. Check the details and try again.');
    }
  }

  return (
    <div>
      <h1>Add Vehicle</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <input id="type" value={type} onChange={(e) => setType(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="reg">Registration Number</label>
          <input id="reg" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} required />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
}

export default AddVehicle;