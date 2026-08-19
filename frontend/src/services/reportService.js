import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/reports';
const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`;

export async function getOutstandingIssues(token) {
  const response = await axios.get(`${API_URL}/outstanding-issues`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getOverdueVehicles(token) {
  const response = await axios.get(`${API_URL}/overdue-vehicles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getRecurringIssues(token) {
  const response = await axios.get(`${API_URL}/recurring-issues`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}