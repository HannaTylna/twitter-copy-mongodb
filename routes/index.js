const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { User } = require("../models/user");


// UPLOAD PHOTO FUNCTION 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });


const requireLogin = (req, res, next) => {  // Vi skapar en egen middleware "requireLogin" - Om req.user = true så går man till nästa steg, annars skciakr vi fel meddelande
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
}

// login page
router.get("/", (req, res) => {
    res.render("welcome");
});

router.get("/user_info", requireLogin, async (req, res) => {
    //res.send("HEJ!")
    res.render("userInfo", { 
        // send the user information data to the web page
        user: req.user
    })
});

router.post("/update", async (req, res, next) => {
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
        res.redirect("/user_info");
    } catch (err) {
        next(err);
    }
});

router.post("/upload", upload.single("file"), (req, res, next) => {
    console.log(req.file);
    try{
        const user = req.user
        user.img = req.file.filename
        user.save()
        res.redirect("/user_info");
    } catch (err) {
        next(err);
    }
});

module.exports = router;