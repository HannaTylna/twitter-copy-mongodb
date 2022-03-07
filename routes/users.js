const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

//login handle
router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/register",(req,res)=>{
    res.render("register")
});

//Register handle
router.post("/login",
    passport.authenticate("local",{
        successRedirect : "/home",
        failureRedirect: "/users/login",
        failureFlash : true
    })
);

  //register post handle
router.post("/register",(req,res)=>{
    const {name, email, password, firstName, lastName} = req.body;
    let errors = [];
    console.log(" Name " + name + " pass:" + password);
    if(!name || !password) {
        errors.push({msg : "Please fill in all fields"})
    }

    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : "Password at least 6 characters"})
    }
    if(errors.length > 0 ) {
        res.render("register", {
            errors : errors,
            name : name,
            password : password,
            email : email,
            firstName : firstName,
            lastName : lastName
        })
    } else {
        //validation passed
        User.findOne({name : name}).exec((err,user) => {
            console.log(user);   
            if(user) {
                errors.push({msg: "User already registered"});
                res.render("register", {errors, name, email, password, firstName, lastName})  
            } else {
            const newUser = new User({
                name : name,
                email : email,
                password : password,
                firstName: firstName,
                lastName: lastName
            });

            //hash password
            bcrypt.genSalt(10,(err,salt) => 
                bcrypt.hash(newUser.password, salt,
                    (err,hash)=> {
                        if(err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                        //save user
                        newUser.save()
                        .then((value)=>{
                            console.log(value)
                            req.flash("success_msg", "You have now registered!");
                            res.redirect("/users/login");
                        })
                        .catch(value => console.log(value))
                    }
                ));
            }
        })
    }
});

//logout
router.get("/logout", (req, res)  =>  {
    req.logout();
    req.flash("success_msg", "Now logged out");
    res.redirect("/users/login"); 
});


module.exports  = router;