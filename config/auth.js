module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }

        req.flash('error', 'Please login to view');
        res.redirect('/login')
    },

    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect("/blogs");
      },
}