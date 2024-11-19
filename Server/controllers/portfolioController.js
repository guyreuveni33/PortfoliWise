const portfolioService = require('../services/portfolioService');

const getPortfolioData = async (req, res) => {
    const userId = req.user._id;
    try {
        const data = await portfolioService.getPortfolioData(userId);
        res.json(data);
    } catch (error) {
        console.error('Error in getPortfolioData:', error);
        res.status(500).json({ error: 'Failed to get portfolio data' });
    }
};

const getHistoricalData = async (req, res) => {
    const userId = req.user._id;
    const { timeframe } = req.query;
    try {
        const data = await portfolioService.getHistoricalData(userId, timeframe);
        res.json(data);
    } catch (error) {
        console.error('Error in getHistoricalData:', error);
        res.status(500).json({ error: 'Failed to get historical data' });
    }
};

const getRecommendation = async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const recommendation = await portfolioService.getRecommendation(symbol);
        res.json(recommendation);
    } catch (error) {
        console.error('Error getting recommendation:', error);
        res.status(500).json({ error: 'Failed to get recommendation' });
    }
};

const addPortfolio = async (req, res) => {
    const { apiKey, secretKey } = req.body;
    const userId = req.user._id;
    try {
        const result = await portfolioService.addPortfolio(userId, apiKey, secretKey);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding portfolio:', error);
        res.status(400).json({ error: error.message });
    }
};

const deletePortfolio = async (req, res) => {
    const userId = req.user._id;
    const portfolioId = req.params.id;
    try {
        const result = await portfolioService.deletePortfolio(userId, portfolioId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(400).json({ error: error.message });
    }
};

const calculateAnnualTax = async (req, res) => {
    const userId = req.user._id;
    try {
        const result = await portfolioService.calculateAnnualTax(userId);
        res.json(result);
    } catch (error) {
        console.error('Error calculating annual tax:', error);
        res.status(500).json({ error: 'Failed to calculate annual tax' });
    }
};

const calculatePortfolioTax = async (req, res) => {
    const portfolioId = req.params.portfolioId;
    try {
        const result = await portfolioService.calculatePortfolioTax(portfolioId);
        res.json(result);
    } catch (error) {
        console.error('Error calculating portfolio tax:', error);
        res.status(500).json({ error: 'Failed to calculate portfolio tax' });
    }
};

module.exports = {
    getPortfolioData,
    getHistoricalData,
    getRecommendation,
    addPortfolio,
    deletePortfolio,
    calculateAnnualTax,
    calculatePortfolioTax,
};
