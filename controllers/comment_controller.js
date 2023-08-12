const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post,
      });
      comment = await comment.populate('user','name email');
      commentsMailer.newComment(comment);
      if (comment) {
        post.comments.push(comment);
        post.save();
        req.flash('success','New Comment Added!');
      }
    }
  } catch (err) {
    req.flash('error','Error while comment creation.');
    console.log("error in comment creation ", err);
  }
  return res.redirect("/");
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    let post = await Post.findById(comment.post);
    let userId = post.user;
    if (comment.user == req.user.id || userId == req.user.id) {
      let postId = comment.post;
      await Like.deleteMany({likeable: comment._id, onModel:'Comment'})
      comment.remove();
      console.log(postId);
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      req.flash("success","Comment Deleted!");
    }
  } catch (err) {
    req.flash("success","Error while deleting comment.");
    console.log("error in deleting comments ", err);
  }
  return res.redirect("back");
};
