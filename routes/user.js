const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { User } = require("../models/user");
const { Post } = require("../models/post");
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
    const userId = req.user.following;
    const user = await User.find({_id: userId});
    // const posts = await Post.find({user: user.name})
    //     .sort({ createdAt: -1});
        console.log(userId, user)
    if (user === null) {
        res.render("user.ejs", {
            user: req.user,
        });
    } else {
        const posts = await Post.find()
            .sort({ createdAt: -1});
        res.render("userPage.ejs", {
            posts,
            user: req.user,

        });
    }
});

router.get("/profile", requireLogin, async (req, res, next) => {
    try{
        const posts = await Post.find().sort({ createdAt: -1 });
        const following = req.user.following;
        const followers = req.user.followers;
        console.log(following , followers, req.user)
        res.render("userInfo", { 
            posts: posts,
            user: req.user, // send the user information data to the web page
            image: req.user.img,
            following: req.user.following,
            followers: req.user.followers
        })
    } catch (err) {
        next(err);
    }
    
});

router.get("/:userId", async (req, res, next) => {
    try{
        const username = req.params.userId;
        const user = await User.findOne({name: username});
        const img = await user.img;
        const firstName = await user.firstName;
        const lastName = await user.lastName;
        const email = await user.email;
        console.log(username, user);
        const currentUser = await User.find(req.user);
        const currentId = await currentUser.id;
        const posts = await Post.find({user: username})
            .sort({ createdAt: -1 });
            console.log(posts, user, currentUser,img, firstName, lastName, email);
        res.render("userPosts", { 
            user,
            posts: posts,
            username,
            img,
            firstName, 
            lastName,
            email,
            currentUser, 
            currentId
        })
    } catch (err) {
        next(err);
    }
    
});



router.post("/", requireLogin, async (req, res, next) => {
    try {
        const user = req.user.name;
        const { content } = req.body;
        const image = req.user.img;
        const email = req.user.email;
        const firstName = req.user.firstName;
        const lastName = req.user.lastName;

        const post = new Post({ content , user, image, email, firstName, lastName})
        console.log(post);
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
            const posts = await Post.find().sort({ createdAt: -1 });
            res.render("userPage.ejs", {
                errors: errors,
                posts: posts,
                user: req.user,
            })
        } else {
            await post.save()
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

router.post ("/:id/follow",  async (req, res, next) => {
    try {
        const username = req.params.id;
        const user = await User.findOne({name: username}); //{Merlin}
        const id = await user.id;
        
        const currentUser = await User.findOne(req.user); //{Viktor}
        const currentId = await currentUser.id;
        console.log(user, id, currentUser, currentId);

        const posts = await Post.find({user: username})
            .sort({ createdAt: -1 });
        const img = await user.img;
        const firstName = await user.firstName;
        const lastName = await user.lastName;
        const email = await user.email;
        
        let errors = [];

        // check that your ID does not match the ID of the user you want to track
        if (currentId === id) {
            errors.push({msg : "You cannot monitor yourself"})
        }
        if (!req.user) {
            errors.push({msg : "You need to login!"})
        }

        if(errors.length > 0){
            res.render("userPosts", {
                errors: errors,
                user,
                posts: posts,
                username,
                img,
                firstName, 
                lastName,
                email,
                currentUser,
                currentId
            })
        } else {
            if (!currentUser.following.includes(id)) {
              // viktor get following
                await user.update({ $push: { followers: currentId } });
              //merlin get followers
                await currentUser.update({ $push: { following: id } });
                res.redirect(`/user/${username}`);
            } else {
                res.redirect(`/user/${username}`);
            }
        }
    } catch (error) {
        next(error)
    }
})

router.post ("/:id/unfollow", requireLogin, async (req, res, next) => {
    try {
        const username = req.params.id;
        const user = await User.findOne({name: username});
        const id = await user.id;
        
        const currentUser = await User.findOne(req.user);
        const currentId = await currentUser.id;
        console.log(user, id, currentUser, currentId);
        
        if (currentUser.following.includes(id)) {
            await user.updateOne({ $pull: { followers: currentId } });
            await currentUser.updateOne({ $pull: { following: id } });
            res.redirect(`/user/${username}`);
        } else {
            res.redirect(`/user/${username}`);
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router;