const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    messages: {type : String},
    time : {type: String}
})
module.exports = mongoose.model('Notification', NotificationSchema );

