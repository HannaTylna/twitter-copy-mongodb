const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");

router.get("/", async (req, res) => {

    const posts = await Post.find({})
        .sort({ createdAt: -1})
        .populate("creator")
        .exec();
    // const tags = await Post.find({})
    //     .sort({ createdAt: -1})
    //     .populate("tags")
    //     .exec();
    // const tagName = tags.forEach(tag => { tag.name, tag._id})
    const content = posts.map( post => post.content);
    const text = content.map(item => item.replace(/#[^\s#]*/g, ""));
    const tag = content.map(item => item.match(/#[^\s#]*/g));
    //console.log( content, tag, text );
    if(req.user){
        res.render("postUserPage.ejs", {posts, text,tag})
    } else{
        res.render("postPublicPage.ejs", {posts, text, tag})
    }
});


module.exports = router;