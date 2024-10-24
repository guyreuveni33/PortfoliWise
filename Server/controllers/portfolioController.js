// controllers/portfolioController.js
const axios = require('axios');

const API_KEY = 'PKSFUVG2319Z6IHQ3SY0';
const API_SECRET = 'vaq7UpjhRKhROTRLppSfRxNDGrXQchxOogivOFAS';
const PAPER_URL = 'https://paper-api.alpaca.markets';
const DATA_URL = 'https://data.alpaca.markets';

// Create axios instances with default configs
const paperClient = axios.create({
    baseURL: PAPER_URL,
    headers: {
        'APCA-API-KEY-ID': API_KEY,
        'APCA-API-SECRET-KEY': API_SECRET
    }
});

const dataClient = axios.create({
    baseURL: DATA_URL,
    headers: {
        'APCA-API-KEY-ID': API_KEY,
        'APCA-API-SECRET-KEY': API_SECRET
    }
});

const getPortfolioData = async (req, res) => {
    try {
        const response = await paperClient.get('/v2/positions');
        const positions = response.data.map(position => ({
            name: position.symbol,
            balance: position.market_value,
            price: position.current_price,
            todayChange: position.unrealized_intraday_plpc * 100,
            weekChange: position.unrealized_plpc * 100
        }));

        res.json(positions);
    } catch (error) {
        console.error('Error fetching Alpaca portfolio data:', error.response?.data || error.message);
        res.status(500).json({error: 'Failed to fetch portfolio data'});
    }
};

const getHistoricalData = async (req, res) => {
    const { timeframe } = req.query;

    const now = new Date();
    let startDate;
    let barTimeframe;

    switch (timeframe) {
        case 'today':
            startDate = new Date(now.setHours(0,0,0,0));
            barTimeframe = '1D';
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            barTimeframe = '1D';
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            barTimeframe = '1D';
            break;
        case 'all':
            startDate = new Date(now.setFullYear(now.getFullYear() - 5));
            barTimeframe = '1D';
            break;
        default:
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            barTimeframe = '1D';
    }

    try {
        // Get positions first
        const positionsResponse = await paperClient.get('/v2/positions');
        const positions = positionsResponse.data;

        if (!positions.length) {
            return res.json({ bars: [] });
        }

        // Get historical data for each position
        const historicalDataPromises = positions.map(async position => {
            const symbol = position.symbol;
            const quantity = parseFloat(position.qty);

            try {
                const response = await dataClient.get('/v2/stocks/bars', {
                    params: {
                        symbols: symbol,
                        timeframe: barTimeframe,
                        start: startDate.toISOString(),
                        end: new Date().toISOString(),
                        limit: '10000',
                        adjustment: 'raw',
                        feed: 'iex',
                        sort: 'asc'
                    }
                });

                // Debug log to see the full data structure
                console.log(`Data for ${symbol}:`, JSON.stringify(response.data, null, 2));

                if (!response.data.bars || !response.data.bars[symbol]) {
                    console.log(`No data returned for ${symbol}`);
                    return [];
                }

                // Transform the data for this symbol
                return response.data.bars[symbol].map(bar => ({
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
        const aggregatedBars = Array.from(aggregatedMap.values())
            .sort((a, b) => new Date(a.t) - new Date(b.t));

        // Debug log to see the final transformed data
        console.log('Final aggregated data:', JSON.stringify({
            barCount: aggregatedBars.length,
            firstBar: aggregatedBars[0],
            lastBar: aggregatedBars[aggregatedBars.length - 1]
        }, null, 2));

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


module.exports = { getPortfolioData, getHistoricalData };