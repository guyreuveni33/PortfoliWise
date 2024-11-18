const { spawn } = require('child_process');

const getMultipleStockPrices = async (symbols) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['../Server/scripts/stockScript.py', ...symbols]);

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

const getStockRecommendation = (symbol) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['../Server/scripts/stockAnalyzer.py', symbol]);

        let output = '';
        let errorOutput = '';

        // Collect data
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Capture any error output
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
