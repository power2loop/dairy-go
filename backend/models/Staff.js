const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    staff_id: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }, // Add password field
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
});

module.exports = mongoose.model('Staff', StaffSchema);
