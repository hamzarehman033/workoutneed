const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
})
 
module.exports = mongoose.model('User', UserSchema );

