const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const customerSchema = new Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    birthDate: {type: String, required: true},
    phoneNo: {type: String, required: true, minLength: 10},
    address: {type: String, required: true},
    cart: [{ type: Object }]
});

customerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Customer', customerSchema);