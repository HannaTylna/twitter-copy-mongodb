const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { User } = require("../models/user");
const { Post } = require("../models/post");


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
    
    const posts = await Post.find().sort({ date: -1});
    if(req.user){
        res.render("userPage.ejs", {
            posts,
            user: req.user,

        });
    } else{
        res.redirect("/login");
    }
});

router.get("/profile", requireLogin, async (req, res, next) => {
    try{
        const posts = await Post.find().sort({ date: -1});
        res.render("userInfo", { 
            posts: posts,
            user: req.user // send the user information data to the web page
        })
    } catch (err) {
        next(err);
    }
    
});

router.get("/:userId", async (req, res, next) => {
    try{
        const userId = req.params.userId;
        const user = await User.findOne({ user: userId });
        const img = await user.img;
        const currentUser = await User.findById(req.user._id);
        const userPosts = await Post.find({ user: userId}).sort({ date: -1});
        console.log(userId, user, currentUser);// Emma, {Emma}, {Tommy}
        res.render("userPosts.ejs", { 
            userPosts: userPosts,
            img: img,
            user: user,
            currentUser: currentUser,
            name: req.user.name,
            userId: userId
        });

    } catch (err) {
        next(err);
    }
    
});

router.post("/:userId/follow", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = req.user._id;
        const currentUserId = req.user.name;
        console.log(userId, user, currentUserId);
        // if (userId !== currentUserId) {
        //     const user = await User.findById( userId );
        //     const currentUser = await User.findById(currentUserId);
        //     console.log(user, currentUser);
        //     if (!currentUser.following.includes(userId)) {
        //         await user.updateOne({ $push: { followers: currentUserId } });
        //         await currentUser.updateOne({ $push: { following: userId } });
        //         res.redirect(`/user/${userId}`);
        //     } else {
        //         res.redirect(`/user/${userId}`);
        //     }
        // } else {
        //     res.status(400).send("You can not follow yourself");
        // }
    } catch (err) {
        res.sendStatus(500);
        next(err);
    }
});

router.post("/:userId/unfollow", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;
        const user = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);
        if (currentUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: currentUserId } });
            await currentUser.updateOne({ $pull: { following: userId } });
            res.redirect(`/user/${userId}`);
        } else {
            res.redirect(`/user/${userId}`);
        }
    } catch (err) {
        res.sendStatus(500);
        next(err);
    }
});

router.post("/", requireLogin, async (req, res, next) => {
    try {
        const user = req.user.name;
        const { content } = req.body;
        const date = new Date();
        const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const image = req.user.img;
        const email = req.user.email;
        const firstName = req.user.firstName;
        const lastName = req.user.lastName;

        const newPost = new Post({ content , date, user, dateString, image, email, firstName, lastName})
        console.log(newPost);
        let errors = [];
        if(!content){
            errors.push({msg: "* You need to write something"});
            console.log(errors);
        }
        if (content.length > 140){
            errors.push({msg: "* You can write max 140 letters"});
            console.log(errors)
        }
        if (errors.length > 0){
            const posts = await Post.find().sort({ date: -1});
            res.render("userPage.ejs", {
                errors: errors,
                posts: posts,
                user: req.user,
            })
        } else {
            await newPost.save()
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

module.exports = router;