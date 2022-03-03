const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");

// login page
router.get("/", (req, res) => {
    res.render("welcome");
});

// register page
router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/userprofile", ensureAuthenticated, (req, res) => {
    res.render("userprofile", { 
        // send the user information data to the web page
        user: req.user
    });
});

router.get("/userinfo", ensureAuthenticated, (req, res) => {
    res.render("userinfo", { 
        // send the user information data to the web page
        user: req.user
    });
})

module.exports = router;