import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';
import { getOutstandingIssues, getOverdueVehicles, getRecurringIssues } from '../services/reportService.js';

function Reports() {
  const { token } = useAuth();
  const [outstanding, setOutstanding] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const [outstandingData, overdueData, recurringData] = await Promise.all([
          getOutstandingIssues(token),
          getOverdueVehicles(token),
          getRecurringIssues(token),
        ]);
        setOutstanding(outstandingData);
        setOverdue(overdueData);
        setRecurring(recurringData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [token]);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <h1>Reports</h1>

      <h2>Outstanding Issues</h2>
      <table>
        <thead>
          <tr><th>Vehicle</th><th>Item</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {outstanding.map((row, i) => (
            <tr key={i}>
              <td>{row.vehicle_name}</td>
              <td>{row.item_name}</td>
              <td><span className={`status-tag status-${row.status}`}>{row.status.replace('_', ' ')}</span></td>
              <td>{new Date(row.inspection_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Vehicles Overdue for Inspection</h2>
      <table>
        <thead>
          <tr><th>Vehicle</th><th>Last Inspected</th><th>Days Overdue</th></tr>
        </thead>
        <tbody>
          {overdue.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.last_inspection_date ? new Date(row.last_inspection_date).toLocaleDateString() : 'Never'}</td>
              <td>{row.days_since_inspection ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Recurring Issues</h2>
      <table>
        <thead>
          <tr><th>Vehicle</th><th>Item</th><th>Times Flagged</th></tr>
        </thead>
        <tbody>
          {recurring.map((row, i) => (
            <tr key={i}>
              <td>{row.vehicle_name}</td>
              <td>{row.item_name}</td>
              <td>{row.times_flagged}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;