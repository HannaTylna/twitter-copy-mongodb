const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const multer = require("multer");

const { User } = require("../models/user");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //name of file on the uploaders computer
    },
});
const upload = multer({
    storage: storage,
    // limits: {
    //     fieldSize: 1024 * 1024 * 3, //1mb
    // },
});

router.get("/userinfo", (req, res, next) => {
    try {
        const username = req.name;
        const user = User.findOne({ username: username });
        const countFollowing = User.aggregate([
            { $match: { username: username } },
            { $project: { result: { $size: ["$following"] } } },
        ]);
        const countFollowers = User.aggregate([
            { $match: { username: username } },
            { $project: { result: { $size: ["$followers"] } } },
        ]);
        console.log(countFollowers[0].result, countFollowing[0].result);
  
        res.render("userinfo.ejs", {
            email: user.email,
            img: user.img,
            name: user.name,
            followers: countFollowers[0].result,
            following: countFollowing[0].result,
        }); //{ username: req.user.username })
    } catch (err) {
        next(err);
    }
});

  //modify the profile //if email name or img is empty, they updates empty.
router.post("/userinfo", upload.single("image"), (req, res, next) => {
    console.log(req.file);
    console.log(req.user.name);
    try {
        const username = req.user.name;
        console.log("USERNAME", username);
        await User.updateOne( { username: username },
            {
                $set: {
                    email: req.body.email,
                    name: req.body.name,
                    img: req.file.filename,
                },
            }
        );
        res.redirect("/userinfo");
    } catch (err) {
        next(err);
    }
});

module.exports = router;