const ExpenseModel = require('../models/expenseModel');
const {
  isValidAmount,
  isValidCategory,
  isValidPaymentMethod,
  isValidDate,
} = require('../utils/validators');

class ExpenseService {
  static async getExpenses(userId, queryOptions) {
    return await ExpenseModel.findAllByUserId(userId, queryOptions);
  }

  static async getExpenseById(id, userId) {
    const expense = await ExpenseModel.findById(id, userId);
    if (!expense) {
      const error = new Error('Expense record not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return expense;
  }

  static async createExpense(userId, data) {
    const { title, amount, category, description, payment_method, expense_date } = data;

    if (!title || !title.trim()) {
      const error = new Error('Expense title cannot be empty.');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidAmount(amount)) {
      const error = new Error('Amount must be a positive number greater than 0.');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidCategory(category)) {
      const error = new Error('Invalid expense category selected.');
      error.statusCode = 400;
      throw error;
    }

    if (payment_method && !isValidPaymentMethod(payment_method)) {
      const error = new Error('Invalid payment method selected.');
      error.statusCode = 400;
      throw error;
    }

    if (expense_date && !isValidDate(expense_date)) {
      const error = new Error('Invalid expense date provided.');
      error.statusCode = 400;
      throw error;
    }

    return await ExpenseModel.create({
      user_id: userId,
      title,
      amount,
      category,
      description,
      payment_method: payment_method || 'UPI',
      expense_date: expense_date || new Date().toISOString().split('T')[0],
    });
  }

  static async updateExpense(id, userId, data) {
    const existing = await ExpenseModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Expense record not found or access denied.');
      error.statusCode = 404;
      throw error;
    }

    const { title, amount, category, description, payment_method, expense_date } = data;
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        const error = new Error('Expense title cannot be empty.');
        error.statusCode = 400;
        throw error;
      }
      updates.title = title;
    }

    if (amount !== undefined) {
      if (!isValidAmount(amount)) {
        const error = new Error('Amount must be a positive number greater than 0.');
        error.statusCode = 400;
        throw error;
      }
      updates.amount = amount;
    }

    if (category !== undefined) {
      if (!isValidCategory(category)) {
        const error = new Error('Invalid expense category selected.');
        error.statusCode = 400;
        throw error;
      }
      updates.category = category;
    }

    if (payment_method !== undefined) {
      if (!isValidPaymentMethod(payment_method)) {
        const error = new Error('Invalid payment method selected.');
        error.statusCode = 400;
        throw error;
      }
      updates.payment_method = payment_method;
    }

    if (expense_date !== undefined) {
      if (!isValidDate(expense_date)) {
        const error = new Error('Invalid expense date provided.');
        error.statusCode = 400;
        throw error;
      }
      updates.expense_date = expense_date;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    return await ExpenseModel.update(id, userId, updates);
  }

  static async deleteExpense(id, userId) {
    const existing = await ExpenseModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Expense record not found or access denied.');
      error.statusCode = 404;
      throw error;
    }

    await ExpenseModel.delete(id, userId);
    return { success: true, message: 'Expense deleted successfully.' };
  }
}

module.exports = ExpenseService;
