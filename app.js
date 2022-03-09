const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const app = express();
const expressEjsLayout = require("express-ejs-layouts");
const flash = require("connect-flash"); // a flash message (success message)
const session = require("express-session");
const passport = require("passport"); // authentication middleware 
const bodyParser = require("body-parser");


const PORT = 3000;

// passport configuration
require("./config/passport")(passport)

//mongoose
mongoose
    .connect("mongodb://localhost/backend1",
        { useNewUrlParser: true, useUnifiedTopology : true}
    )
    .then(() => console.log("MongoDB Connection Succeeded."))
    .catch((err)=> console.log("Error in DB connection : " + err));



// Static Files
//app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use(express.static("public/images"))


// Set Templating Engine
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");
app.use(expressEjsLayout);

//BodyParser
app.use(bodyParser.urlencoded({extended : false}));

// express session
app.use(session({
    secret: "secret",
    resave: true, 
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

//Routes
app.use('/',require('./routes/login'));
app.use('/register',require('./routes/register'));
app.use('/home',require('./routes/home'));
app.use('/user',require('./routes/user'));

//app.use("/userinfo", require("./routes/profile"));

app.listen(PORT, () => {
    console.log(`Started listening on port ${PORT}`);
});