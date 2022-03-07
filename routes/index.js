const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const multer = require("multer");
const path = require("path");


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

//router.use(upload.single("file"));

// login page
router.get("/", (req, res) => {
    res.render("welcome");
});

// register page
router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/home", ensureAuthenticated, (req, res) => {
    res.render("userprofile", { 
        // send the user information data to the web page
        user: req.user
    });
});

router.get("/userinfo", ensureAuthenticated, (req, res) => {
    //res.send("HEJ!")
    res.render("userinfo", { 
        // send the user information data to the web page
        user: req.user
    })
});

router.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.file);
    
    const user = req.user
    user.img = req.file.filename
    user.save()

    res.redirect("/userinfo");
});

module.exports = router;