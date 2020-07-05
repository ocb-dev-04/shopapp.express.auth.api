const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        min: 6,
    },
    product_id: {
        type: String,
        required: true,
    },
    product_name: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    price: {
        type: Number,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Cart', cartSchema);