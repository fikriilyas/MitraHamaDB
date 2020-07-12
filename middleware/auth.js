module.exports = {
    ensureAuth: function(req, res, next){
        if (req.isAuthenticated() && (req.user.status === 'accepted' || req.user.status === 'admin')){
            return next()
        } else {
            res.render('error/new')
        }
    },
    ensureGuest: function(req,res, next){
        if (req.isAuthenticated()){
            res.redirect('/dashboard')
        } else {
            return next()
        }
    },
    ensureAdmin: function(req, res, next){
        if (req.isAuthenticated() && req.user.status === 'admin'){
            return next()
        } else {
            res.render('error/401')
        }
    }
}