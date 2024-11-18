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

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        const user = req.user;

        const token = sign({ userId: user._id }, 'nivandguysecretkey');

        const redirectUrl = `http://localhost:3000/home?token=${token}&email=${encodeURIComponent(user.email)}&nickname=${encodeURIComponent(user.nickname)}`;
        res.redirect(redirectUrl);
    }
);


module.exports = router;
