import { request } from './api';

export const authService = {
  async register({ name, email, password, confirmPassword }) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: { name, email, password, confirmPassword },
    });
    if (res.data?.token) {
      localStorage.setItem('teenspend_token', res.data.token);
      localStorage.setItem('teenspend_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (res.data?.token) {
      localStorage.setItem('teenspend_token', res.data.token);
      localStorage.setItem('teenspend_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async getMe() {
    const res = await request('/auth/me');
    if (res.data) {
      localStorage.setItem('teenspend_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await request('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
    if (res.data) {
      localStorage.setItem('teenspend_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async changePassword({ currentPassword, newPassword }) {
    return await request('/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  },

  logout() {
    localStorage.removeItem('teenspend_token');
    localStorage.removeItem('teenspend_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('teenspend_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('teenspend_token');
  },
};
