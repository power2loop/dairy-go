const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    staff_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    products: [
        {
            product_name: { type: String, required: true },
            rate: { type: Number, required: true },
            quantity: { type: Number, required: true },
            total: { type: Number, required: true }
        }
    ],
    total_amount: { type: Number, required: true }
});



module.exports = mongoose.model('Sales', salesSchema);
