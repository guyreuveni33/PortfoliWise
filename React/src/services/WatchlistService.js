import axios from 'axios';
const BASE_URL = 'http://localhost:3001/api/watchlist'; // Adjust this based on your server

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
            const response = await axios.post('http://localhost:3001/api/watchlist/add-symbol', { email, symbol });
            return response.data;
        } catch (error) {
            console.error('Error adding symbol to watchlist:', error);
            throw error;
        }
    },

    getWatchlist: async (email) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/watchlist/${email}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            throw error;
        }
    },

    // New method to search for stock symbols
    searchSymbols: async (query) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/watchlist/search?query=${query}`);
            return response.data; // Expecting an array of stock suggestions
        } catch (error) {
            console.error('Error fetching stock suggestions:', error);
            throw error;
        }
    }
};

export default WatchlistService;
