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
})

const upload = multer({ storage: storage });

// function to check if user is already logged in 
const requireLogin = (req, res, next) => {  
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
};


router.post("/", requireLogin, async (req, res, next) => {
    const postUser = req.user.name;
    const { post } = req.body;
    const postDate = new Date();
    const postDateString = `${postDate.toLocaleDateString()} at ${postDate.toLocaleTimeString()}`;
    const postImage = req.user.img;

    const newEntry = new Post({ post, postDate, postUser, postDateString, postImage})
    await newEntry.save()
    res.redirect("/user")

});


router.get("/", requireLogin, async (req, res) => {
    
    const posts = await Post.find().sort({ createdAt: -1});
    if(req.user){
        res.render("userPage.ejs", {
            posts,
            user: req.user,

        })
    } else{
        res.redirect("/login")
    }
});


router.get("/userInfo", requireLogin, async (req, res) => {
    //res.send("HEJ!")
    res.render("userInfo", { 
        user: req.user // send the user information data to the web page
    })
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
        res.redirect("/user");
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
        res.redirect("/user");
    } catch (err) {
        next(err);
    }
});

module.exports = router;