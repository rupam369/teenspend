const ExpenseService = require('../services/expenseService');

class ExpenseController {
  static async getExpenses(req, res, next) {
    try {
      const expenses = await ExpenseService.getExpenses(req.user.id, req.query);
      res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getExpenseById(req, res, next) {
    try {
      const expense = await ExpenseService.getExpenseById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createExpense(req, res, next) {
    try {
      const expense = await ExpenseService.createExpense(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Expense added successfully.',
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateExpense(req, res, next) {
    try {
      const updatedExpense = await ExpenseService.updateExpense(
        req.params.id,
        req.user.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Expense updated successfully.',
        data: updatedExpense,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req, res, next) {
    try {
      const result = await ExpenseService.deleteExpense(req.params.id, req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExpenseController;
