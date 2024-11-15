// controllers/portfolioController.js

const axios = require('axios');
const Portfolio = require('../models/Portfolio');
const {getStockRecommendation} = require('../services/stockService');

const PAPER_URL = 'https://paper-api.alpaca.markets';
const DATA_URL = 'https://data.alpaca.markets';

const getPortfolioData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all portfolios associated with the user
        const portfolios = await Portfolio.find({user: userId});
        if (!portfolios.length) {
            return res.json([]);
        }

        const portfolioDataPromises = portfolios.map(async (portfolio) => {
            const {apiKey, secretKey} = portfolio;

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
        console.log('portfoliodata:', JSON.stringify(portfolioData, null, 2));
        res.json(portfolioData);
    } catch (error) {
        console.error('Error in getPortfolioData:', error);
        res.json([]); // Return an empty array on error
    }
};

const getHistoricalData = async (req, res) => {
    const userId = req.user._id;
    const {timeframe} = req.query;
    const now = new Date();
    let startDate;
    let barTimeframe;

    // Determine the start date and bar timeframe based on the selected timeframe
    switch (timeframe) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            barTimeframe = '1D';
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            barTimeframe = '1D';
            break;
        case 'year':
            startDate = new Date(now.setMonth(now.getMonth() - 12));
            barTimeframe = '1D';
            break;
        case 'all':
            startDate = new Date(now.setFullYear(now.getFullYear() - 5));
            barTimeframe = '1D';
            break;
        default:
            startDate = new Date(now.setDate(now.getDate() - 7));
            barTimeframe = '1D';
    }

    try {
        // Fetch all portfolios associated with the user
        const portfolios = await Portfolio.find({user: userId});

        if (!portfolios.length) {
            return res.json({bars: [], holdings: []});
        }

        let aggregatedBars = [];
        let totalCryptoValue = 0;
        let allHoldings = [];

        for (const portfolio of portfolios) {
            const {apiKey, secretKey} = portfolio;

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

            // Initialize transactionDates to store the earliest transaction date per symbol
            let transactionDates = {};

            try {
                // **Modified Part: Fetch All Filled Orders Without 'after' Parameter**
                const ordersResponse = await paperClient.get('/v2/orders', {
                    params: {
                        status: 'filled',
                        // Removed 'after: startDate.toISOString()' to fetch all filled orders
                        until: new Date().toISOString(),
                        limit: 500, // Adjust as needed based on expected number of orders
                    }
                });

                ordersResponse.data.forEach(order => {
                    const symbol = order.symbol;
                    const filledAt = new Date(order.filled_at);
                    if (!transactionDates[symbol] || filledAt < new Date(transactionDates[symbol])) {
                        transactionDates[symbol] = filledAt.toISOString();
                    }
                });
            } catch (error) {
                console.error(`Error fetching transaction history for portfolio ${portfolio._id}:`, error.response?.data || error.message);
                // Continue processing other portfolios even if fetching orders fails
            }

            try {
                // Get current positions
                const positionsResponse = await paperClient.get('/v2/positions');
                const positions = positionsResponse.data;

                if (!positions.length) {
                    continue; // Skip if no positions in this portfolio
                }

                // Separate crypto and non-crypto positions
                const cryptoPositions = positions.filter(position => position.asset_class === 'crypto');
                const nonCryptoPositions = positions.filter(position => position.asset_class !== 'crypto');

                console.log('crypto: ', cryptoPositions);
                // Add crypto positions' market value to the total
                cryptoPositions.forEach(position => {
                    totalCryptoValue += parseFloat(position.market_value);
                });

                // Get historical data for each non-crypto position
                const historicalDataPromises = nonCryptoPositions.map(async position => {
                    const symbol = position.symbol;
                    const quantity = parseFloat(position.qty);

                    try {
                        // Determine the earliest transaction date for the symbol
                        const earliestTransactionDate = transactionDates[symbol] ? new Date(transactionDates[symbol]) : null;
                        // Effective start date is the later of timeframe's startDate or earliestTransactionDate
                        let effectiveStartDate = startDate;
                        if (earliestTransactionDate && earliestTransactionDate > startDate) {
                            effectiveStartDate = earliestTransactionDate;
                        }

                        // Fetch historical bars from effectiveStartDate to now
                        const response = await dataClient.get(`/v2/stocks/${symbol}/bars`, {
                            params: {
                                timeframe: barTimeframe,
                                start: effectiveStartDate.toISOString(),
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
                            value: parseFloat(bar.c) * quantity, // Use closing price multiplied by quantity
                            symbol: symbol, // Add symbol for debugging
                            qty: quantity // Add quantity for debugging
                        }));
                    } catch (error) {
                        console.error(`Error fetching historical data for ${symbol} in portfolio ${portfolio._id}:`, error.response?.data || error.message);
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

                // Convert map to array and sort by timestamp
                const portfolioAggregatedBars = Array.from(aggregatedMap.values())
                    .sort((a, b) => new Date(a.t) - new Date(b.t));

                // Merge with existing aggregatedBars
                aggregatedBars = mergeAggregatedBars(aggregatedBars, portfolioAggregatedBars);

                // Populate holdings with transaction dates
                positions.forEach(position => {
                    const symbol = position.symbol;
                    const oldestTransactionDate = transactionDates[symbol] || 'N/A';
                    console.log(`Portfolio ${portfolio._id} - Symbol: ${symbol} - Oldest Transaction Date: ${oldestTransactionDate}`);
                    allHoldings.push({
                        symbol: symbol,
                        qty: position.qty,
                        marketValue: position.market_value,
                        assetClass: position.asset_class,
                        oldestTransactionDate: oldestTransactionDate
                    });
                });

            } catch (error) {
                console.error(`Error processing positions for portfolio ${portfolio._id}:`, error.response?.data || error.message);
                // Continue processing other portfolios even if processing positions fails
            }
        }

        try {
            // Add crypto total to the latest timestamp in aggregated bars
            if (aggregatedBars.length > 0) {
                aggregatedBars[aggregatedBars.length - 1].value += totalCryptoValue;
            }

            console.log('Aggregated Bars:', JSON.stringify(aggregatedBars, null, 2));
            res.json({bars: aggregatedBars, holdings: allHoldings});
        } catch (error) {
            console.error('Error finalizing historical data:', error);
            res.status(500).json({error: 'Failed to finalize historical data'});
        }
    } catch (error) {
        console.error('Error in getHistoricalData:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Failed to fetch historical data',
            error: error.response?.data?.message || error.message,
            details: error.response?.data
        });
    }
}


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
        return res.status(400).json({error: 'Stock symbol is required'});
    }

    try {
        const recommendation = await getStockRecommendation(symbol);
        res.json(recommendation);
    } catch (error) {
        console.error(`Error getting recommendation: ${error}`);
        res.status(500).json({error: 'Failed to get recommendation'});
    }
}

const addPortfolio = async (req, res) => {
    const {apiKey, secretKey} = req.body;
    const userId = req.user._id;

    if (!apiKey || !secretKey) {
        return res.status(400).json({error: 'API Key and Secret Key are required'});
    }

    try {
        // Check if the portfolio already exists for this user
        const existingPortfolio = await Portfolio.findOne({user: userId, apiKey});
        if (existingPortfolio) {
            return res.status(400).json({error: 'Portfolio with this API Key already exists.'});
        }

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
            return res.status(400).json({error: 'Invalid API Key or Secret Key'});
        }

        // Create a new portfolio
        const portfolio = new Portfolio({
            user: userId,
            apiKey,
            secretKey
        });

        await portfolio.save();
        res.status(201).json({message: 'Portfolio added successfully'});
    } catch (error) {
        console.error('Error adding portfolio:', error.response?.data || error.message);

        if (error.response && error.response.status === 401) {
            return res.status(400).json({error: 'Invalid API Key or Secret Key'});
        }

        res.status(500).json({error: 'Internal server error'});
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
            return res.status(404).json({error: 'Portfolio not found'});
        }

        // Check if the portfolio belongs to the authenticated user
        if (portfolio.user.toString() !== userId.toString()) {
            return res.status(403).json({error: 'Unauthorized to delete this portfolio'});
        }

        // Delete the portfolio
        await Portfolio.findByIdAndDelete(portfolioId);

        res.json({message: 'Portfolio deleted successfully'});
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const TAX_RATE = 0.25;

const calculateAnnualTax = async (req, res) => {
    const userId = req.user._id;

    try {
        // Fetch all portfolios for the user
        const portfolios = await Portfolio.find({user: userId});
        if (!portfolios.length) {
            return res.json({annualTax: 0});
        }

        let totalGains = 0;
        let totalLosses = 0;

        for (const portfolio of portfolios) {
            const {apiKey, secretKey} = portfolio;

            const paperClient = axios.create({
                baseURL: PAPER_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey
                }
            });

            try {
                const response = await paperClient.get('/v2/positions');
                const positions = response.data;

                // Calculate gains and losses for each position
                positions.forEach(position => {
                    const marketValue = parseFloat(position.market_value);
                    const costBasis = parseFloat(position.cost_basis);
                    const profitOrLoss = marketValue - costBasis;

                    if (profitOrLoss > 0) {
                        totalGains += profitOrLoss;
                    } else {
                        totalLosses += Math.abs(profitOrLoss);
                    }
                });
            } catch (error) {
                console.error(`Error fetching data for portfolio ${portfolio._id}:`, error.response?.data || error.message);
            }
        }

        // Calculate net gain or loss
        const netGain = totalGains - totalLosses;
        const annualTax = netGain > 0 ? netGain * TAX_RATE : 0;

        res.json({annualTax, netGain, totalGains, totalLosses});
    } catch (error) {
        console.error('Error calculating annual tax:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const calculatePortfolioTax = async (req, res) => {
    const portfolioId = req.params.portfolioId;

    try {
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) {
            return res.status(404).json({error: 'Portfolio not found'});
        }

        let totalGains = 0;
        let totalLosses = 0;

        const {apiKey, secretKey} = portfolio;

        const paperClient = axios.create({
            baseURL: PAPER_URL,
            headers: {
                'APCA-API-KEY-ID': apiKey,
                'APCA-API-SECRET-KEY': secretKey
            }
        });

        try {
            const response = await paperClient.get('/v2/positions');
            const positions = response.data;

            positions.forEach(position => {
                const marketValue = parseFloat(position.market_value);
                const costBasis = parseFloat(position.cost_basis);
                const profitOrLoss = marketValue - costBasis;

                if (profitOrLoss > 0) {
                    totalGains += profitOrLoss;
                } else {
                    totalLosses += Math.abs(profitOrLoss);
                }
            });
        } catch (error) {
            console.error(`Error fetching data for portfolio ${portfolioId}:`, error.message);
        }

        const netGain = totalGains - totalLosses;
        const annualTax = netGain > 0 ? netGain * TAX_RATE : 0;

        res.json({annualTax, netGain, totalGains, totalLosses});
    } catch (error) {
        console.error('Error calculating portfolio tax:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

module.exports = {
    getPortfolioData,
    getHistoricalData,
    getRecommendation,
    addPortfolio,
    deletePortfolio,
    calculateAnnualTax,
    calculatePortfolioTax
};
