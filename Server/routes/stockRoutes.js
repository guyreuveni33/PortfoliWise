const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/get-stocks', stockController.getCommonStocks);

module.exports = router;
