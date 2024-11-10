const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// Route to add a symbol to the user's watchlist
router.post('/add-symbol', watchlistController.addSymbolToWatchlist);

// Route to search for stock suggestions
router.get('/symbol-suggestions/:symbol', watchlistController.getStockSuggestions);

// Route to fetch the user's watchlist by email
router.get('/:email', watchlistController.getWatchlistByEmail);
// Route to remove a symbol from the user's watchlist
router.delete('/remove-symbol', watchlistController.removeSymbolFromWatchlist);

module.exports = router;
