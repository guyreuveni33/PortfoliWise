// routes/portfolioRoutes.js

const express = require('express');
const {
    getPortfolioData,
    getHistoricalData,
    getRecommendation,
    addPortfolio
} = require('../controllers/portfolioController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get all portfolios data
router.get('/portfolios', authMiddleware, getPortfolioData);

// Route to get historical data for the graph
router.get('/portfolio/historical_data', authMiddleware, getHistoricalData);

// Route to get stock recommendation
router.get('/portfolio/recommendation/:symbol', getRecommendation);

// Route to add a new portfolio
router.post('/portfolios', authMiddleware, addPortfolio);

module.exports = router;
