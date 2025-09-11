// constants/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.110.76/api', // ganti dengan URL asli
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
