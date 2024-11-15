// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Path to your MongoDB config file

const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes'); // Corrected variable name
const passport = require('./config/passport');
const session = require('express-session');


// Connect to Database
connectDB();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api', portfolioRoutes); // Adjusted to match the routes

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
