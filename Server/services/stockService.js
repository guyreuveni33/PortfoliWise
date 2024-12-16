const { spawn } = require('child_process');
const path = require('path');

// Fetch multiple stock prices using a Python script
const getMultipleStockPrices = async (symbols) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '../scripts/live_price_tracker.py'); // Use absolute path
        const pythonProcess = spawn('python', [scriptPath, ...symbols]);

        let scriptOutput = '';
        let errorOutput = '';

        // Collect data from Python stdout
        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        // Collect data from Python stderr
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`Error from Python script: ${data}`);
        });

        // Handle process close
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const parsedData = JSON.parse(scriptOutput);
                    resolve(parsedData); // Return parsed data
                } catch (error) {
                    console.error('Error parsing Python script output:', error.message);
                    reject('Error parsing Python script output');
                }
            } else {
                console.error(`Python script exited with code ${code}: ${errorOutput}`);
                reject(`Python script closed with error: ${errorOutput}`);
            }
        });
    });
};

// Symbol mapping for cryptocurrency symbols
const symbolMapping = {
    BTCUSD: 'BTC-USD',
    ETHUSD: 'ETH-USD',
};

// Get a stock recommendation using a Python script
const getStockRecommendation = (symbol) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '../scripts/stock_Analyzer.py'); // Use absolute path
        const mappedSymbol = symbolMapping[symbol] || symbol; // Map the symbol if needed

        const pythonProcess = spawn('python', [scriptPath, mappedSymbol]);

        let output = '';
        let errorOutput = '';

        // Collect data from Python stdout
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Collect data from Python stderr
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`Error from Python script: ${data}`);
        });

        // Handle process close
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const recommendation = JSON.parse(output);
                    resolve(recommendation); // Return parsed recommendation
                } catch (error) {
                    console.error('Error parsing Python script output:', error.message);
                    reject(`Parsing error: ${error.message}`);
                }
            } else {
                console.error(`Python script exited with code ${code}: ${errorOutput}`);
                reject(`Process exited with code ${code}: ${errorOutput}`);
            }
        });
    });
};

// Export the functions
module.exports = {
    getMultipleStockPrices,
    getStockRecommendation,
};
