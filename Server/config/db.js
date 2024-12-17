require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the environment variable for the MongoDB connection string
        const conn = await mongoose.connect(
            `mongodb+srv://guyhaim55:${process.env.MONGO_PASSWORD}@cluster0.z8fbr.mongodb.net/PortfoliWise?retryWrites=true&w=majority`
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
