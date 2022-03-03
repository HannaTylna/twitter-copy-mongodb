const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

//login handle
router.get("/login",(req,res)=>{
    res.render("login");
})
router.get("/register",(req,res)=>{
    res.render("register")
    })
//Register handle
router.post("/login",(req,res,next)=>{
passport.authenticate("local",{
    successRedirect : "/userprofile",
    failureRedirect: "/users/login",
    failureFlash : true
})(req,res,next)
})
  //register post handle
router.post("/register",(req,res)=>{
const {name,email, password, password2} = req.body;
let errors = [];
console.log(" Name " + name+ " email :" + email+ " pass:" + password);
if(!name || !password || !password2) {
    errors.push({msg : "Please fill in all fields"})
}
//check if match
if(password !== password2) {
    errors.push({msg : "passwords dont match"});
}

//check if password is more than 6 characters
if(password.length < 6 ) {
    errors.push({msg : "password at least 6 characters"})
}
if(errors.length > 0 ) {
    res.render("register", {
        errors : errors,
        name : name,
        email : email,
        password : password,
        password2 : password2})
    } else {
        //validation passed
        User.findOne({name : name}).exec((err,user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: "email already registered"});
            res.render("register",{errors,name,email,password,password2})  
        } else {
        const newUser = new User({
            name : name,
            email : email,
            password : password
        });

        //hash password
        bcrypt.genSalt(10,(err,salt)=> 
        bcrypt.hash(newUser.password,salt,
            (err,hash)=> {
                if(err) throw err;
                    //save pass to hash
                    newUser.password = hash;
                //save user
                newUser.save()
                .then((value)=>{
                    console.log(value)
                    req.flash("success_msg","You have now registered!");
                    res.redirect("/users/login");
                })
                .catch(value=> console.log(value));
                    
                }));
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

//update
// router.post("/update", (req,res) => {
//     res.render("userupdate")
// });

// function updateRecord(req, res) {
//     User.findOne({_id:req.body.id},(err,doc)=>{
//      //this will give you the document what you want to update.. then 
//     doc.name = req.body.name; //so on and so forth
    
//     // then save that document
//     doc.save(callback);
    
//     });
    
// }
// router.put("/update", (req,res) => {
//     res.send("Update!");
// });


module.exports  = router;