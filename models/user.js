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
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = User;

// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const Schema = mongoose.Schema;
// const BCRYPT_SALT = 10;
// const bcryptSalt = process.env.BCRYPT_SALT;

// const userSchema = new Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         email: {
//             type: String,
//             required: false,
//         },
//         firstName: {
//             type: String,
//             required: false,
//             unique: false,
//         },
//         lastName: {
//             type: String,
//             required: false,
//             unique: false,
//         },
//         password: { 
//             type: String,
//             required: true
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
//     this.password = hash;
//     next();
// });

// module.exports = mongoose.model("user", userSchema);