const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    likes: {type: Number},
    subscribers:{type: Number},
    thumbnail_url: {type: String},
    video_url: {type: String},
    status: {type: String},
    linked_product: {type:  mongoose.Schema.Types.ObjectId, ref: 'Product'},
    isPremium: {type: Boolean},
    tags: {type: [String]},
    category: {type: String},
    channel_id: {type:  mongoose.Schema.Types.ObjectId, ref: 'Channel'}
})
 
module.exports = mongoose.model('Video', ProductSchema );

