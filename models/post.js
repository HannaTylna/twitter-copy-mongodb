const mongoose = require("mongoose");
const moment = require("moment");

const postSchema = new mongoose.Schema({
    _creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    content: { 
        type: String, 
        maxLength: 140
    },
    createdAt: {
        type: String,
        immutable: true,
        default: () => moment().format("YYYY-MM-DD, HH:mm:ss"),
    },
    // timestamps: { 
    //     createdAt: 'created_at', 
    //     updatedAt: 'updated_at' 
    // }
});

const Post = mongoose.model("Post", postSchema);
exports.Post = Post;