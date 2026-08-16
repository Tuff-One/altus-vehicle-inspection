import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getVehicles } from '../services/vehicleService.js';
import { getInspectionItems } from '../services/inspectionItemService.js';
import { createInspection } from '../services/inspectionService.js';

function NewInspection() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vehicleId, setVehicleId] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionTime, setInspectionTime] = useState('');
  const [overallStatus, setOverallStatus] = useState('good');
  const [comments, setComments] = useState('');
  const [itemStatuses, setItemStatuses] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [vehicleData, itemData] = await Promise.all([
          getVehicles(token),
          getInspectionItems(token),
        ]);
        setVehicles(vehicleData);
        setItems(itemData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  function handleItemStatusChange(itemId, status) {
    setItemStatuses((prev) => ({ ...prev, [itemId]: status }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const results = items.map((item) => ({
      inspection_item_id: item.id,
      status: itemStatuses[item.id] || 'not_applicable',
    }));

    setSubmitting(true);
    try {
      await createInspection(
        {
          vehicle_id: vehicleId,
          inspection_date: inspectionDate,
          inspection_time: inspectionTime,
          overall_status: overallStatus,
          comments,
          results,
        },
        token
      );
      navigate('/inspections');
    } catch (err) {
      console.error(err);
      setError('Could not submit inspection. Check the form and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading form...</p>;

  return (
    <div>
      <h1>New Inspection</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vehicle">Vehicle</label>
          <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="time">Time</label>
          <input id="time" type="time" value={inspectionTime} onChange={(e) => setInspectionTime(e.target.value)} required />
        </div>

        <h2>Checklist</h2>
        {items.map((item) => (
          <div key={item.id}>
            <label>{item.name}</label>
            <select
              value={itemStatuses[item.id] || ''}
              onChange={(e) => handleItemStatusChange(item.id, e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option value="good">Good</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="faulty">Faulty</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>
        ))}

        <div>
          <label htmlFor="overall">Overall Status</label>
          <select id="overall" value={overallStatus} onChange={(e) => setOverallStatus(e.target.value)}>
            <option value="good">Good</option>
            <option value="needs_attention">Needs Attention</option>
            <option value="faulty">Faulty</option>
          </select>
        </div>

        <div>
          <label htmlFor="comments">Comments</label>
          <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} />
        </div>

        {error && <p>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Inspection'}
        </button>
      </form>
    </div>
  );
}

export default NewInspection;