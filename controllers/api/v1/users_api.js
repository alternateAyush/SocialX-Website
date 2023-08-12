const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function (req, res) {
    try {
        let user = await User.findOne({email:req.body.email});
        if(!user || user.password!=req.body.password)
        {
            return res.json(422,{
                message:"Invalid username or password",
            });
        }
        return res.json(200,{
            message:"create-session jwt successfull",
            data:{
                token: jwt.sign(user.toJSON(),'socialX', {expiresIn: '100000'}),
            }
        })
      } catch (err) {
        console.log("Error in createSession jwt", err);
        return res.json(500,{
          message:"Internal server error",
        })
      }
};