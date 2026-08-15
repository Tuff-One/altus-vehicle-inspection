import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vehicles';

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