const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key'; // Replace with your own secret key
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Received token:', token);  // Log the token for debugging
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey);  // Ensure 'Bearer' is stripped from the token
        console.log('Decoded token:', decoded);  // Log the decoded token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);  // Log any error
        res.status(400).send('Invalid token.');
    }
};