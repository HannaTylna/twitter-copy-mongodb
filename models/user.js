const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const userSchema  = new mongoose.Schema({
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
    },
    following: [
        {
            user:{ 
                type: mongoose.Schema.ObjectId, 
                ref: 'User' 
            },
        }
    ],
    followers: [
        {
            user:{ 
                type: mongoose.Schema.ObjectId, 
                ref: 'User' 
            },
        }
    ],
});

const User = mongoose.model("User", userSchema);

exports.User = User;
