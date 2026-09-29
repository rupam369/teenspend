import { request } from './api';

export const analyticsService = {
  async getSummary() {
    const res = await request('/analytics/summary');
    return res.data;
  },

  async getCategory(params = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/analytics/category${query}`);
    return res.data;
  },

  async getMonthly(params = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/analytics/monthly${query}`);
    return res.data;
  },

  async getDaily(params = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/analytics/daily${query}`);
    return res.data;
  },

  async getComparison(params = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/analytics/comparison${query}`);
    return res.data;
  },
};
