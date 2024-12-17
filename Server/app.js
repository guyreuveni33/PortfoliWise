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
const port = process.env.PORT || 3001; // Railway uses dynamic PORT
const corsOptions = {
    origin: (origin, callback) => {
        // Allow specific origins or all for testing
        const allowedOrigins = [
            'http://localhost:3000',
            'https://portfoli-wise.vercel.app',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

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