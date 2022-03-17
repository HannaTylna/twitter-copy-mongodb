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
    creator: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
});

const Post = mongoose.model("Post", postSchema);
exports.Post = Post;