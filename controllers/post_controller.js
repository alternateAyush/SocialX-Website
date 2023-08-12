const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const User = require('../models/user');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    req.flash("success", "New Post Published.");
    if (req.xhr) {      
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post Created!",
      });
    }
  } catch (err) {
    console.log("Error in creating post :", err);
    req.flash("error", "New Post Failed To Be Published.");
  }
  return res.redirect("back");
};

module.exports.destroy = async function (req, res) {
  // .id intead of ._id because .id changes it to string
  console.log(req.params.id);
  try {
    let post = await Post.findById(req.params.id);
    if (req.user.id == post.user) {
      console.log(post.id);
      await Like.deleteMany({likeable:post,onModel:'Post'});
      await Like.deleteMany({_id:{$in: post.comments}})
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message:"Post deleted",
        });
      }
      req.flash("success", "Post Deleted.");
    } else {
      console.log("user not matched to post");
    }
  } catch (err) {
    console.log("Error in deleting comment ", err);
    req.flash("error", "Error in deleting post.");
  }
  return res.redirect("back");

  // Post.findById(req.params.id, function (err, post) {
  //   if (err) {
  //     console.log("err in deleting user post");
  //     return res.redirect("back");
  //   }
  //   if (req.user.id == post.user) {
  //     console.log(post.id);
  //     post.remove();
  //     Comment.deleteMany({ post: req.params.id }, function (err) {
  //       if (err) {
  //         console.log("error in deleting comments of deleted post.");
  //       }
  //     });
  //     return res.redirect("back");
  //   } else {
  //     console.log("user not matched to post");
  //     return res.redirect("back");
  //   }
  // });
};

//63bad1ce0c24253e42aa48c7
