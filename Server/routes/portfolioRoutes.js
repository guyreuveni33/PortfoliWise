// routes/portfolioRoutes.js
const express = require('express');
const {getPortfolioData, getHistoricalData} = require('../controllers/portfolioController');
const router = express.Router();

// Route to get portfolio data from Alpaca API
router.get('/portfolio', getPortfolioData);

// New route to get historical data for the graph
router.get('/portfolio/historical_data', getHistoricalData); // Add this route

module.exports = router;
