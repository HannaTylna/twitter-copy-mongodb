const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/",(req,res)=>{
    res.render("register")
});

  //register post handle
router.post("/", async (req, res) => {
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

    const userExist = await User.findOne({name});
    if(userExist){
        errors.push({msg : "User already registered"})
    }

    if(errors.length > 0 ) {
        res.render("register", {
            errors : errors,
        })
    } else {
        //validation passed
        User.findOne({name: name}).exec((err,user) => {
            console.log(user);   
            if(user) {
                errors.push({msg: "User already registered"});
                res.render("register", {errors})  
            } else {
            const user = new User({ name, password: password, email, firstName, lastName});
            //hash password
            bcrypt.genSalt(10,(err,salt) => 
                bcrypt.hash(user.password, salt,
                    (err,hash) => {
                        if(err) throw err;
                            //save pass to hash
                            user.password = hash;
                        //save user
                        user.save()
                        .then((value)=>{
                            console.log(value)
                            req.flash("success_msg", "You have now registered!");
                            res.redirect("/login");
                        })
                        .catch(value => console.log(value))
                    }
                ));
            }
        })
    }
});

module.exports  = router;