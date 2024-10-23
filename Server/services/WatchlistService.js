/*
// services/WatchlistService.js
import axios from 'axios';

const WatchlistService = {
    addSymbol: async (email, symbol) => {
        try {
            const response = await axios.post('http://localhost:3001/api/watchlist/add-symbol', {
                email: email,
                symbol: symbol,
            });
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
    }
};

export default WatchlistService;
*/
