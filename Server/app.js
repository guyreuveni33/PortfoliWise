const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Path to the new MongoDB config file

const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const alpacaRoutes = require('./routes/portfolioRoutes');

// Connect to Database
connectDB();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alpaca', alpacaRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});