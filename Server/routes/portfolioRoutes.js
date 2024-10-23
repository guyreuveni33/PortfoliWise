// routes/portfolioRoutes.js
const express = require('express');
const { getPortfolioData } = require('../controllers/portfolioController');
const router = express.Router();

// Route to get portfolio data from Alpaca API
router.get('/portfolio', getPortfolioData);

module.exports = router;
