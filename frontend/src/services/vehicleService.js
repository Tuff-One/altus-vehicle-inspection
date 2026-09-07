import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/vehicles';
const API_URL = `${import.meta.env.VITE_API_URL}/api/vehicles`;

export async function getVehicles(token) {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function addVehicle(vehicleData, token) {
  const response = await axios.post(API_URL, vehicleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function removeVehicle(id, token) {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getInactiveVehicles(token) {
  const response = await axios.get(`${API_URL}/inactive`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function reactivateVehicle(id, token) {
  const response = await axios.patch(`${API_URL}/${id}/reactivate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}