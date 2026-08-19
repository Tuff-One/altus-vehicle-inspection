import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/auth';
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
}