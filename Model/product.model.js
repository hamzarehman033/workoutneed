const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    price: {type: Number},
    service_charges:{type: Number},
    image_url: {type: String},
    status: {type: String},
    category_id: {type: String},
    store_id: {type:  mongoose.Schema.Types.ObjectId, ref: 'Store'}
})
 
module.exports = mongoose.model('Product', ProductSchema );

