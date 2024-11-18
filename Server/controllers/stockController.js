const { getMultipleStockPrices } = require('../services/stockService');

exports.getCommonStocks = async (req, res) => {
    const symbols = [
        '^GSPC', // S&P 500
        '^IXIC', // NASDAQ
        '^DJI',  // Dow Jones
        'BTC-USD',
        'AAPL',
        'MSFT',
        'GOOGL',
        'TSLA',
        'NVDA'
    ];
    try {
        const stockData = await getMultipleStockPrices(symbols);
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ message: 'Error fetching stock data' });
    }
};
