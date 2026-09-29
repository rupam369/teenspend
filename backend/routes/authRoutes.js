const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticateUser, AuthController.getMe);
router.put('/profile', authenticateUser, AuthController.updateProfile);
router.put('/password', authenticateUser, AuthController.changePassword);

module.exports = router;
