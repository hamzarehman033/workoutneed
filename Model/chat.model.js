const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    messages: { type: [
        {message: String, from: String, time: String}
    ]},
})
module.exports = mongoose.model('Chat', UserSchema );

