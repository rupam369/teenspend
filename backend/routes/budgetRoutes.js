const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/budgetController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All budget routes require authentication
router.use(authenticateUser);

router.get('/', BudgetController.getBudget);
router.post('/', BudgetController.setBudget);
router.put('/', BudgetController.setBudget);
router.get('/status', BudgetController.getStatus);

module.exports = router;
