const User = require("../models/user");
const MongoStore = require("connect-mongo");
const fs=require('fs');
const path=require('path');

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("users_profile", {
      title: "Profile",
      profile_user: user,
    });
  });
};
module.exports.post = function (req, res) {
  return res.end("<h1>User Post</h1>");
};
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "SocialX | SignUp",
  });
};
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "SocialX | SignIn",
  });
};
// sign-up input create user
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    console.log("Password is not equal to Confirm Password.");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user signUp.");
      return res.redirect("back");
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creating User signUp.");
          return res.redirect("back");
        }
        console.log(user);
        res.redirect("/users/sign-in");
      });
    } else {
      console.log("user already exits");
      return res.redirect("back");
    }
  });
};
// sign-in input log in user
module.exports.createSession = function (req, res) {
  console.log("success - createSession");
  req.flash("success", "You have Logged In!");
  return res.redirect("/");
};
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return res.redirect("/users/profile");
    }
    req.flash("success", "You have Logged Out!");
    return res.redirect("/users/sign-in");
  });
};

module.exports.update = async function (req, res) {
  if (req.params.id == req.user.id) {
    try{
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req,res,function(err){
        if(err)
        {
          console.log("avatar-upload-error ",err);
        }
        user.name=req.body.name;
        user.email=req.body.email;
        if(req.file)
        {
          console.log(req.file);
          if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar)))
          {
            fs.unlinkSync(path.join(__dirname,"..",user.avatar));
          }
          user.avatar = User.avatarPath+"/"+req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });
    }catch(err)
    {
      console.log("user-update-error");
      return res.redirect('back');
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
};
