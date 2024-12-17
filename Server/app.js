require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const passport = require('./config/passport');
const session = require('express-session');
const { runScriptForTopStocks } = require('./pythonScriptHandler'); // Import the new module

connectDB();

const app = express();
const port = process.env.PORT || 3001; // Use Railway's environment PORT

const corsOptions = {
    origin: [
        'http://localhost:3000', // Local Development
        'https://portfoli-wise.vercel.app', // Vercel Deployment
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies/auth headers
};



app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight OPTIONS
app.use(bodyParser.json());

app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api', portfolioRoutes);

// Run the script when the server starts
runScriptForTopStocks();

// Run the script every 24 hours
setInterval(runScriptForTopStocks, 24 * 60 * 60 * 1000);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});