const express = require("express");
const router = express.Router();

const { User } = require("../models/user");

// const requireLogin = (req, res, next) => {
//     if (req.user) {
//         next()
//     } else {
//         res.sendStatus(401)
//     }
// };

router.get("/", async (req, res) => {
    if(!req.user){
        res.send("HOME!")
    } else {
        res.render("userPage", { 
        // send the user information data to the web page
            user: req.user
        });
    }
    
    //res.render("homePage");
});

// router.get("/:userId", requireLogin, async (req, res) => {
//     const userId = req.params.userId;
//     console.log(req.params);
//     const user = await User.findOne({ _id: userId });
//     res.render("userPage", { 
//         // send the user information data to the web page
//         user: req.user
//     });
// });

module.exports = router;