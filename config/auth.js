module.exports = {
    ensureAuthenticated: function(req, res, next) {
        //ensure that a user has logged in 
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Please, login!");
        res.redirect("/users/login");
    }
}