// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', verifyToken, userController.dashboard);
router.get('/profile', verifyToken, userController.getProfile); // Added route
router.put('/update-profile', verifyToken, userController.updateProfile); // New route
router.put('/change-password', verifyToken, userController.changePassword); // New route

module.exports = router;
