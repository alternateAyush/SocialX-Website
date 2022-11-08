module.exports.profile = function(req,res){
    return res.render('users_profile',{
        title:'Profile',
    })
}
module.exports.post = function(req,res){
    return res.end("<h1>User Post</h1>")
}