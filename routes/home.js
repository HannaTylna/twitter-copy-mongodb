const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const { Post } = require("../models/post");


router.get("/", async (req, res) => {
    try {
        //find posts 
        const posts = await Post.find({})
        .populate("_creator")
        .exec();
    
        res.render("homePage", { posts });
    } catch (err) {
        next(err);
    }
});

module.exports = router;