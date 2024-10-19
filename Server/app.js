const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password comparison
const jwt = require('jsonwebtoken'); // For generating token
const User = require('./models/User'); // Assuming you have a User model
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3001;
const secretKey = 'yourSecretKey'; // Use a more secure key in production

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        return res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});

// Server listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
