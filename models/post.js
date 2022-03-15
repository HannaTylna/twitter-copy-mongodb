const mongoose = require("mongoose");
const moment = require("moment");

const postSchema = new mongoose.Schema({

    content: { 
        type: String
    },
    createdAt: {
        type: String,
        immutable: true, //Immutable data cannot be changed once created
        default: () => moment().format("YYYY-MM-DD, HH:mm:ss"),
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // image: { 
    //     type: String 
    // },
    // email: { 
    //     type: String 
    // },
    // firstName: {
    //     type: String 
    // },
    // lastName: { 
    //     type: String 
    // }
});

const Post = mongoose.model("Post", postSchema);
exports.Post = Post;