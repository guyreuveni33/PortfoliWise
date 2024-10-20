const { spawn } = require('child_process');
const User = require('../models/User');

const yfinance = require('yfinance');  // Assuming you already set this up

exports.addToWatchlist = async (req, res) => {
    const userId = req.user.userId;  // Assuming you are getting the user ID from the decoded token
    const { symbol } = req.body;  // Extract 'symbol' from request body

    if (!symbol) {
        return res.status(400).send('Symbol is required');
    }

    try {
        // Fetch the stock data using your Python script or any service
        const stockData = await fetchStockData([symbol]);  // Pass the symbol to fetch stock data

        if (!stockData[symbol]) {
            return res.status(404).send('Stock data not found');
        }

        // Add symbol to the user's watchlist (assuming the user model is set up properly)
        const user = await User.findById(userId);
        user.watchlist.push({ symbol });  // Add symbol to the watchlist
        await user.save();

        res.status(200).json({ message: 'Symbol added to watchlist', stockData });
    } catch (error) {
        console.error('Error adding symbol to watchlist:', error);
        res.status(500).json({ message: 'Error adding symbol to watchlist' });
    }
};