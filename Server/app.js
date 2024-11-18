// app.js

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


connectDB();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use(session({ secret: 'nivandguysecretkey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api', portfolioRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
