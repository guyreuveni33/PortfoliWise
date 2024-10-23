// controllers/portfolioController.js
const axios = require('axios');

const getPortfolioData = async (req, res) => {
    try {
        const API_KEY = 'PKSFUVG2319Z6IHQ3SY0';
        const API_SECRET = 'vaq7UpjhRKhROTRLppSfRxNDGrXQchxOogivOFAS';
        const BASE_URL = 'https://paper-api.alpaca.markets';

        const headers = {
            'APCA-API-KEY-ID': API_KEY,
            'APCA-API-SECRET-KEY': API_SECRET
        };

        // Fetch positions from Alpaca API (this gets your portfolio)
        const response = await axios.get(`${BASE_URL}/v2/positions`, { headers });
        const positions = response.data.map(position => ({
            name: position.symbol,
            balance: position.market_value,
            price: position.current_price, // Current market value of the position
            todayChange: position.unrealized_intraday_plpc * 100, // Percentage change for today
            weekChange: position.unrealized_plpc * 100 // Weekly percentage change
        }));

        // Send the portfolio data to the client
        res.json(positions);
    } catch (error) {
        console.error('Error fetching Alpaca portfolio data:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
};

module.exports = {
    getPortfolioData,
};
