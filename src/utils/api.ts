import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Request Interceptor: Add Token and Role Headers
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('racs_staff_member');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        // Keep legacy headers for backward compatibility until all endpoints are updated
        config.headers['X-Staff-Role'] = user.role;
        config.headers['X-Staff-Name'] = user.name;
      } catch (e) {
        console.error('Error parsing staff member for headers', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized/Expired Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Logic for logout if token is invalid - ONLY for admin routes
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
          localStorage.removeItem('racs_staff_member');
          window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
