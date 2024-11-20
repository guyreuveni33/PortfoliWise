const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = process.env.JWT_SECRET;

exports.registerUser = async (email, password, fullName, nickname) => {
    const newUser = new User({ email, password, fullName, nickname });
    await newUser.save();
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
        return jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    }
    return null;
};
