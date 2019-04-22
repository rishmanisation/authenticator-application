const passport = require('passport');
const User = require('../models/user');
const express = require('express');
const ensureLogin = require('connect-ensure-login');
const { check } = require('express-validator/check');

require('../auth/strategies');

const requireLogin = passport.authenticate('facebook', { scope: ['email'], authType: 'reauthenticate' });
const callback = passport.authenticate('facebook', { failureRedirect: '/' });
const requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function(app) {

    // The main landing page
    app.get('/', function(req, res) {
        // Redirect user to the profile page on successful sign in
        if(req.user) {
            res.redirect('/profile');
        } else {
            res.render('home');
        }
    });

    // Login page
    app.get('/login', function(req, res){
        res.render('login');
    });

    // Social login button
    app.get('/login/facebook', requireLogin);

    // User profile page
    app.get('/profile', callback, (req, res) => {
        console.log(req.user);
        const user = req.user;
        User.isWhitelisted(user.emails[0].value, (result) => {
            // If user is not whitelisted do not proceed 
            // any further.
            if(result) { 
                res.render('notwhitelist');
            } else {
                // Generate JWT, store it in cookie and display the 
                // profile page.
                User.getPayload(user, (result) => {
                    res.cookie('jwt', result.token);
                    res.render('profile', result);
                });
            }
        });
    });

    // Page where a whitelisted user can whitelist other users. Requires valid JWT.
    app.get('/whitelist', requireJWT, (req, res) => {
        res.render('whitelist', {success: req.session.success, errors: req.session.errors});
    });

    // Form for submitting the email ID of the person to be whitelisted by the user.
    // Can currently whitelist one user at a time.
    app.post('/whitelist', [requireJWT, check('email_id').not().isEmpty().withMessage('Email id cannot be empty').isEmail().withMessage('Invalid format for email id')], (req, res) => {
        var errors = req._validationErrors;
        //console.log(errors);
        // If there are any errors with the input email id then display the errors and 
        // prompt the user to enter the input again. This uses express-validation module.
        // The following checks are implemented for email id:
        // 1. Email id cannot be empty.
        // 2. Email id has to be of the format user@website.domain.
        // 3. Email id cannot already be in the database (this is checked later on).
        if(errors && errors.length) {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/whitelist');
        } else {
            // Entered email address is syntactically correct. Proceed to add the user to the
            // database.
            var email_id = req.body.email_id;
            User.whitelistUser(email_id, (err, result) => {
                // Error here indicates that the entered email address is already present in the database.
                console.log(err);
                if(err) {
                    req.session.errors = [{msg: 'User with the provided email id is already whitelisted.'}];
                    req.session.success = false;
                    res.redirect('/whitelist');
                }
                // No errors found. Email address will be stored in the database and the user is redirected
                // to the profile page.
                if(result) {
                    req.session.success = true;
                    res.redirect('/whitelist');
                }
            });
        }
    });

    // Route to take user back to the welcome screen.
    app.get('/logout', (req, res) => {     
        req.session.destroy((err) => {
            if(err) {
                throw err;
            }
            req.logout();
            res.redirect('/');
        });
    });
}