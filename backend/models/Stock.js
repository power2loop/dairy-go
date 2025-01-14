const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product_name: String,
    quantity: Number,
    rate: Number,
});

module.exports = mongoose.model('Stock', stockSchema);
