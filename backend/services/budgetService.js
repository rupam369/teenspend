const BudgetModel = require('../models/budgetModel');
const ExpenseModel = require('../models/expenseModel');
const { isValidAmount } = require('../utils/validators');

class BudgetService {
  static async getBudget(userId, month) {
    const targetMonth = month || BudgetModel.getCurrentMonthString();
    let budget = await BudgetModel.findByMonth(userId, targetMonth);

    // If no budget set yet, return default baseline
    if (!budget) {
      budget = {
        monthly_budget: 5000,
        category_budgets: {
          Food: 1500,
          Entertainment: 800,
          Transport: 700,
          Shopping: 1000,
          Education: 500,
          Other: 500,
        },
        month: targetMonth,
        is_default: true,
      };
    }
    return budget;
  }

  static async setBudget(userId, { monthly_budget, category_budgets, month }) {
    if (monthly_budget !== undefined && !isValidAmount(monthly_budget)) {
      const error = new Error('Monthly budget must be a positive number.');
      error.statusCode = 400;
      throw error;
    }

    const cleanCategoryBudgets = {};
    if (category_budgets && typeof category_budgets === 'object') {
      for (const [cat, val] of Object.entries(category_budgets)) {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 0) {
          cleanCategoryBudgets[cat] = Number(num.toFixed(2));
        }
      }
    }

    return await BudgetModel.upsert(userId, {
      monthly_budget: monthly_budget || 5000,
      category_budgets: cleanCategoryBudgets,
      month: month || BudgetModel.getCurrentMonthString(),
    });
  }

  static async getBudgetStatus(userId, month) {
    const targetMonth = month || BudgetModel.getCurrentMonthString();
    const budget = await this.getBudget(userId, targetMonth);

    // Calculate start and end date for targetMonth
    const [year, m] = targetMonth.split('-');
    const startDate = `${year}-${m}-01`;
    const lastDay = new Date(Number(year), Number(m), 0).getDate();
    const endDate = `${year}-${m}-${String(lastDay).padStart(2, '0')}`;

    // Fetch user expenses for that month
    const expenses = await ExpenseModel.findAllByUserId(userId, {
      startDate,
      endDate,
    });

    const totalSpent = Number(
      expenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)
    );

    const monthlyBudget = Number(budget.monthly_budget);
    const remaining = Number((monthlyBudget - totalSpent).toFixed(2));
    const percentageUsed = monthlyBudget > 0 ? Number(((totalSpent / monthlyBudget) * 100).toFixed(1)) : 0;

    // Calculate category spending
    const categorySpending = {};
    for (const exp of expenses) {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + Number(exp.amount);
    }

    // Build category budget statuses
    const categoryStatus = [];
    const catBudgets = budget.category_budgets || {};

    const allCategories = [
      'Food',
      'Transport',
      'Education',
      'Entertainment',
      'Shopping',
      'Bills',
      'Health',
      'Travel',
      'Other',
    ];

    for (const cat of allCategories) {
      const spent = Number((categorySpending[cat] || 0).toFixed(2));
      const allocated = Number(catBudgets[cat] || 0);
      if (allocated > 0 || spent > 0) {
        const catRemaining = Number((allocated - spent).toFixed(2));
        const catPercent = allocated > 0 ? Number(((spent / allocated) * 100).toFixed(1)) : 0;
        let status = 'normal';
        if (catPercent >= 100) status = 'exceeded';
        else if (catPercent >= 80) status = 'warning';

        categoryStatus.push({
          category: cat,
          budget: allocated,
          spent,
          remaining: catRemaining,
          percentage: catPercent,
          status,
        });
      }
    }

    let overallStatus = 'normal';
    if (percentageUsed >= 100) {
      overallStatus = 'exceeded';
    } else if (percentageUsed >= 80) {
      overallStatus = 'warning';
    }

    return {
      month: targetMonth,
      monthly_budget: monthlyBudget,
      total_spent: totalSpent,
      remaining_budget: remaining,
      percentage_used: percentageUsed,
      status: overallStatus,
      category_status: categoryStatus,
    };
  }
}

module.exports = BudgetService;
