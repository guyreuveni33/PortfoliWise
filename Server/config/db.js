require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            `mongodb+srv://guyhaim55:${process.env.MONGO_PASSWORD}@cluster0.z8fbr.mongodb.net/PortfoliWise?retryWrites=true&w=majority`,
            {
                // Optional: recommended MongoDB connection options
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;