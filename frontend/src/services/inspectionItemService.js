import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inspection-items';

export async function getInspectionItems(token) {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createInspection(inspectionData, token) {
  const response = await axios.post(API_URL, inspectionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}