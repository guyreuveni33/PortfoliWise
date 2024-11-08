// controllers/portfolioController.js

const axios = require('axios');
const Portfolio = require('../models/Portfolio');
const { getStockRecommendation } = require('../services/stockService');

const PAPER_URL = 'https://paper-api.alpaca.markets';
const DATA_URL = 'https://data.alpaca.markets';

const getPortfolioData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all portfolios associated with the user
        const portfolios = await Portfolio.find({ user: userId });
        if (!portfolios.length) {
            return res.json([]);
        }

        const portfolioDataPromises = portfolios.map(async (portfolio) => {
            const { apiKey, secretKey } = portfolio;

            // Create axios instance with user's API keys
            const paperClient = axios.create({
                baseURL: PAPER_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey
                }
            });

            try {
                const response = await paperClient.get('/v2/positions');
                const positions = response.data.map(position => ({
                    name: position.symbol,
                    balance: position.market_value,
                    price: position.current_price,
                    todayChange: position.unrealized_intraday_plpc * 100,
                    weekChange: position.unrealized_plpc * 100
                }));

                return {
                    portfolioId: portfolio._id,
                    positions
                };
            } catch (error) {
                console.error(`Error fetching data for portfolio ${portfolio._id}:`, error.response?.data || error.message);
                return {
                    portfolioId: portfolio._id,
                    error: 'Failed to fetch portfolio data'
                };
            }
        });

        const portfolioData = await Promise.all(portfolioDataPromises);

        res.json(portfolioData);
    } catch (error) {
        console.error('Error in getPortfolioData:', error);
        res.json([]); // Return an empty array on error
    }
};

const getHistoricalData = async (req, res) => {
    const userId = req.user._id;
    const { timeframe } = req.query;
    const now = new Date();
    let startDate;
    let barTimeframe;

    switch (timeframe) {
        case 'today':
            startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            barTimeframe = '1D'; // Hourly data
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            barTimeframe = '1D';
            break;
        case 'year':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            barTimeframe = '1D';
            break;
        case 'all':
            startDate = new Date(now.setFullYear(now.getFullYear() - 5));
            barTimeframe = '1D';
            break;
        default:
            startDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
            barTimeframe = '1D';
    }

    try {
        // Fetch all portfolios associated with the user
        const portfolios = await Portfolio.find({ user: userId });

        if (!portfolios.length) {
            return res.json({ bars: [] });
        }

        // Aggregate data from all portfolios
        let aggregatedBars = [];

        for (const portfolio of portfolios) {
            const { apiKey, secretKey } = portfolio;

            const paperClient = axios.create({
                baseURL: PAPER_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey
                }
            });

            const dataClient = axios.create({
                baseURL: DATA_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey
                }
            });

            // Get positions first
            const positionsResponse = await paperClient.get('/v2/positions');
            const positions = positionsResponse.data;

            if (!positions.length) {
                continue; // Skip if no positions in this portfolio
            }

            // Get historical data for each position
            const historicalDataPromises = positions.map(async position => {
                const symbol = position.symbol;
                const quantity = parseFloat(position.qty);

                try {
                    const response = await dataClient.get(`/v2/stocks/${symbol}/bars`, {
                        params: {
                            timeframe: barTimeframe,
                            start: startDate.toISOString(),
                            end: new Date().toISOString(),
                            limit: '10000',
                            adjustment: 'raw',
                            feed: 'iex',
                            sort: 'asc'
                        }
                    });

                    if (!response.data.bars) {
                        console.log(`No data returned for ${symbol}`);
                        return [];
                    }

                    // Transform the data for this symbol
                    return response.data.bars.map(bar => ({
                        t: bar.t,
                        value: parseFloat(bar.c) * quantity, // Ensure we're using the closing price
                        symbol: symbol, // Add symbol for debugging
                        qty: quantity // Add quantity for debugging
                    }));
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error.response?.data || error.message);
                    return [];
                }
            });

            const allPositionsData = await Promise.all(historicalDataPromises);

            // Create a map to store aggregated values by timestamp
            const aggregatedMap = new Map();

            // Aggregate data from all positions
            allPositionsData.forEach(positionBars => {
                positionBars.forEach(bar => {
                    const timestamp = bar.t;
                    if (aggregatedMap.has(timestamp)) {
                        aggregatedMap.set(timestamp, {
                            t: timestamp,
                            value: aggregatedMap.get(timestamp).value + bar.value
                        });
                    } else {
                        aggregatedMap.set(timestamp, {
                            t: timestamp,
                            value: bar.value
                        });
                    }
                });
            });

            // Convert map to array and sort
            const portfolioAggregatedBars = Array.from(aggregatedMap.values())
                .sort((a, b) => new Date(a.t) - new Date(b.t));

            aggregatedBars = mergeAggregatedBars(aggregatedBars, portfolioAggregatedBars);
        }

        res.json({ bars: aggregatedBars });
    } catch (error) {
        console.error('Error in getHistoricalData:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Failed to fetch historical data',
            error: error.response?.data?.message || error.message,
            details: error.response?.data
        });
    }
};

const mergeAggregatedBars = (existingBars, newBars) => {
    const mergedMap = new Map();

    // Add existing bars to the map
    existingBars.forEach(bar => {
        mergedMap.set(bar.t, bar);
    });

    // Merge with new bars
    newBars.forEach(bar => {
        if (mergedMap.has(bar.t)) {
            mergedMap.set(bar.t, {
                t: bar.t,
                value: mergedMap.get(bar.t).value + bar.value
            });
        } else {
            mergedMap.set(bar.t, bar);
        }
    });

    // Convert map to array and sort
    return Array.from(mergedMap.values()).sort((a, b) => new Date(a.t) - new Date(b.t));
};

async function getRecommendation(req, res) {
    const symbol = req.params.symbol;

    if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
    }

    try {
        const recommendation = await getStockRecommendation(symbol);
        res.json(recommendation);
    } catch (error) {
        console.error(`Error getting recommendation: ${error}`);
        res.status(500).json({ error: 'Failed to get recommendation' });
    }
}

const addPortfolio = async (req, res) => {
    const { apiKey, secretKey } = req.body;
    const userId = req.user._id;

    if (!apiKey || !secretKey) {
        return res.status(400).json({ error: 'API Key and Secret Key are required' });
    }

    try {
        // Validate the API keys with Alpaca API
        const paperClient = axios.create({
            baseURL: PAPER_URL,
            headers: {
                'APCA-API-KEY-ID': apiKey,
                'APCA-API-SECRET-KEY': secretKey
            }
        });

        // Test the API keys by fetching the account
        const accountResponse = await paperClient.get('/v2/account');

        if (accountResponse.status !== 200) {
            return res.status(400).json({ error: 'Invalid API Key or Secret Key' });
        }

        // Create a new portfolio
        const portfolio = new Portfolio({
            user: userId,
            apiKey,
            secretKey
        });

        await portfolio.save();

        res.status(201).json({ message: 'Portfolio added successfully' });
    } catch (error) {
        console.error('Error adding portfolio:', error.response?.data || error.message);

        if (error.response && error.response.status === 401) {
            return res.status(400).json({ error: 'Invalid API Key or Secret Key' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

// **New Controller: Delete a Portfolio**
const deletePortfolio = async (req, res) => {
    const userId = req.user._id;
    const portfolioId = req.params.id;

    try {
        // Find the portfolio by ID
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Check if the portfolio belongs to the authenticated user
        if (portfolio.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this portfolio' });
        }

        // Delete the portfolio
        await Portfolio.findByIdAndDelete(portfolioId);

        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Export the new controller
module.exports = {
    getPortfolioData,
    getHistoricalData,
    getRecommendation,
    addPortfolio,
    deletePortfolio // Export the deletePortfolio controller
};
