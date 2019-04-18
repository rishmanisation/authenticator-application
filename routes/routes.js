const passport = require('passport');
require('../auth/strategies');

const requireLogin = passport.authenticate('facebook', { scope: ['email'] });
const callback = passport.authenticate('facebook', { failureRedirect: '/login' });

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
       var email = req.user.emails[0].value;
       var checkQuery = 'select count(*) as count from user_details where email_id=' + "'" + email + "'";
       db.query(checkQuery, (err, result) => {
           if(err) {
               return err;
           } 
           var isWhitelisted = (result[0].count != 0);
           if(isWhitelisted) {
               var firstName = req.user.name.givenName;
               var lastName = req.user.name.familyName;
               var updateQuery = 'update user_details set first_name=' + "'" + firstName 
               + "' , last_name='" + lastName + "' where email_id='" + email + "'";
               db.query(updateQuery, (err) => {
                   if(err) {
                       return err;
                   }
               });
           }
           res.render('profile', { user: req.user, whitelisted: isWhitelisted});
       });
    });
}