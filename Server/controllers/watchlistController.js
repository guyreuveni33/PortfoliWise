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
// Controller to fetch the user's watchlist by email and include stock prices
exports.getWatchlistByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        // Call the service function to get the watchlist with stock prices
        const watchlistWithPrices = await watchlistService.getWatchlistByEmail(email);

        // Check if the watchlist is empty
        if (!watchlistWithPrices || watchlistWithPrices.length === 0) {
            return res.status(200).json([]); // Respond with an empty array
        }

        // Return the watchlist with stock prices
        return res.status(200).json(watchlistWithPrices);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Send an appropriate error response
    }
};



// Controller to remove a symbol from the user's watchlist
exports.removeSymbolFromWatchlist = async (req, res) => {
    const { email, symbol } = req.body;

    try {
        // Call the service function to remove the symbol
        const updatedWatchlist = await watchlistService.removeSymbolFromWatchlist(email, symbol);

        // Return the updated watchlist
        return res.json(updatedWatchlist);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getStockSuggestions = async (req, res) => {
    const symbolPrefix = req.params.symbol || '';
    const limit = req.query.limit || 5;

    try {
        // Call the service function to get stock suggestions
        const suggestions = await watchlistService.getStockSuggestions(symbolPrefix, limit);

        // Send back the suggestions
        return res.json(suggestions);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error getting stock suggestions' });
    }
};