const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    channel_id: {type: String},
    audience: {type: String},
    isPremium: { type: Boolean}

})
 
module.exports = mongoose.model('Playlist', UserSchema );

