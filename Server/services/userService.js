// userService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable

exports.registerUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        return jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    }
    return null;
};
