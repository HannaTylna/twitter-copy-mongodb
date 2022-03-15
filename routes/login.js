const express = require("express");
const router = express.Router();
const passport = require("passport");


// login page
router.get("/", (req, res) => {
    res.render("welcome");
});

//login handle
router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login",
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash : true
    }),
    (req, res) => {
        res.redirect("/user");
    }
);

//logout
router.get("/logout", (req, res)  =>  {
    req.logout();
    req.flash("success_msg", "Now logged out");
    res.redirect("/login"); 
});

module.exports  = router;