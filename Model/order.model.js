const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
    buyer_id: { type: String},
    price: { type: Number},
    color: { type: String},
    size: { type: String},
    date: { type: String},
    status: {type: String},
    payment_completed: { type: Boolean}


})
 
module.exports = mongoose.model('Order', OrderSchema );

