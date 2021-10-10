const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    title: {type: String, required: true},
    image_url: {type: String},
    brands: { type : [String]}
})
 
module.exports = mongoose.model('Category', CategorySchema );

