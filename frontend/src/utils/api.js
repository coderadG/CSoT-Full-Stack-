// src/utils/api.js

const API_BASE = "http://localhost:5000/api"; // your backend

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
};
