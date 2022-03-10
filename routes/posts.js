const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");

router.get("/", async (req, res) => {

    const posts = await Post.find().sort({ date: -1});
    res.render("postPage.ejs", {
        posts,
        user: req.user,
    })
});


module.exports = router;