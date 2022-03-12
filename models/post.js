const mongoose = require("mongoose");
const moment = require("moment");

const postSchema = new mongoose.Schema({

    content: { 
        type: String
    },
    createdAt: {
        type: String,
        immutable: true,
        default: () => moment().format("YYYY-MM-DD, HH:mm:ss"),
    },
    user: { 
        type: String 
    },
    image: { 
        type: String 
    },
    email: { 
        type: String 
    },
    firstName: {
        type: String 
    },
    lastName: { 
        type: String 
    }
});

const Post = mongoose.model("Post", postSchema);
exports.Post = Post;