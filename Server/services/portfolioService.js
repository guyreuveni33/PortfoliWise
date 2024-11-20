const axios = require('axios');
const Portfolio = require('../models/Portfolio');
const {getStockRecommendation} = require('./stockService');

const PAPER_URL = 'https://paper-api.alpaca.markets';
const DATA_URL = 'https://data.alpaca.markets';
const TAX_RATE = 0.25;

const mergeAggregatedBars = (existingBars, newBars) => {
    const mergedMap = new Map();

    // Add existing bars to the map
    existingBars.forEach((bar) => {
        mergedMap.set(bar.t, bar);
    });

    // Merge with new bars
    newBars.forEach((bar) => {
        if (mergedMap.has(bar.t)) {
            mergedMap.set(bar.t, {
                t: bar.t,
                value: mergedMap.get(bar.t).value + bar.value,
            });
        } else {
            mergedMap.set(bar.t, bar);
        }
    });

    // Convert map to array and sort
    return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(a.t) - new Date(b.t)
    );
};

const getPortfolioData = async (userId) => {
    try {
        // Fetch all portfolios associated with the user
        const portfolios = await Portfolio.find({user: userId});
        if (!portfolios.length) {
            return [];
        }

        const portfolioDataPromises = portfolios.map(async (portfolio) => {
            const {apiKey, secretKey} = portfolio;

            const paperClient = axios.create({
                baseURL: PAPER_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey,
                },
            });

            try {
                const response = await paperClient.get('/v2/positions');
                const positions = response.data.map((position) => ({
                    name: position.symbol,
                    balance: position.market_value,
                    price: position.current_price,
                    todayChange: position.unrealized_intraday_plpc * 100,
                    weekChange: position.unrealized_plpc * 100,
                }));

                return {
                    portfolioId: portfolio._id,
                    positions,
                };
            } catch (error) {
                console.error(
                    `Error fetching data for portfolio ${portfolio._id}:`,
                    error.response?.data || error.message
                );
                return {
                    portfolioId: portfolio._id,
                    error: 'Failed to fetch portfolio data',
                };
            }
        });

        const portfolioData = await Promise.all(portfolioDataPromises);
        return portfolioData;
    } catch (error) {
        console.error('Error in getPortfolioData:', error);
        throw error;
    }
};

const getHistoricalData = async (userId, timeframe) => {
    const now = new Date();
    let startDate;
    let barTimeframe;

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
            return {bars: [], holdings: []};
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
                    'APCA-API-SECRET-KEY': secretKey,
                },
            });

            const dataClient = axios.create({
                baseURL: DATA_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey,
                },
            });

            // Initialize transactionDates to store the earliest transaction date per symbol
            let transactionDates = {};

            try {
                const ordersResponse = await paperClient.get('/v2/orders', {
                    params: {
                        status: 'filled',
                        until: new Date().toISOString(),
                        limit: 500, // max number of orders
                    },
                });

                ordersResponse.data.forEach((order) => {
                    const symbol = order.symbol;
                    const filledAt = new Date(order.filled_at);
                    if (
                        !transactionDates[symbol] ||
                        filledAt < new Date(transactionDates[symbol])
                    ) {
                        transactionDates[symbol] = filledAt.toISOString();
                    }
                });
            } catch (error) {
                console.error(
                    `Error fetching transaction history for portfolio ${portfolio._id}:`,
                    error.response?.data || error.message
                );
            }

            try {
                const positionsResponse = await paperClient.get('/v2/positions');
                const positions = positionsResponse.data;

                if (!positions.length) {
                    continue;
                }

                // Separate crypto and non-crypto positions
                const cryptoPositions = positions.filter(
                    (position) => position.asset_class === 'crypto'
                );
                const nonCryptoPositions = positions.filter(
                    (position) => position.asset_class !== 'crypto'
                );

                // Add crypto positions' market value to the total
                cryptoPositions.forEach((position) => {
                    totalCryptoValue += parseFloat(position.market_value);
                });

                // Get historical data for each non-crypto position
                const historicalDataPromises = nonCryptoPositions.map(
                    async (position) => {
                        const symbol = position.symbol;
                        const quantity = parseFloat(position.qty);

                        try {
                            // Determine the earliest transaction date for the symbol
                            const earliestTransactionDate = transactionDates[symbol]
                                ? new Date(transactionDates[symbol])
                                : null;
                            let effectiveStartDate = startDate;
                            if (
                                earliestTransactionDate &&
                                earliestTransactionDate > startDate
                            ) {
                                effectiveStartDate = earliestTransactionDate;
                            }

                            // Fetch historical bars from effectiveStartDate to now
                            const response = await dataClient.get(
                                `/v2/stocks/${symbol}/bars`,
                                {
                                    params: {
                                        timeframe: barTimeframe,
                                        start: effectiveStartDate.toISOString(),
                                        end: new Date().toISOString(),
                                        limit: '10000',
                                        adjustment: 'raw',
                                        feed: 'iex',
                                        sort: 'asc',
                                    },
                                }
                            );

                            if (!response.data.bars) {
                                console.log(`No data returned for ${symbol}`);
                                return [];
                            }

                            return response.data.bars.map((bar) => ({
                                t: bar.t,
                                value: parseFloat(bar.c) * quantity,
                                symbol: symbol,
                                qty: quantity,
                            }));
                        } catch (error) {
                            console.error(
                                `Error fetching historical data for ${symbol} in portfolio ${portfolio._id}:`,
                                error.response?.data || error.message
                            );
                            return [];
                        }
                    }
                );

                const allPositionsData = await Promise.all(historicalDataPromises);

                const aggregatedMap = new Map();

                // Aggregate data from all positions
                allPositionsData.forEach((positionBars) => {
                    positionBars.forEach((bar) => {
                        const timestamp = bar.t;
                        if (aggregatedMap.has(timestamp)) {
                            aggregatedMap.set(timestamp, {
                                t: timestamp,
                                value: aggregatedMap.get(timestamp).value + bar.value,
                            });
                        } else {
                            aggregatedMap.set(timestamp, {
                                t: timestamp,
                                value: bar.value,
                            });
                        }
                    });
                });

                // Convert map to array and sort by timestamp
                const portfolioAggregatedBars = Array.from(aggregatedMap.values()).sort(
                    (a, b) => new Date(a.t) - new Date(b.t)
                );

                // Merge with existing aggregatedBars
                aggregatedBars = mergeAggregatedBars(
                    aggregatedBars,
                    portfolioAggregatedBars
                );

                positions.forEach((position) => {
                    const symbol = position.symbol;
                    let oldestTransactionDate = transactionDates[symbol] || 'N/A';

                    // If the holding is crypto it has no transaction date, use the oldest non-crypto date in the portfolio
                    if (oldestTransactionDate === 'N/A') {
                        oldestTransactionDate = Object.values(transactionDates)
                            .filter(date => date !== 'N/A')
                            .map(date => new Date(date))
                            .reduce((earliest, date) => (date < earliest ? date : earliest), new Date())
                            .toISOString();
                    }

                    allHoldings.push({
                        symbol: symbol,
                        qty: position.qty,
                        marketValue: position.market_value,
                        assetClass: position.asset_class,
                        oldestTransactionDate: oldestTransactionDate,
                    });
                });

            } catch (error) {
                console.error(
                    `Error processing positions for portfolio ${portfolio._id}:`,
                    error.response?.data || error.message
                );
            }
        }

        try {
            const now = new Date();
            // Find the oldest transaction date for all holdings
            let globalOldestTransactionDate = now;
            allHoldings.forEach(holding => {
                const transactionDate = new Date(holding.oldestTransactionDate);
                if (transactionDate < globalOldestTransactionDate) {
                    globalOldestTransactionDate = transactionDate;
                }

            });

            // Filter aggregatedBars to get relevant timestamps
            const relevantBars = [];
            aggregatedBars.forEach(bar => {
                const barDate = new Date(bar.t);
                if (barDate >= globalOldestTransactionDate && barDate <= now) {
                    relevantBars.push(bar);
                }
            });

            // Add totalCryptoValue to each relevant timestamp
            if (relevantBars.length > 0) {
                relevantBars.forEach(bar => {
                    bar.value += totalCryptoValue;
                });
            } else {
                // If no relevant timestamps exist, add a new entry with the oldest transaction date
                aggregatedBars.unshift({
                    t: globalOldestTransactionDate.toISOString(),
                    value: totalCryptoValue,
                });
            }


            return {bars: aggregatedBars, holdings: allHoldings};
        } catch (error) {
            console.error('Error finalizing historical data:', error);
            throw new Error('Failed to finalize historical data');
        }
    } catch (error) {
        console.error('Error in getHistoricalData:', error.response?.data || error.message);
        throw new Error('Failed to fetch historical data');
    }
};


const getRecommendation = async (symbol) => {
    if (!symbol) {
        throw new Error('Stock symbol is required');
    }

    try {
        const recommendation = await getStockRecommendation(symbol);
        return recommendation;
    } catch (error) {
        console.error(`Error getting recommendation: ${error}`);
        throw new Error('Failed to get recommendation');
    }
};


const addPortfolio = async (userId, apiKey, secretKey) => {
    if (!apiKey || !secretKey) {
        throw new Error('API Key and Secret Key are required');
    }

    try {
        // Check if the portfolio already exists for this user
        const existingPortfolio = await Portfolio.findOne({
            user: userId,
            apiKey,
        });
        if (existingPortfolio) {
            throw new Error('Portfolio with this API Key already exists.');
        }

        // Validate the API keys with Alpaca API
        const paperClient = axios.create({
            baseURL: PAPER_URL,
            headers: {
                'APCA-API-KEY-ID': apiKey,
                'APCA-API-SECRET-KEY': secretKey,
            },
        });

        // Fetch the account
        const accountResponse = await paperClient.get('/v2/account');
        if (accountResponse.status !== 200) {
            throw new Error('Invalid API Key or Secret Key');
        }

        // Create a new portfolio
        const portfolio = new Portfolio({
            user: userId,
            apiKey,
            secretKey,
        });

        await portfolio.save();
        return {message: 'Portfolio added successfully'};
    } catch (error) {
        console.error('Error adding portfolio:', error.response?.data || error.message);

        if (error.response && error.response.status === 401) {
            throw new Error('Invalid API Key or Secret Key');
        }

        throw new Error(error.message || 'Internal server error');
    }
};


const deletePortfolio = async (userId, portfolioId) => {
    try {
        // Find the portfolio by ID
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }

        // Check if the portfolio belongs to the user
        if (portfolio.user.toString() !== userId.toString()) {
            throw new Error('Unauthorized to delete this portfolio');
        }

        // Delete the portfolio
        await Portfolio.findByIdAndDelete(portfolioId);

        return {message: 'Portfolio deleted successfully'};
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        throw new Error(error.message || 'Internal server error');
    }
};


const calculateAnnualTax = async (userId) => {
    try {
        // Fetch all portfolios for the user
        const portfolios = await Portfolio.find({user: userId});
        if (!portfolios.length) {
            return {annualTax: 0};
        }

        let totalGains = 0;
        let totalLosses = 0;

        for (const portfolio of portfolios) {
            const {apiKey, secretKey} = portfolio;

            const paperClient = axios.create({
                baseURL: PAPER_URL,
                headers: {
                    'APCA-API-KEY-ID': apiKey,
                    'APCA-API-SECRET-KEY': secretKey,
                },
            });

            try {
                const response = await paperClient.get('/v2/positions');
                const positions = response.data;

                // Calculate gains and losses for each position
                positions.forEach((position) => {
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
                console.error(
                    `Error fetching data for portfolio ${portfolio._id}:`,
                    error.response?.data || error.message
                );
            }
        }

        // Calculate overall gain or loss
        const netGain = totalGains - totalLosses;
        const annualTax = netGain > 0 ? netGain * TAX_RATE : 0;

        return {annualTax, netGain, totalGains, totalLosses};
    } catch (error) {
        console.error('Error calculating annual tax:', error);
        throw new Error('Internal server error');
    }
};


const calculatePortfolioTax = async (portfolioId) => {
    try {
        const portfolio = await Portfolio.findById(portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }

        let totalGains = 0;
        let totalLosses = 0;

        const {apiKey, secretKey} = portfolio;

        const paperClient = axios.create({
            baseURL: PAPER_URL,
            headers: {
                'APCA-API-KEY-ID': apiKey,
                'APCA-API-SECRET-KEY': secretKey,
            },
        });

        try {
            const response = await paperClient.get('/v2/positions');
            const positions = response.data;

            positions.forEach((position) => {
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

        return {annualTax, netGain, totalGains, totalLosses};
    } catch (error) {
        console.error('Error calculating portfolio tax:', error);
        throw new Error('Internal server error');
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
