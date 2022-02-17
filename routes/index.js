const express = require("express");
const router = express.Router();

// login page
router.get("/", (req, res) => {
    res.render("welcome.ejs");
});

// register page
router.get("/register", (req, res) => {
    res.render("register.ejs");
});

module.exports = router;