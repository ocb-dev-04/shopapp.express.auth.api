const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        min: 6,
    },
    image_url: {
        type: String,
        required: false,
        default: 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg'
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    description: {
        type: String,
        required: true,
        max: 1024,
        min: 10
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: false,
        default: 1
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Products', productsSchema);
