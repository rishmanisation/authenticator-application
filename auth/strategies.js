const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
//const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

var cookieExtractor = function(req) {
  var token = null;
  if(req && req.cookies) {
      token = req.cookies['jwt'];
  }
  return token;
}

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/profile',
    profileFields: ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new JWTStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: 'secret'
}, function(payload, done){
  /*
  User.getUserByEmail(payload.sub, (err, user) => {
    if(err) {
      return done(err, false);
    }

    if(user) {
      return done(null, user);
    }

    return done(null, false);
  });
  */
 return done(null, payload.sub);
}));