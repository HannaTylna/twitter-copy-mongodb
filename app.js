const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");
const flash = require("connect-flash"); // a flash message (success message)
const session = require("express-session");

//mongoose
mongoose
    .connect("mongodb://localhost/backend1",
        { useNewUrlParser: true, useUnifiedTopology : true}
    )
    .then(() => console.log("connected,,"))
    .catch((err)=> console.log(err));
//EJS
app.set("view engine","ejs");
app.use(expressEjsLayout);

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Started listening on port ${PORT}`);
});