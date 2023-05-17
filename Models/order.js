const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const orderSchema = new Schema({
    custId: {type: String, required: true},
    name: {type: String, required: true},
    email: { type: String, required: true },
    phoneNo: {type: String, required: true, minLength: 10},
    address: {type: String, required: true},
    orderedProduct: [{ type: Object }],
    date: {type: String, required: false},
    total: { type: Number, required: true}
});

// orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);