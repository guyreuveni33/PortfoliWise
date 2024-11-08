// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Use the same secret key

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { authMiddleware };
