import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 🔒 Private Axios Instance
 * Pre-configured with base URL, security interceptors, and automatic token injection.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20-second timeout for slow connections
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// 🚀 Request Interceptor: Automatically attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('racs_staff_member');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        // Staff context for the backend
        config.headers['X-Staff-Role'] = user.role;
        config.headers['X-Staff-Name'] = user.name;
      } catch (e) {
        console.warn('⚠️ [API] Failed to parse staff session for headers');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 📥 Response Interceptor: Handle errors and unauthorized states globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Handle Network Errors
    if (!error.response) {
      console.error('❌ [API NETWORK ERROR]: Could not reach the server. Please check your connection.');
      return Promise.reject(new Error('Network error: Server unreachable'));
    }

    const { status, data } = error.response;

    // 2. Handle Authentication Expiry (401/403)
    if (status === 401 || status === 403) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        console.warn('🛑 [API UNAUTHORIZED]: Session expired. Redirecting to login...');
        localStorage.removeItem('racs_staff_member');
        window.location.href = '/login?expired=true';
      }
    }

    // 3. Log General Errors for Debugging
    console.error(`❌ [API ERROR ${status}]:`, data?.error || data?.message || 'Unknown error');
    
    return Promise.reject(error);
  }
);

export default api;
