const passport = require('passport');
require('../auth/strategies');

const requireLogin = passport.authenticate('facebook', { scope: ['email'] });
const callback = passport.authenticate('facebook', { failureRedirect: '/login' });

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home', { user: req.user });
    });

    app.get('/login', function(req, res){
        res.render('login');
    });

    app.get('/login/facebook', requireLogin);

    app.get('/return', callback, (req, res) => {
        res.redirect('/');
    });

    app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    res.render('profile', { user: req.user });
    });
}