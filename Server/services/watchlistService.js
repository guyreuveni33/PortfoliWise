const User = require('../models/User');
const {getMultipleStockPrices} = require('./stockService');
const {spawn} = require('child_process');
const path = require('path'); // Import the path module

exports.addSymbolToWatchlist = async (email, symbol) => {
    try {
        // Find the user by email and add the symbol to the watchlist
        const user = await User.findOneAndUpdate(
            {email: email},
            {$push: {watchlist: {symbol: symbol}}},
            {new: true}
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
        const user = await User.findOne({email});

        if (!user) {
            console.warn(`User not found for email: ${email}`);
            return [];
        }

        if (user.watchlist.length === 0) {
            return [];
        }
        // Get the stock symbol for each item in the watchlist
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



exports.getStockSuggestions = (symbolPrefix, limit = 5) => {
    return new Promise((resolve, reject) => {
        // Use path.resolve to get an absolute path to the Python script
        const scriptPath = path.resolve(__dirname, '../scripts/stock_symbol_lookup.py');

        // Spawn the Python process with the correct script path and arguments
        const pythonProcess = spawn('python', [scriptPath, symbolPrefix, limit.toString()]);

        let resultData = '';
        let errorData = '';

        // Collect data from stdout
        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        // Collect data from stderr (any error messages from Python)
        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error(`Error from Python script: ${data}`);
        });

        // Handle process close
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const suggestions = JSON.parse(resultData);
                    resolve(suggestions); // Successfully parse and return suggestions
                } catch (err) {
                    console.error('Error parsing Python script output:', err.message);
                    reject('Error parsing Python script output');
                }
            } else {
                console.error(`Python script exited with code ${code}: ${errorData}`);
                reject(`Python script exited with code ${code}: ${errorData}`);
            }
        });
    });
};

exports.removeSymbolFromWatchlist = async (email, symbol) => {
    try {
        const user = await User.findOneAndUpdate(
            {email: email},
            {$pull: {watchlist: {symbol: symbol}}},
            {new: true}
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
