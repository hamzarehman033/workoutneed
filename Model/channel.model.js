const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema({
    user_uid: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String},
    videos: [{type: String, unique: true}],
    subscribers: [{type: String}],
    logo: {type: String},
  
})
 
module.exports = mongoose.model('Channel', ChannelSchema );

