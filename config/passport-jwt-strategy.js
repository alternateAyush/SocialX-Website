const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtarctJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtarctJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "socialX",    
}

passport.use(new JWTStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload._id, function(err, user) {
        if (err) {
            console.log("passport-jwt-startegy ERROR",err);
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports = passport;
