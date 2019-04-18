var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var config = require('../config');

passport.use(new Strategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: '/profile',
    profileFields: ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  console.log(user);
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});