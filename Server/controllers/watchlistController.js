const watchlistService = require('../services/watchlistService'); // Import the service
const { spawn } = require('child_process');

// Controller to add a symbol to the user's watchlist
exports.addSymbolToWatchlist = async (req, res) => {
    const { email, symbol } = req.body;

    try {
        // Call the service function to add the symbol
        const updatedWatchlist = await watchlistService.addSymbolToWatchlist(email, symbol);

        // Return the updated watchlist
        return res.json(updatedWatchlist);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Controller to fetch the user's watchlist by email and include stock prices
exports.getWatchlistByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        // Call the service function to get the watchlist with stock prices
        const watchlistWithPrices = await watchlistService.getWatchlistByEmail(email);

        // Return the watchlist with stock prices
        return res.json(watchlistWithPrices);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


