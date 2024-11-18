const User = require('../models/User');
const { getMultipleStockPrices } = require('./stockService');

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
exports.getWatchlistByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.warn(`User not found for email: ${email}`);
            return [];
        }

        if (user.watchlist.length === 0) {
            console.info(`Watchlist is empty for user: ${email}`);
            return [];
        }

        const watchlistSymbols = user.watchlist.map(item => item.symbol);

        const stockPrices = await getMultipleStockPrices(watchlistSymbols);

        // Combine the watchlist symbols and stock prices
        const watchlistWithPrices = user.watchlist.map(item => ({
            symbol: item.symbol,
            price: stockPrices[item.symbol] || 'Price not available',
        }));

        return watchlistWithPrices;
    } catch (error) {
        console.error('Error in getWatchlistByEmail service:', error);
        throw error;
    }
};


const { spawn } = require('child_process');

exports.getStockSuggestions = (symbolPrefix, limit = 5) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['../Server/scripts/stockSuggestionsScript.py', symbolPrefix, '5']);

        let resultData = '';

        // Collect data
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const suggestions = JSON.parse(resultData);
                    resolve(suggestions);  // Resolve with the suggestions
                } catch (err) {
                    reject(new Error('Error parsing Python script output'));
                }
            } else {
                reject(new Error('Python script exited with error'));
            }
        });
    });
};

exports.removeSymbolFromWatchlist = async (email, symbol) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $pull: { watchlist: { symbol: symbol } } },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return user.watchlist;
    } catch (error) {
        console.error('Error in removeSymbolFromWatchlist service:', error);
        throw error;
    }
};
