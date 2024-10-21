// services/WatchlistService.js
import axios from 'axios';

const WatchlistService = {
    addSymbol: async (email, symbol) => {
        try {
            console.log('email',email, symbol);
            // Make an HTTP POST request to add the symbol
            const response = await axios.post('http://localhost:3001/api/watchlist/add-symbol', {
                email: email,
                symbol: symbol
            });
            return response.data; // Return the updated watchlist
        } catch (error) {
            console.error('Error adding symbol to watchlist:', error);
            throw error;
        }
    },

    getWatchlist: async (email) => {
        try {
            // Make an HTTP GET request to fetch the user's watchlist
            const response = await axios.get(`http://localhost:3001/api/watchlist/${email}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            throw error;
        }
    }
};

export default WatchlistService;
