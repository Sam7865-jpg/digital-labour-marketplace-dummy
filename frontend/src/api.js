import axios from 'axios';

const API = axios.create({
  // Step 3 mein jo Vercel ka backend link mila wo yahan dalein (aakhir mein /api zaroor lagana hai)
  baseURL: 'https://digital-labour-marketplace.vercel.app/',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;