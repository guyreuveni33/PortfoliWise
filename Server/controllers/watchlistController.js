const watchlistService = require('../services/watchlistService'); // Import the service
const { spawn } = require('child_process');

exports.addSymbolToWatchlist = async (req, res) => {
    const { email, symbol } = req.body;

    try {
        const updatedWatchlist = await watchlistService.addSymbolToWatchlist(email, symbol);

        return res.json(updatedWatchlist);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getWatchlistByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        // get the watchlist with stock prices
        const watchlistWithPrices = await watchlistService.getWatchlistByEmail(email);

        // Check if the watchlist is empty
        if (!watchlistWithPrices || watchlistWithPrices.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(watchlistWithPrices);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



exports.removeSymbolFromWatchlist = async (req, res) => {
    const { email, symbol } = req.body;

    try {
        const updatedWatchlist = await watchlistService.removeSymbolFromWatchlist(email, symbol);

        return res.json(updatedWatchlist);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getStockSuggestions = async (req, res) => {
    const symbolPrefix = req.params.symbol || '';
    const limit = req.query.limit || 5;

    try {
        const suggestions = await watchlistService.getStockSuggestions(symbolPrefix, limit);

        return res.json(suggestions);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error getting stock suggestions' });
    }
};