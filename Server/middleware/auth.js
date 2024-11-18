const jwt = require('jsonwebtoken');

const secretKey = 'nivandguysecretkey';
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).send('Invalid token.');
    }
};