const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const { Post } = require("../models/post");

const requireLogin = (req, res, next) => {  
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
};

router.get("/", async (req, res) => {

    const posts = await Post.find().sort({ date: -1});
    res.render("postPage.ejs", {
        posts,
        user: req.user,
    })
});

router.post("/", requireLogin, async (req, res, next) => {
    const user = req.user.name;
    const { content } = req.body;
    const date = new Date();
    const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const image = req.user.img;

    const newPost = new Post({ content , date, user, dateString, image})
    console.log(newPost);
    await newPost.save()
    res.redirect("/user")

});

module.exports = router;