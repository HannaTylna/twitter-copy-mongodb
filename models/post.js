const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: { type: String, maxLength: 140 },
    date: { type: Date},
    user: { type: String },
    dateString: { type: String },
    image: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    
    // timestamps: { 
    //     createdAt: 'created_at', 
    //     updatedAt: 'updated_at' 
    // }
});

const Post = mongoose.model("Post", postSchema);
exports.Post = Post;