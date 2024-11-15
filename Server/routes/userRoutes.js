// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const passport = require('passport');
const {sign} = require("jsonwebtoken");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', verifyToken, userController.dashboard);
router.get('/profile', verifyToken, userController.getProfile); // Added route
router.put('/update-profile', verifyToken, userController.updateProfile); // New route
router.put('/change-password', verifyToken, userController.changePassword); // New route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        // Successful authentication
        const user = req.user;

        // Generate JWT token
        const token = sign({ userId: user._id }, 'your_secret_key');

        // Redirect to client with token and user data
        const redirectUrl = `http://localhost:3000/home?token=${token}&email=${encodeURIComponent(user.email)}&nickname=${encodeURIComponent(user.nickname)}`;
        res.redirect(redirectUrl);
    }
);


module.exports = router;
