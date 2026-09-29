const AnalyticsService = require('../services/analyticsService');

class AnalyticsController {
  static async getSummary(req, res, next) {
    try {
      const summary = await AnalyticsService.getSummary(req.user.id);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategory(req, res, next) {
    try {
      const result = await AnalyticsService.getCategoryAnalytics(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthly(req, res, next) {
    try {
      const result = await AnalyticsService.getMonthlyTrend(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDaily(req, res, next) {
    try {
      const result = await AnalyticsService.getDailySpending(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryComparison(req, res, next) {
    try {
      const result = await AnalyticsService.getCategoryComparison(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;
