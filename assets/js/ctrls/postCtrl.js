///////////////////////////////////////////////////
// DELETE USER POST
///////////////////////////////////////////////////
$("#all-posts-container").on('click', ".delete-post", function (e) {
  e.preventDefault()
  const parent = $(this).parents()[2]
  deletePost(parent.id);
  $(parent).fadeOut()
});

// Delete post
function deletePost(id) {
  (window.confirm("Are you sure you want to delete?")) ? Post.delete(id) : null;
}

///////////////////////////////////////////////////
// CREATE USER POST
///////////////////////////////////////////////////
$('#submit-post').on('click', function (e) {
  e.preventDefault();
  let data = getFormData("post-form");
  if (Object.keys(data).length < 1) return false;
  else savePost(data);
})

// Create post to be saved
function savePost(obj) {
  const newPost = new Post(obj);
  (window.confirm("Are you sure?")) ? Post.save(newPost) : null;
}

///////////////////////////////////////////////////
// DELETE USER COMMENT
///////////////////////////////////////////////////
$("#all-posts-container").on('click', ".delete-comment", function (e) {
  const post = $(this).parents()[5];
  const comment = $(this).parents()[1];
  (delComment(post.id, comment.id)) ? $(comment).fadeOut() : null;
})

//Delete comment from post
function delComment(postID, commentID) {
  if (window.confirm("Are you sure?")) {
    Post.delComment(postID, commentID)
    return true;
  } else
    return false;
}

///////////////////////////////////////////////////
// CREATE USER COMMENT
///////////////////////////////////////////////////
$("#all-posts-container").on('keypress', ".submit-comment", function (e) {
  if (event.charCode === 13 && event.target.value)
    addComment(this, e);
})

// Create comment and add to post 
function addComment(el, event) {
  event.preventDefault();
  const _id = $(el).parents(".post-container")[0].id,
    date = moment(),
    comment = {
      author_id: user.id,
      content: el.value,
      created: {
        date: date.format("MMMM Do YYYY"),
        time: date.format("h:mm:ss a")
      }
    }
  Post.addComment(_id, comment);
  el.value = '';

  // Render comment
  const container = $(el.parentNode).children('.all-comments-container')[0]
  $(container).children('.comment-container').remove()
  handleRenderComments(container)
}

///////////////////////////////////////////////////
// LIKE HANDLER
///////////////////////////////////////////////////
$("#all-posts-container").on('click', ".like-btn", function (e) {
  if (!isLoggedIn()) return false
  handleLikes(this, e);
})

//Update post and user likes and render like btn effects
function handleLikes(el, event) {
  const likeBtn = el;
    post = $(likeBtn).parents()[2],
    postObj = Post.like(post.id);

  if (!postObj.beenLiked && isLoggedIn()) {
    likeBtn.className = `${likeBtn.className.split(' ').filter(val => val !== "unliked").join(' ')} liked`;
    likeBtn.innerText = ` ${postObj.numLikes}`;
  } else if (postObj.beenLiked && isLoggedIn()) {
    likeBtn.className = `${likeBtn.className.split(' ').filter(val => val !== "liked").join(' ')} unliked`;
    likeBtn.innerText = ` ${postObj.numLikes}`;
  }
}

///////////////////////////////////////////////////
// NOTIFICATIONS HANDLER
///////////////////////////////////////////////////
$("#all-notifications-container").on('click', ".delete-notification", function (e) {
  deleteNote(this, event)
})

// Removes notification from list
function deleteNote(el, event) {
  const parent = $(el).parents('.notification-container')
  const id = parent[0].id;
  parent.fadeOut()
  Post.deleteNotification(id);
}