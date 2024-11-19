const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { email, password, fullName, nickname } = req.body;
    try {
        await userService.registerUser(email, password, fullName, nickname);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await userService.loginUser(email, password);
        if (token) {
            res.json({ token });
        } else {
            res.status(400).send('Invalid email or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('nickname');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ nickname: user.nickname });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving user profile');
    }
};

exports.updateProfile = async (req, res) => {
    const { nickname, fullName } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (nickname) user.nickname = nickname;
        if (fullName) user.fullName = fullName;
        await user.save();
        res.send('Profile updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating profile');
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.userId);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).send('Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();

        res.send('Password changed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error changing password');
    }
};

exports.dashboard = (req, res) => {
    res.send('Welcome to the Dashboard');
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).send('Account deleted successfully');
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send('Error deleting account');
    }
};

