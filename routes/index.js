const express = require("express");
const router = express.Router();

// login page
router.get("/", (req, res) => {
    res.send("Welcome!");
});

// register page
router.get("/register", (req, res) => {
    res.render("Register");
});

module.exports = router;