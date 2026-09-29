import { request } from './api';

export const expenseService = {
  async getAll(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/expenses${query}`);
    return res.data || [];
  },

  async getById(id) {
    const res = await request(`/expenses/${id}`);
    return res.data;
  },

  async create(expenseData) {
    const res = await request('/expenses', {
      method: 'POST',
      body: expenseData,
    });
    return res.data;
  },

  async update(id, expenseData) {
    const res = await request(`/expenses/${id}`, {
      method: 'PUT',
      body: expenseData,
    });
    return res.data;
  },

  async delete(id) {
    return await request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};
