import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tough-chicken-travel.loca.lt', // Yahan localtunnel wala link paste karein
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;