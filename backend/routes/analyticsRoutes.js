const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All analytics routes require authentication
router.use(authenticateUser);

router.get('/summary', AnalyticsController.getSummary);
router.get('/category', AnalyticsController.getCategory);
router.get('/monthly', AnalyticsController.getMonthly);
router.get('/daily', AnalyticsController.getDaily);
router.get('/comparison', AnalyticsController.getCategoryComparison);

module.exports = router;
