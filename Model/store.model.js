const mongoose = require("mongoose");

const StoreSchema = mongoose.Schema({
    title: {type: String, required: true},
    user_id: {type: String},
    image_url: {type: String},
    balance: { type: Number},
    products: [{type:  mongoose.Schema.Types.ObjectId, ref: 'Product'}]
})
 
module.exports = mongoose.model('Store', StoreSchema );

