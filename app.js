const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");
const flash = require("connect-flash"); // a flash message (success message)
const session = require("express-session");

const PORT = 3000;

//mongoose
mongoose
    .connect("mongodb://localhost/backend1",
        { useNewUrlParser: true, useUnifiedTopology : true}
    )
    .then(() => console.log("connected,,"))
    .catch((err)=> console.log(err));

// Static Files
app.use(express.static(__dirname + "/public"));

// Set Templating Engine
app.use(expressEjsLayout);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

//BodyParser
app.use(express.urlencoded({extended : false}));

// express session
app.use(session({
    secret: "secret",
    resave: true, 
    saveUninitialized: true
}));

//use flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Started listening on port ${PORT}`);
});