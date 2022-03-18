const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Tag } = require("../models/tag");
const console = require("console");


// upload photo

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// function to check if user is already logged in 
const requireLogin = (req, res, next) => {  
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

router.get("/", requireLogin, async (req, res) => {
    const currentUser = req.user._id;
    const followings = req.user.following; 
    const followingIds = followings.map((f) => f.toString());
    const posts = await Post.find({ creator: followingIds})
        .sort({ createdAt: -1})
        .populate("creator")
        .exec();
    console.log(currentUser, followings, followingIds, posts);
    res.render("userPage.ejs", {
        posts,
        name: req.user.name,
        image: req.user.img
    });
});

router.get("/profile", requireLogin, async (req, res, next) => {
    try{
        const user = await User.findOne({name: req.user.name});
        const posts = await Post.find({creator: user._id})
            .sort({ createdAt: -1 })
            .populate("creator")
            .exec();
            
        const following = req.user.following;
        const followers = req.user.followers;
        console.log(following , followers, posts, user)
        res.render("userInfo", { 
            posts,
            user, // send the user information data to the web page
        })
    } catch (err) {
        next(err);
    }
    
});

router.get("/:userId", async (req, res, next) => {
    try{
        const postUser = req.params.userId;
        const user = await User.findOne({_id: postUser});
        const currentUser = await User.findOne(req.user);
        const posts = await Post.find({creator: postUser})
            .sort({ createdAt: -1 })
            .populate("creator")
            .exec();
        //console.log(postUser, user, currentUser, posts);
        res.render("userPosts", { 
            user, currentUser, posts
        })
    } catch (err) {
        next(err);
    }
});



router.post("/", requireLogin, async (req, res, next) => {
    try {
        const username = req.user.name;
        const user = await User.findOne({name: username});
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        const tags = await Tag.find({});
        const hashtagText = hashtags.map(tag => tag.slice(1).toLowerCase());
        const tag = await new Tag({name: hashtagText});
        tags.push({_id: tag.id});
        //console.log( hashtags, hashtagText, tags, tag );
        
        const post = new Post({ 
            content: req.body.content , 
            creator: user._id,
            tags
        })
        //console.log(post);
        let errors = [];
        if(!post.content){
            errors.push({msg: "* You need to write something"});
            console.log(errors);
        }
        if (post.content.length > 140){
            errors.push({msg: "* You can write max 140 letters"});
            console.log(errors)
        }
        if (errors.length > 0){
            const posts = await Post.find({creator: user._id })
                .sort({ createdAt: -1 })
                .populate("creator")
                .exec();
            res.render("userPage.ejs", {
                errors: errors,
                posts: posts,
                name: req.user.name,
                image: req.user.img,
            })
        } else {
            await post.save()
            await tag.save()
            res.redirect("/user")
        } 
    } catch (err) {
        next(err);
    }
});

router.post("/update", requireLogin,  async (req, res, next) => {
    try {
        var user = {"name": req.user.name};
        const {firstName, lastName, email} = req.body;
        console.log(firstName, lastName, email);
        await User.updateOne( user , 
            {
                $set: {
                    firstName: firstName, 
                    lastName: lastName, 
                    email: email
                }
            }
        );
        res.redirect("/user/profile");
    } catch (err) {
        next(err);
    }
});

router.post("/upload", requireLogin,  upload.single("file"), (req, res, next) => {
    console.log(req.file);
    try{
        const user = req.user
        user.img = req.file.filename
        user.save()
        res.redirect("/user/profile");
    } catch (err) {
        next(err);
    }
});

router.post ("/:userId/follow",  async (req, res, next) => {
    try {
        const id = req.params.userId;
        const user = await User.findOne({_id: id}); 
        
        const currentUser = await User.findOne(req.user); 
        //console.log(user, id, currentUser);

        const posts = await Post.find({creator: id})
            .sort({ createdAt: -1 });
        
        let errors = [];

        // check that your ID does not match the ID of the user you want to track
        if (currentUser._id == id) {
            errors.push({msg : "You cannot monitor yourself"})
        }
        if (!req.user) {
            errors.push({msg : "You need to login!"})
        }

        if(errors.length > 0){
            res.render("userPosts", { errors, user, posts, currentUser, posts })
        } else {
            if (!currentUser.following.includes(id)) {
              // viktor get following
                await user.updateOne({ $push: { followers: currentUser._id } });
              //merlin get followers
                await currentUser.updateOne({ $push: { following: id } });
                req.flash("success_msg", `Now you follow ${user.name}`);
                res.redirect(`/user/${id}`);
            } else {
                req.flash("success_msg", `You have already follow ${user.name}`);
                res.redirect(`/user/${id}`);
            }
        }
    } catch (error) {
        next(error)
    }
})

router.post ("/:userId/unfollow", requireLogin, async (req, res, next) => {
    try {
        const id = req.params.userId;
        const user = await User.findOne({_id: id});
        const currentUser = await User.findOne(req.user);
        let errors = [];

        const posts = await Post.find({creator: id})
            .sort({ createdAt: -1 });

        if (currentUser._id == id) {
            errors.push({msg : "You can't unfollow yourself"})
        }
        if(errors.length > 0){
            res.render("userPosts", { errors, user, posts, currentUser })
        } else {
            if (currentUser.following.includes(id)) {
                await user.updateOne({ $pull: { followers: currentUser._id } });
                await currentUser.updateOne({ $pull: { following: id } });
                req.flash("success_msg", `Now you unfollow ${user.name}`);
                res.redirect(`/user/${id}`);
            } else {
                req.flash("success_msg", `You have already unfollow ${user.name}`);
                res.redirect(`/user/${id}`);
            }
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router;