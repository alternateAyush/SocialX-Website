const express = require("express");
const app = express();
const port = 8000; // actual websites run on port 80
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
//
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require('./config/passport-google-oauth-strategy');
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMiddleware=require("./config/middleware");
// sass
// const sassMiddleware = require('node-sass-middleware');
// app.use(sassMiddleware({
//   src: './assets/scss',
//   dest: './assets/css',
//   debug:true,

//   outputStyle: 'expanded',
//   prefix:'/css',
// }));

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static("./assets"));
app.use("/uploads",express.static(__dirname+"/uploads"));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "socialX",
    // TODO change it in deployment
    secret: "ayush",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongoUrl: 'mongodb://127.0.0.1/socialX_development',
        autoRemove: "disabled",
      },
      function (err) {
        console.log("error40: ",err || "mongoStore setup success");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// very imp diff between app.use(passport.setAuthenticatedUser); and app.use(passport.setAuthenticatedUser());
app.use(flash());
app.use(customMiddleware.setFlash);
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`ERROR in server: ${err}`);
  } else {
    console.log(`SUCCESS Server running on port: ${port}`);
  }
});
