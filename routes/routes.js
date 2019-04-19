const passport = require('passport');
const User = require('../models/user');

require('../auth/strategies');

const requireLogin = passport.authenticate('facebook', { scope: ['email'] });
const callback = passport.authenticate('facebook', { failureRedirect: '/login' });

const requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
    app.get('/', function(req, res) {
        if(req.user) {
            res.redirect('/profile');
        } else {
            res.render('home');
        }
    });

    app.get('/login', function(req, res){
        res.render('login');
    });

    app.get('/login/facebook', requireLogin);

    app.get('/profile', callback, (req, res) => {
        const user = req.user;
        var isWhitelist = User.isWhitelisted(user);
        if(!isWhitelist) { 
            res.render('notwhitelist');
        } else {
            const payload = User.getPayload(user);
            res.cookie('jwt', payload.token);
            res.render('profile', payload); 
        }
    });

    app.get('/whitelist', requireJWT, (req, res) => {
        res.render('whitelist')
    });

    app.post('/whitelist', requireJWT, (req, res) => {
        console.log(req.body);
        var result = User.whitelistUser(req.body.email_id, (err) => {
            console.log("Inside");
            if(err) {
                throw err;
            }
            return result;
        })
        if(result) {
            res.redirect('/profile');
        }
    });
}