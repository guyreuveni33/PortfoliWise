// models/User.js

const mongoose = require('mongoose');
const bcrypt = require("bcrypt"); // Correctly import bcrypt

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    nickname: { type: String, required: true },
    watchlist: [{
        symbol: { type: String, required: true },
    }]
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
