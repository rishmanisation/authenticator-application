var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID: '364082814109241',
    clientSecret: '03fecc9b4a5c384f9d3bc8370ce500fc',
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