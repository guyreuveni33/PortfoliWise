// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming the User model is in the models folder

// Add a symbol to the user's watchlist
router.post('/add-symbol', async (req, res) => {
    const { email, symbol } = req.body;

    try {
        // Find the user by email and add the symbol to the watchlist
        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { watchlist: { symbol: symbol } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the updated watchlist
        return res.json(user.watchlist);
    } catch (error) {
        console.error('Error adding symbol to watchlist:', error);
        return res.status(500).json({ message: 'Error adding symbol to watchlist', error });
    }
});

module.exports = router;
