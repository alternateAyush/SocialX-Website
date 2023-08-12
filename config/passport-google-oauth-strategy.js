const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('node:crypto');
const user = require('../models/user');
const User = require('../models/user');

// google
// 342696128675-2uo1957osdk2p96tpghl2h7ou3pial73.apps.googleusercontent.com
// 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

passport.use(new googleStrategy(
    {
        clientID: '342696128675-2uo1957osdk2p96tpghl2h7ou3pial73.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8000/users/auth/google/callback',
    },
    async function(accessToken,refreshToken,profile,done)
    {
        try{
            let user = await User.findOne({email:profile.emails[0].value});
            if(user)
            {
                return done(null,user);
            }
            else
            {
                try{
                    let newUser = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex'),
                    });
                    if(newUser)
                    {
                        return done(null,newUser);
                    }
                    else
                    {
                        return;
                    }
                }
                catch(err)
                {
                    console.log("err in creating new user google auth",err);
                    return;
                }
            }
        }
        catch(err)
        {
            console.log("error in finding user google-auth",err);
            return;
        }
    }
));

module.exports=passport;