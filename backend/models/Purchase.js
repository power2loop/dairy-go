const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    date: { type: String, required: true },
    seller_name: { type: String, required: true },
    product_name: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    staff_id: { type: String, required: true },
});


module.exports = mongoose.model('Purchase', purchaseSchema);
