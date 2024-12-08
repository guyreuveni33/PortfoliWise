const { spawn } = require('child_process');

const getMultipleStockPrices = async (symbols) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['../Server/scripts/live_price_tracker.py', ...symbols]);

        let scriptOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from Python script: ${data}`);
            reject(`Error running Python script: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(scriptOutput));
                } catch (error) {
                    reject('Error parsing Python script output');
                }
            } else {
                reject('Python script closed with error');
            }
        });
    });
};


const symbolMapping = {
    BTCUSD: 'BTC-USD',
    ETHUSD: 'ETH-USD',
};

const getStockRecommendation = (symbol) => {
    return new Promise((resolve, reject) => {
        // Map the symbol if it exists in the mapping; otherwise, use the original symbol
        const mappedSymbol = symbolMapping[symbol] || symbol;
        const pythonProcess = spawn('python', ['../Server/scripts/stock_Analyzer.py', mappedSymbol]);

        let output = '';
        let errorOutput = '';

        // Collect data
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const recommendation = JSON.parse(output);
                    resolve(recommendation);
                } catch (error) {
                    reject(`Parsing error: ${error.message}`);
                }
            } else {
                reject(`Process exited with code ${code}: ${errorOutput}`);
            }
        });
    });
};

module.exports = {
    getMultipleStockPrices,
    getStockRecommendation
};
