const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    count: { type: Number, required: true },
    quantity: {type: Number, required: false},
    imageUrl: {type: String, required: true},
});

module.exports = mongoose.model('Product', productSchema);