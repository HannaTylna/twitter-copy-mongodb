const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const expressEjsLayout = require("express-ejs-layouts");

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

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Started listening on port ${PORT}`);
});