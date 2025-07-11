// src/utils/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// 🔐 Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 🔁 Auto-refresh expired tokens and retry
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        const newToken = res.data.token;

        localStorage.setItem('token', newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest); // retry
      } catch (refreshErr) {
        console.error('🔁 Refresh token failed:', refreshErr);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

//
// ✅ EXPORT API FUNCTIONS
//

// 🟢 Login — no token needed yet, so use raw axios
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_BASE}/auth/login`, credentials);
  return res.data;
};

// 🟢 Register — also uses raw axios
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/register`, userData);
  return res.data;
};

// 👥 Get all users — requires token (so uses `api`)
export const getUsers = async () => {
  const res = await api.get('/auth/users');
  return res.data;
};

// 💬 Get messages with a user
export const getMessages = async (receiverId) => {
  const res = await api.get(`/messages/${receiverId}`);
  return res.data;
};

// 💌 Send a new message
export const sendMessage = async (data) => {
  const res = await api.post('/messages', data);
  return res.data;
};

// Export the axios instance if needed directly
export default api;
