const { getMultipleStockPrices } = require('../services/stockService');

exports.getCommonStocks = async (req, res) => {
    const symbols = ['AAPL', 'GOOGL', 'AMZN', '^GSPC', '^IXIC', '^DJI', 'TSLA', 'MSFT', 'META', 'NFLX'];
    try {
        const stockData = await getMultipleStockPrices(symbols);  // Call the service function
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ message: 'Error fetching stock data' });
    }
};
