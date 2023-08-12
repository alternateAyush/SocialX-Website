const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  // Posts.find({})
  //   .populate("user")
  //   .populate({
  //     path: 'comments',
  //     populate:{
  //       path:'user',
  //     }
  //   })
  //   .exec(function (err, posts) {
  //     Users.find({},function(err,users){
  //       if (err) {
  //         console.log("error in fetching post in home");
  //       }
  //       return res.render("home", {
  //         title: "Home",
  //         posts: posts,
  //         all_users:users,
  //       });
  //     });

  //   });
  // using async await
  try {
    let posts = await Post.find({})
    .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
      }).populate('likes');

    let users = await User.find({});
    return res.render("home", {
      title: "Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("error homepage: ", err);
    return res.redirect("back");
  }
};
