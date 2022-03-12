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
    
    const posts = await Post.find().sort({ createdAt: -1});
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
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render("userInfo", { 
            posts: posts,
            user: req.user, // send the user information data to the web page
            image: req.user.img,
            following: req.user.following
        })
    } catch (err) {
        next(err);
    }
    
});

router.get("/:userId", async (req, res, next) => {
    try{
        
        const userPosts = await Post.find({ user: req.params.userId})
            .sort({ createdAt: -1 });
            
        res.render("userPosts.ejs", { 
            userPosts: userPosts,
        });

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

router.post("/:userId", async (req, res) => {
    
    const following = req.user.following;
    const newFollow = req.params.userId;
    const currentUser = req.user.name;
    
    console.log(following)
    console.log(newFollow)
    console.log(currentUser)

    following.push(newFollow);
    
    await req.user.save();

    console.log(following)

    res.redirect(`/user/${newFollow}`)
})

module.exports = router;