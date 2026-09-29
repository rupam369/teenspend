const ExpenseModel = require('../models/expenseModel');
const BudgetModel = require('../models/budgetModel');
const BudgetService = require('./budgetService');
const SuggestionService = require('./suggestionService');

class AnalyticsService {
  static async getSummary(userId) {
    const allExpenses = await ExpenseModel.findAllByUserId(userId, {});

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Current month calculations
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1;
    const currentMonthKey = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`;
    const startOfMonth = `${currentMonthKey}-01`;
    const lastDayOfMonth = new Date(currentYear, currentMonthNum, 0).getDate();
    const endOfMonth = `${currentMonthKey}-${String(lastDayOfMonth).padStart(2, '0')}`;

    // Previous month key
    const prevDate = new Date(currentYear, currentMonthNum - 2, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    const prevStart = `${prevMonthKey}-01`;
    const prevLastDay = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0).getDate();
    const prevEnd = `${prevMonthKey}-${String(prevLastDay).padStart(2, '0')}`;

    // Start of current week (Monday)
    const dayOfWeek = now.getDay() || 7; // Sunday = 7
    const startOfWeekDate = new Date(now);
    startOfWeekDate.setDate(now.getDate() - (dayOfWeek - 1));
    const startOfWeekStr = startOfWeekDate.toISOString().split('T')[0];

    let totalSpending = 0;
    let todaySpending = 0;
    let weekSpending = 0;
    let monthSpending = 0;
    let prevMonthSpending = 0;

    const categoryMap = {};

    for (const exp of allExpenses) {
      const amount = Number(exp.amount);
      const date = exp.expense_date;

      totalSpending += amount;

      if (date === todayStr) {
        todaySpending += amount;
      }
      if (date >= startOfWeekStr && date <= todayStr) {
        weekSpending += amount;
      }
      if (date >= startOfMonth && date <= endOfMonth) {
        monthSpending += amount;
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + amount;
      }
      if (date >= prevStart && date <= prevEnd) {
        prevMonthSpending += amount;
      }
    }

    // Budget info
    const budgetStatus = await BudgetService.getBudgetStatus(userId, currentMonthKey);
    const monthlyBudget = budgetStatus.monthly_budget;
    const remainingBudget = Number((monthlyBudget - monthSpending).toFixed(2));
    const percentageUsed = monthlyBudget > 0 ? Number(((monthSpending / monthlyBudget) * 100).toFixed(1)) : 0;

    // Highest category this month
    let highestCategory = { category: 'None', total: 0 };
    for (const [cat, amt] of Object.entries(categoryMap)) {
      if (amt > highestCategory.total) {
        highestCategory = { category: cat, total: Number(amt.toFixed(2)) };
      }
    }

    // Average daily spending this month (up to today's day of month)
    const currentDay = Math.max(1, now.getDate());
    const averageDailySpending = Number((monthSpending / currentDay).toFixed(2));

    // Category breakdown list
    const categoryBreakdown = Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2)),
      percentage: monthSpending > 0 ? Number(((total / monthSpending) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.total - a.total);

    // Smart suggestions
    const suggestions = SuggestionService.generateSuggestions({
      totalSpentThisMonth: monthSpending,
      monthlyBudget,
      remainingBudget,
      categoryBreakdown,
      dailyAverage: averageDailySpending,
      totalExpensesCount: allExpenses.length,
      previousMonthSpent: prevMonthSpending,
    });

    // Recent 5 expenses
    const recentExpenses = allExpenses.slice(0, 5);

    return {
      totalSpending: Number(totalSpending.toFixed(2)),
      todaySpending: Number(todaySpending.toFixed(2)),
      weekSpending: Number(weekSpending.toFixed(2)),
      monthSpending: Number(monthSpending.toFixed(2)),
      monthlyBudget,
      remainingBudget,
      percentageUsed,
      highestCategory,
      averageDailySpending,
      recentExpenses,
      suggestions,
      totalCount: allExpenses.length,
    };
  }

  static async getCategoryAnalytics(userId, options = {}) {
    const { month, startDate, endDate } = options;
    const filters = {};

    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    } else if (month) {
      const [year, m] = month.split('-');
      filters.startDate = `${year}-${m}-01`;
      const lastDay = new Date(Number(year), Number(m), 0).getDate();
      filters.endDate = `${year}-${m}-${String(lastDay).padStart(2, '0')}`;
    }

    const expenses = await ExpenseModel.findAllByUserId(userId, filters);
    const categoryMap = {};
    let grandTotal = 0;

    for (const exp of expenses) {
      const amt = Number(exp.amount);
      grandTotal += amt;
      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = { total: 0, count: 0 };
      }
      categoryMap[exp.category].total += amt;
      categoryMap[exp.category].count += 1;
    }

    const categories = Object.keys(categoryMap).map((cat) => {
      const total = Number(categoryMap[cat].total.toFixed(2));
      return {
        category: cat,
        total,
        count: categoryMap[cat].count,
        percentage: grandTotal > 0 ? Number(((total / grandTotal) * 100).toFixed(1)) : 0,
      };
    });

    categories.sort((a, b) => b.total - a.total);

    return {
      total: Number(grandTotal.toFixed(2)),
      categories,
    };
  }

  static async getMonthlyTrend(userId, options = {}) {
    const expenses = await ExpenseModel.findAllByUserId(userId, {});

    // Last 6 months trend
    const monthsData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      const label = `${monthName} ${year}`;

      const monthExpenses = expenses.filter((e) => e.expense_date && e.expense_date.startsWith(monthKey));
      const total = Number(
        monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)
      );

      monthsData.push({
        monthKey,
        monthName,
        label,
        total,
        count: monthExpenses.length,
      });
    }

    return monthsData;
  }

  static async getDailySpending(userId, options = {}) {
    const days = Number(options.days || 14);
    const expenses = await ExpenseModel.findAllByUserId(userId, {});

    const dailyData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      const dayExpenses = expenses.filter((e) => e.expense_date === dateStr);
      const total = Number(
        dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)
      );

      dailyData.push({
        date: dateStr,
        label: dayLabel,
        total,
        count: dayExpenses.length,
      });
    }

    return dailyData;
  }

  static async getCategoryComparison(userId, options = {}) {
    const month = options.month || BudgetModel.getCurrentMonthString();
    const budgetStatus = await BudgetService.getBudgetStatus(userId, month);
    return budgetStatus.category_status || [];
  }
}

module.exports = AnalyticsService;
