const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");

router.get("/", async (req, res) => {

    const posts = await Post.find({})
        .sort({ createdAt: -1})
        .populate("creator")
        .exec();
    if(req.user){
        res.render("postUserPage.ejs", {posts})
    } else{
        res.render("postPublicPage.ejs", {posts})
    }
});


module.exports = router;