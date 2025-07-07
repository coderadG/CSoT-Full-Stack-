// src/utils/api.js

import axios from 'axios';

const API_BASE = "http://localhost:5000/api"; // Backend base URL

// 🔐 Login User
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE}/auth/login`, credentials);
  return response.data; // Contains user + message
};

// 🧾 Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/auth/register`, userData);
  return response.data; // Contains message
};
