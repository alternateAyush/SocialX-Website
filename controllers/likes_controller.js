const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.toggleLike = async function(req,res){
    try{
        // like/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted=false;
        if(req.query.type=='Post')
        {
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }
        // check if like exists
        let existingLike=await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })
        // if like exist delete it else add it
        if(existingLike)
        {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted=true;
        }
        else
        {
            let newLike=await Like.create({
                user: req.user._id,
                likeable: req.query._id,
                onModel: req.query.type
            })
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.json(200,{
            message:"Request Successfull",
            data:{
                deleted: deleted
            }
        })
    }
    catch(err)
    {
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        })
    }
}