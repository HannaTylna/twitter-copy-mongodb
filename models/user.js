const mongoose = require("mongoose");

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
    following: [{ 
        type: Array,
        "default": []
    }]
});

const User = mongoose.model("User", userSchema);

exports.User = User;
