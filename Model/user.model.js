const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    uid: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true}
})
 
module.exports = mongoose.model('User', UserSchema );