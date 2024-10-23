// controllers/watchlistController.js
const User = require('../models/User'); // Import the User model

// Controller to add a symbol to the user's watchlist
exports.addSymbolToWatchlist = async (req, res) => {
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
};

// Controller to fetch the user's watchlist by email
exports.getWatchlistByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's watchlist
        return res.json(user.watchlist);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return res.status(500).json({ message: 'Error fetching watchlist', error });
    }
};
