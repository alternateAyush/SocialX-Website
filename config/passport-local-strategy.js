const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("error in finding user --> Password.js");
          req.flash("error", "User Not Found!");
          return done(err);
        }
        if (!user || user.password != password) {
          req.flash("error", "Invalid Email/Password!");
          console.log(
            "user not found! || password not matched --> Password.js"
          );
          return done(null, false); // null = no error
        }
        return done(null, user);
      });
    }
  )
);

// user info to store as cookie
passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user._id); // it will also encrypt it
});

// which info to get to know user from cookie
passport.deserializeUser(function (id, done) {
  User.findOne({ _id: id }, function (err, user) {
    if (err) {
      console.log("error while deserializeUser --> Passport.js");
      return done(err);
    }
    return done(null, user);
  });
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("------------------");
    // console.log("1", req.user);
    // console.log("2", res.locals.user);
    res.locals.user = req.user;
    // console.log("3", res.locals.user);
  }
  return next();
};

module.exports = passport;


