import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';
import { getInspections } from '../services/inspectionService.js';
import { Link } from 'react-router-dom';

function InspectionList() {
  const { token } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInspections() {
      try {
        const data = await getInspections(token);
        setInspections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadInspections();
  }, [token]);

  if (loading) return <p>Loading inspections...</p>;

  return (
    <div>
      <h1>Inspections</h1>
      <Link to="/inspections/new" className="page-action">+ New Inspection</Link>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Inspector</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map((i) => (
            <tr key={i.id}>
              <td>{i.vehicle_name}</td>
              <td>{i.inspector_name}</td>
              <td>{new Date(i.inspection_date).toLocaleDateString()}</td>
              <td><span className={`status-tag status-${i.overall_status}`}>{i.overall_status.replace('_', ' ')}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InspectionList;