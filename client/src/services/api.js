import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the admin JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('physio_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token expires or is invalid, clear it and bounce to admin login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('physio_admin_token');
      localStorage.removeItem('physio_admin_user');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Resolves an uploaded image's relative path (e.g. "doctors/xyz.jpg")
// into a full URL served by the backend's /uploads static route.
export const resolveImage = (relativePath, fallback = '/placeholder-image.svg') => {
  if (!relativePath) return fallback;
  if (relativePath.startsWith('http')) return relativePath;
  if (relativePath.startsWith('seed/')) return fallback; // seed data has no real file
  const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';
  return `${uploadsUrl}/${relativePath}`;
};

export default api;
