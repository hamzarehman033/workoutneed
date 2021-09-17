const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    uid: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    profile_image: {type: String},
    dob: {type: String},
    phone: {type: String},
    notes: [
        {
            title: {type: String},
            text:{type:String}
        }
    ]
})
 
module.exports = mongoose.model('User', UserSchema );

