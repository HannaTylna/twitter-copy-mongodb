const mongoose = require("mongoose");
const moment = require("moment");

const postSchema = new mongoose.Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        maxLength: 140,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    // timestamps: { 
    //     createdAt: 'created_at', 
    //     updatedAt: 'updated_at' 
    // }
});

const Post = mongoose.model("Post", postSchema);
exports.Post = Post;