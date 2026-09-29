const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All expense routes require authentication
router.use(authenticateUser);

router.get('/', ExpenseController.getExpenses);
router.post('/', ExpenseController.createExpense);
router.get('/:id', ExpenseController.getExpenseById);
router.put('/:id', ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

module.exports = router;
