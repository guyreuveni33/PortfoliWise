import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = `${API_URL}/api/watchlist`;

const WatchlistService = {
    getSymbolSuggestions: async (prefix) => {
        try {
            const response = await axios.get(`${BASE_URL}/symbol-suggestions/${prefix}`);

            return response.data;
        } catch (error) {
            console.error('Error fetching stock symbol suggestions:', error);
            return [];
        }
    },

    addSymbol: async (email, symbol) => {
        try {
            const response = await axios.post(`${BASE_URL}/add-symbol`, { email, symbol });
            return response.data;
        } catch (error) {
            console.error('Error adding symbol to watchlist:', error);
            throw error;
        }
    },

    getWatchlist: async (email) => {
        if (!email) {
            throw new Error('Email is required to fetch the watchlist.');
        }
        try {
            const response = await axios.get(`${BASE_URL}/${email}`);
            console.log(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            throw error;
        }
    },

    removeSymbol: async (email, symbol) => {
        try {
            const response = await axios.delete(`${BASE_URL}/remove-symbol`, {
                data: { email, symbol },
            });
            return response.data;
        } catch (error) {
            console.error('Error removing symbol from watchlist:', error);
            throw error;
        }
    },
};

export default WatchlistService;
