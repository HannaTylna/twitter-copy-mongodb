const mongoose = require("mongoose");

const UserSchema  = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        unique: true
    },
    email :{
        type: String
    },
    password :{
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    img: {
        type: String, 
        default: "img_default.png"
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
