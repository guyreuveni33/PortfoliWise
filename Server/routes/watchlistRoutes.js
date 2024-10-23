// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController'); // Import the controller

// Route to add a symbol to the user's watchlist
router.post('/add-symbol', watchlistController.addSymbolToWatchlist);

// Route to fetch the user's watchlist by email
router.get('/:email', watchlistController.getWatchlistByEmail);

module.exports = router;
