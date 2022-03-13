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
    
    const posts = await Post.find()
        .sort({ createdAt: -1});
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
        const username = req.params.userId;
        const user = await User.findOne({name: username});
        const img = await user.img;
        const firstName = await user.firstName;
        const lastName = await user.lastName;
        const email = await user.email;
        console.log(username, user);
        const currentUser = await User.find(req.user);
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
            currentUser
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

// router.post("/:userId", async (req, res) => {
    
//     const following = req.user.following;
//     const newFollow = req.params.userId;
//     const currentUser = req.user.name;
    
//     console.log(following)
//     console.log(newFollow)
//     console.log(currentUser)

//     following.push(newFollow);
    
//     await req.user.save();

//     console.log(following)

//     res.redirect(`/user/${newFollow}`)
// });

// router.post("/:userId/follow-user", requireLogin, async (req,res) => {

    // check if the requested user and :user_id is same if same then 
    // console.log(req.user.id ); //622ceb8dda087c0c93cfe8a0 (Teolina)
    // console.log(req.params.userId) //Emma

    // if (req.user.id === req.params.userId) {
    //     return res.status(400).json({ alreadyfollow : "You cannot follow yourself"})
    // } 

    // User.findById(req.params.userId)
    //     .then(user => {

    //         // check if the requested user is already in follower list of other user then 

    //         if(user.followers.filter(follower => 
    //             follower.user.toString() === req.user.id ).length > 0){
    //             return res.status(400).json({ alreadyfollow : "You already followed the user"})
    //         }

    //         user.followers.unshift({user:req.user.id});
    //         user.save()
    //         User.findOne({ name: req.user.name })
    //             .then(user => {
    //                 user.following.unshift({user:req.params.userId});
    //                 user.save().then(user => res.json(user))
    //             })
    //             .catch(err => res.status(404).json({alradyfollow:"you already followed the user"}))
    //     })
    //res.redirect(`/user/${newFollow}`)
// })

router.post ("/follow /:userId", requireLogin, async (req, res) => {
    const username = req.params.userId;
    res.redirect("/user/profile");
    // try {
    //     const username = req.params.userId;

    //     // check if the ID is valid
    //     if (! ObjectID.isValid (req.params.id)) {
    //         return res.status (404).json ({error: 'Invalid id'})
    //     }

    //     // check that your ID does not match the ID of the user you want to track
    //     if (res.user._id === req.params.id) {
    //         return res.status (400).json ({error: 'You cannot monitor yourself'})
    //     }

    //     // add the user ID you want to track to the next array
    //     const query = {
    //         _id: res.user._id,
    //         next: {$not: {$elemMatch: {$eq: id}}}
    //     }

    //     const update = {
    //         $addToSet: {next: id}
    //     }

    //     const updated = await User.updateOne(request, update)

    //     // add your ID to the array of user subscribers you want to track
    //     const secondQuery = {
    //         _id,
    //         subscribers: {$not: {$elemMatch: {$eq: res.user._id}}}
    //     }

    //     const secondUpdate = {
    //         $addToSet: {followers: res.user._id}
    //     }

    //     const secondUpdated = await User.updateOne(secondQuery, secondUpdate)

    //     if (! updated ||! secondUpdated) {
    //         return res.status (404) .json ({error: 'Unable to follow this user'})
    //     }

    //     res.status (200) .json (update)
    // } catch (error) {
    //     res.status (400) .send ({error: err.message})
    // }
})

router.patch ("/unfollow /:id", requireLogin, async (req, res) => {
    try {
        const {id} = req.params

        // check if the ID is valid
        if (! ObjectID.isValid (id)) {
            return res.status(404).json ({error: 'Invalid id'})
        }

        // check that your ID does not match the ID of the user you want to unsubscribe from
        if (res.user._id === id) {
            return res.status(400).json ({error: 'You cannot unsubscribe'})
        }

        // delete the user ID you want to unsubscribe from from the following array
        const query = {
            _id: res.user._id,
            next: {$elemMatch: {$eq: id}}
        }

        const update = {
            $pull: {next: id}
        }

        const updated = await User.updateOne (request, update)

        // delete your ID from the array of subscribers of the user you want to unsubscribe from
        const secondQuery = {
            _id,
            subscribers: {$elemMatch: {$eq: res.user._id}}
        }

        const secondUpdate = {
            $pull: {followers: res.user._id}
        }

        const secondUpdated = await User.updateOne (secondQuery, secondUpdate)

        if (! updated ||! secondUpdated) {
            return res.status (404) .json ({error: 'Unable to unsubscribe from this user'})
        }

        res.status (200) .json (update)
    } catch (error) {
        res.status (400) .send ({error: err.message})
    }
});
module.exports = router;