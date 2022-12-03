const User = require('../models/user');

module.exports.profile = function(req,res){
    if(!req.cookies.user_id)
    {
        console.log("Not signed-in")
        return res.redirect('/users/sign-in');
    }
    User.findOne({id:req.cookies.user_id},function(err,user){
        if(err)
        {
            console.log("err in finding user while going to profile");
        }
        if(user)
        {
            console.log("user profile found");
            return res.render('users_profile',{
                title: "SocialX | Profile",
                user:user,
            });
        }
        else{
            console.log("User profile not found");
            return res.redirect("/users/sign-up");
        }
    });
}
module.exports.post = function(req,res){
    return res.end("<h1>User Post</h1>")
}
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title: 'SocialX | SignUp'
    })
}
module.exports.signIn = function(req,res){
    if(req.cookies.user_id)
    {
        console.log("already signed in");
        return res.redirect("/users/profile");
    }
    return res.render('user_sign_in',{
        title: 'SocialX | SignIn'
    })
}
// sign-up input create user
module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password)
    {
        console.log("Password is not equal to Confirm Password.");
        return res.redirect("back");
    }   
    User.findOne({email: req.body.email},function(err,user){
        if(err)
        {
            console.log("Error in finding user signUp.");
            return res.redirect('back');
        }
        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err)
                {
                    console.log("Error in creating User signUp.");
                    return res.redirect('back');
                }
                console.log(user);
                res.redirect('/users/sign-in');
            });
        }
        else{
            console.log("user already exits");
            return res.redirect("back");
        }

    });
}
// sign-in input log in user
module.exports.createSession = function(req,res){    
    User.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            console.log("error in create-session");
            return res.redirect('back');
        }
        if(user)
        {
            if(user.password != req.body.password)
            {
                console.log("incorrect password");
                return res.redirect("back");
            }
            console.log("Session Created")
            res.cookie('user_id',user.id);
            return res.redirect("/users/profile");
        }
        console.log("User not found.");
        return res.redirect("back");
    })    
}

module.exports.signOut = function(req,res)
{
    res.clearCookie('user_id');
    return res.redirect("/users/sign-in");
}