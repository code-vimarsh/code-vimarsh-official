import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const normalizedBaseUrl = trimmedBaseUrl.endsWith('/api/v1')
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api/v1`;

// Create an Axios instance
const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed if backend relies on cookies for CORS or session
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cv_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry or global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: automatically logout user if token is invalid/expired
      localStorage.removeItem('cv_token');
      localStorage.removeItem('cv_loggedin');
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
