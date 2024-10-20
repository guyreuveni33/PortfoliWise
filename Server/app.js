// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes'); // Import watchlist routes

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error));

// Routes
app.use('/api/users', userRoutes);
app.use('/api', stockRoutes);
app.use('/api/watchlist', watchlistRoutes); // Use watchlist routes

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
