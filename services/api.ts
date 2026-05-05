import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://orders-rest-api-python.onrender.com';

const api = axios.create({
  baseURL: BASE_URL + '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
