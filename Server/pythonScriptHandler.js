const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cache file path
const CACHE_FILE = path.resolve(__dirname, 'stock_predictions.json');

// Function to save data to cache
const save_to_cache = (symbol, data) => {
    try {
        let cache = {};
        if (fs.existsSync(CACHE_FILE)) {
            cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        }
        cache[symbol] = { ...data, date: new Date().toISOString().split('T')[0] };

        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    } catch (error) {
        // Handle error silently
    }
};

// Function to run the Python script for a stock symbol
const runScriptForStock = (symbol) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['../Server/scripts/stock_Analyzer.py', symbol]);

        let output = '';
        let errorOutput = '';

        // Collect Python script output
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Capture Python script errors
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const recommendation = JSON.parse(output);
                    save_to_cache(symbol, recommendation); // Save result to cache
                    resolve(recommendation);
                } catch (error) {
                    reject(`Parsing error for ${symbol}: ${error.message}`);
                }
            } else {
                reject(`Python script exited with code ${code}`);
            }
        });
    });
};

// Function to process multiple stocks
const runScriptForTopStocks = async () => {
    const topStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC-USD', 'ETH-USD', 'NFLX'];

    for (const symbol of topStocks) {
        try {
            await runScriptForStock(symbol);
        } catch (error) {
            // Handle error silently
        }
    }
};

// Export functions
module.exports = {
    runScriptForStock,
    runScriptForTopStocks,
};
