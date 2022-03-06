const mongoose = require("mongoose");

const UserSchema  = new mongoose.Schema({
    name :{
        type  : String,
        required : true,
        unique : true
    },
    email :{
        type  : String
    },
    password :{
        type  : String,
        required : true
    },
    img: {
        type: String,
    },
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
