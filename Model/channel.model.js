const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema({
    user_uid: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String},
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
    subscribers: [{type: String}],
    logo: {type: String},
  
})
 
module.exports = mongoose.model('Channel', ChannelSchema );

