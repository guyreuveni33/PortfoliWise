const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    apiKey: { type: String, required: true },
    secretKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
