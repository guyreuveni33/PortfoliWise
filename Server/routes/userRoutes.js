const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const passport = require('passport');
const {sign} = require("jsonwebtoken");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', verifyToken, userController.dashboard);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/update-profile', verifyToken, userController.updateProfile);
router.put('/change-password', verifyToken, userController.changePassword);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.delete('/delete-account', verifyToken, userController.deleteAccount);


router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),  // Exchange auth code for access token
    async (req, res) => {
        const user = req.user;

        const token = sign({ userId: user._id }, process.env.JWT_SECRET);
        const REDIRECT_URL = process.env.CLIENT_HOME_URL || 'http://localhost:3000/home';

        const redirectUrl = `${REDIRECT_URL}?token=${token}&email=${encodeURIComponent(user.email)}&nickname=${encodeURIComponent(user.nickname)}`;
        res.redirect(redirectUrl);
    }
);


module.exports = router;
