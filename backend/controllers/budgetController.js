const BudgetService = require('../services/budgetService');

class BudgetController {
  static async getBudget(req, res, next) {
    try {
      const budget = await BudgetService.getBudget(req.user.id, req.query.month);
      res.status(200).json({
        success: true,
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  static async setBudget(req, res, next) {
    try {
      const budget = await BudgetService.setBudget(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Budget saved successfully.',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req, res, next) {
    try {
      const status = await BudgetService.getBudgetStatus(req.user.id, req.query.month);
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BudgetController;
