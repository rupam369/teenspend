import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { analyticsService } from '../services/analyticsService';
import { budgetService } from '../services/budgetService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: 'All',
    payment_method: 'All',
    startDate: '',
    endDate: '',
    search: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date-desc',
  });

  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) return;
    setSummaryLoading(true);
    try {
      const data = await analyticsService.getSummary();
      setSummary(data);
      const budgetData = await budgetService.getStatus();
      setBudgetStatus(budgetData);
    } catch (err) {
      console.error('Failed to fetch summary:', err.message);
    } finally {
      setSummaryLoading(false);
    }
  }, [isAuthenticated]);

  const fetchExpenses = useCallback(async (customFilters = null) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const queryParams = customFilters || filters;
      const data = await expenseService.getAll(queryParams);
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err.message);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSummary();
      fetchExpenses();
    } else {
      setExpenses([]);
      setSummary(null);
      setBudgetStatus(null);
    }
  }, [isAuthenticated, fetchSummary, fetchExpenses]);

  const addExpense = async (expenseData) => {
    try {
      const created = await expenseService.create(expenseData);
      toast.success('Expense recorded successfully! 🎉');
      // Refresh both expenses list and summary metrics
      await Promise.all([fetchExpenses(), fetchSummary()]);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to add expense');
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const updated = await expenseService.update(id, expenseData);
      toast.success('Expense updated! ✏️');
      await Promise.all([fetchExpenses(), fetchSummary()]);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      toast.success('Expense deleted');
      await Promise.all([fetchExpenses(), fetchSummary()]);
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense');
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      fetchExpenses(updated);
      return updated;
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: 'All',
      payment_method: 'All',
      startDate: '',
      endDate: '',
      search: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date-desc',
    };
    setFilters(defaultFilters);
    fetchExpenses(defaultFilters);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        budgetStatus,
        loading,
        summaryLoading,
        filters,
        updateFilters,
        resetFilters,
        fetchExpenses,
        fetchSummary,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
