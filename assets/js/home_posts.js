{
  // send req to create new post in db
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (event) {
      event.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (response) {
          let newPost = newPostDom(response.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button",newPost));
          console.log(newPost);
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };
  // add new post in frontend
  let newPostDom = function (post) {
    return $(`
        <li id="post-${post._id}">
        <p>
          <span><a class="delete-post-button" href="/posts/destroy/${post._id}"> x </a></span>
            <span>${post.user}</span>  
            <br>
            <span>${post.content}</span>   
            <br>
            <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
              0 Likes
            </a>
          
        </small>                     
        </p>
        <div class="post-comments">      
            <form action="/comments/create"  class="post-comments-form" method="post">
              <div class="form-floating">
                <input
                type="text"
                name="content"
                id="new-comment-content"
                class="form-control"
                placeholder="Type here..."
              ></input>
              <label for="new-comment-content">Comment</label>
              </div>          
              <input
                type="hidden"
                name="post"
                value="${post._id}"
              ></input>
              <input type="submit" value="Add Comment" class="btn btn-primary"/>
            </form> 
        </div>
        <div class="comment-list-container">
          <ul type="none" class="comment-list" id="comment-list-${post._id}">
        </ul>
        </div>
        <hr>
      </li>
    `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (response) {
          $(`#post-${response.data.post_id}`).remove();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  };

  createPost();
}
