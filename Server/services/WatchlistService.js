const User = require('../models/User'); // Import the User model
const { getMultipleStockPrices } = require('./stockService'); // Import the stock price fetching service

// Service to add a symbol to the user's watchlist
exports.addSymbolToWatchlist = async (email, symbol) => {
    try {
        // Find the user by email and add the symbol to the watchlist
        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { watchlist: { symbol: symbol } } },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return user.watchlist;
    } catch (error) {
        console.error('Error in addSymbolToWatchlist service:', error);
        throw error;
    }
};

// Service to get the user's watchlist by email and fetch stock prices
exports.getWatchlistByEmail = async (email) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const watchlistSymbols = user.watchlist.map(item => item.symbol);

        // Fetch stock prices for the symbols in the user's watchlist
        const stockPrices = await getMultipleStockPrices(watchlistSymbols);

        // Combine the watchlist symbols and stock prices
        const watchlistWithPrices = user.watchlist.map(item => ({
            symbol: item.symbol,
            price: stockPrices[item.symbol] || 'Price not available'
        }));

        return watchlistWithPrices;
    } catch (error) {
        console.error('Error in getWatchlistByEmail service:', error);
        throw error;
    }
};
