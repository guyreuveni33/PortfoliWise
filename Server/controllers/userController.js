const userService = require('../services/userService');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        await userService.registerUser(email, password);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await userService.loginUser(email, password);
        if (token) {
            res.json({ token });
        } else {
            res.status(400).send('Invalid email or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
};

exports.dashboard = (req, res) => {
    res.send('Welcome to the Dashboard');
};