const mongoose = require("mongoose");

const StoreSchema = mongoose.Schema({
    title: {type: String, required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    image_url: {type: String},
    products: [{type:  mongoose.Schema.Types.ObjectId, ref: 'Product'}]
})
 
module.exports = mongoose.model('Store', StoreSchema );

