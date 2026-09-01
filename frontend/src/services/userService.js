import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export async function getUsers(token) {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createUser(userData, token) {
  const response = await axios.post(API_URL, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deactivateUser(id, token) {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function reactivateUser(id, token) {
  const response = await axios.patch(`${API_URL}/${id}/reactivate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}