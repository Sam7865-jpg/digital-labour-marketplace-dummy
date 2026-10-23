import axios from 'axios';

const API = axios.create({
  baseURL: 'https://digital-labour-marketplace-1qhz.vercel.app/api'
});

// Automatically attach Bearer token if user is logged in
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;