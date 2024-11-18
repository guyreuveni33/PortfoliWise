const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.post('/add-symbol', watchlistController.addSymbolToWatchlist);
router.get('/symbol-suggestions/:symbol', watchlistController.getStockSuggestions);
router.get('/:email', watchlistController.getWatchlistByEmail);
router.delete('/remove-symbol', watchlistController.removeSymbolFromWatchlist);

module.exports = router;
