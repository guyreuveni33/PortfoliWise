const { getMultipleStockPrices } = require('../services/stockService');

exports.getCommonStocks = async (req, res) => {
    const symbols = [
        '^GSPC', // S&P 500 Index
        '^IXIC', // NASDAQ Composite Index
        '^DJI',  // Dow Jones Industrial Average
        'BTC',  // Bitcoin USD
        'AAPL',  // Apple Inc.
        'MSFT',  // Microsoft Corporation
        'GOOGL', // Alphabet Inc. (Google)
        'TSLA',  // Tesla, Inc.
        'NVDA'   // NVIDIA Corporation
    ];
    try {
        const stockData = await getMultipleStockPrices(symbols);  // Call the service function
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ message: 'Error fetching stock data' });
    }
};
