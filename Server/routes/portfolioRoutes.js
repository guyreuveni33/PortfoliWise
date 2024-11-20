const express = require('express');
const {
    getPortfolioData,
    getHistoricalData,
    getRecommendation,
    addPortfolio,
    deletePortfolio,
    calculateAnnualTax,
    calculatePortfolioNetGain
} = require('../controllers/portfolioController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/portfolios', authMiddleware, getPortfolioData);
router.get('/portfolio/historical_data', authMiddleware, getHistoricalData);
router.get('/portfolio/recommendation/:symbol', getRecommendation);
router.post('/portfolios', authMiddleware, addPortfolio);
router.delete('/portfolios/:id', authMiddleware, deletePortfolio);
router.get('/portfolio/annual-tax', authMiddleware, calculateAnnualTax);
router.get('/portfolio/annual-tax/:portfolioId', authMiddleware, calculatePortfolioNetGain);


module.exports = router;
