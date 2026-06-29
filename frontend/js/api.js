/**
 * api.js
 * Backend se baat karne ke liye helper functions
 */

const API_URL = 'http://localhost:5000/api';
// Baad mein Render ka URL dalenge

const API = {
  // Auth
  async register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // Progress sync
  async loadProgress() {
    const token = localStorage.getItem('lf_token');
    if (!token) return null;
    const res = await fetch(`${API_URL}/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async saveProgress(state) {
    const token = localStorage.getItem('lf_token');
    if (!token) return;
    await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(state)
    });
  },

  getToken() { return localStorage.getItem('lf_token'); },
  getUser()  { return JSON.parse(localStorage.getItem('lf_user') || 'null'); },

  setAuth(token, user) {
    localStorage.setItem('lf_token', token);
    localStorage.setItem('lf_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
  },

  isLoggedIn() { return !!localStorage.getItem('lf_token'); }
};