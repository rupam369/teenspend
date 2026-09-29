import { request } from './api';

export const budgetService = {
  async getBudget(month) {
    const query = month ? `?month=${encodeURIComponent(month)}` : '';
    const res = await request(`/budget${query}`);
    return res.data;
  },

  async saveBudget({ monthly_budget, category_budgets, month }) {
    const res = await request('/budget', {
      method: 'POST',
      body: { monthly_budget, category_budgets, month },
    });
    return res.data;
  },

  async getStatus(month) {
    const query = month ? `?month=${encodeURIComponent(month)}` : '';
    const res = await request(`/budget/status${query}`);
    return res.data;
  },
};
