const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('users_profile',{
        title:'Profile',
    })
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
    
}