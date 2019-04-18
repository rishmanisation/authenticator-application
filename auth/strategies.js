var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;

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
  console.log(user);
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeader(),
  secretOrKey: process.env.CLIENT_SECRET
}, function(payload, done){
  return done(null, payload.sub);
}));