// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 &&
        !error.config.url.endsWith('/auth/login') && // Lebih aman untuk mengecek akhiran URL
        !error.config.url.endsWith('/auth/register')) {
      
      console.error('Unauthorized or Token expired. Consider redirecting to login.');
      localStorage.removeItem('jwt_token');
      // Hapus juga user dari AuthContext jika perlu, atau biarkan AuthContext menanganinya
      // window.location.href = '/login'; // Hindari full page reload jika bisa
    }
    return Promise.reject(error);
  }
);

export default api;