const { spawn } = require('child_process');

exports.getMultipleStockPrices = async (symbols) => {
    return new Promise((resolve, reject) => {
        // Pass the symbols as arguments to the Python script
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
