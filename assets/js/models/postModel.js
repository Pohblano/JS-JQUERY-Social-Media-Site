////////////////////////////////////////////////////
// POST MODEL for database
////////////////////////////////////////////////////
class Post extends Data{
  constructor(obj) {
    super();
    this.id = this.id;
    this.created = this.created;
    this.timeStamp = this.timeStamp;
    this.content = obj.text;
    this.author = user.username;
    this.author_id = user.id;
    this.comments = [];
    this.likes = [];
  }

  static save(newPost) {
    const record = userDB[user.id];
    const event = { type: 'posted' }
    const activity = new Activity({ by: user.username, by_id: user.id, ...newPost }, event);

    record.activity.unshift(activity)
    record.posts.push(newPost.id);
    userDB[record.id] = record;
    postDB[newPost.id] = newPost;
    updateSession(record);
    updateDB();
    location.reload()
  }

  static delete(postID) {
    delete postDB[postID];
    const newArr = user.posts.filter((value) => value !== postID );

    user.posts = newArr;
    userDB[user.id].posts = newArr;
    updateSession(user)
    updateDB();
  }

  static deleteNotification(noteID){
    user.notifications = user.notifications.filter(x => x.event_id !== noteID)
    userDB[user.id] = user;
    updateSession(user);
    updateDB();
  }

  static addComment(postID, newComment) {
    newComment.id = genId();
    const post = postDB[postID]
    const target = userDB[post.author_id]
    const event = {
      type: 'commented',
      target: {
        username: post.author,
        id: post.author_id
      }
    }
    const activity = new Activity({ by: user.username, by_id: user.id, post_id: newComment.id, ...newComment }, event);
    user.activity.unshift(activity)
    //append activity to target
    if(target.id !== user.id) target.notifications.unshift(activity);
   
    userDB[post.author_id] = target
    postDB[postID].comments.unshift(newComment)
    userDB[user.id] = user;
    updateSession(user)
    updateDB();
  }

  static delComment(postID, commentID) {
    const post = postDB[postID];
    const record = userDB[user.id];
    post.comments = post.comments.filter(obj => obj.id !== commentID)
    record.activity = record.activity.filter(obj => obj.post_target !== commentID)
    user.activity = record.activity; 

    updateSession(user);
    updateDB();
  }

  static like(postID) {
    const post = postDB[postID]
    let likesArr = post.likes;
    let liked = true;

    if (!likesArr.includes(user.id)) {
      likesArr.push(user.id)
      liked = false
      const target = userDB[post.author_id];
      const event = {
        type: 'liked',
        target: {
          username: post.author,
          id: post.author_id,
        }
      }
      const activity = new Activity({ by: user.username, by_id: user.id, post_id: post.id ,...post  }, event);
      //append activity to target
      if(target.id !== user.id) target.notifications.unshift(activity);
      user.activity.unshift(activity)
      userDB[post.author_id] = target
    } else if (likesArr.includes(user.id)){
      user.activity = user.activity.filter(x => x.post_target !== post.id)
      likesArr = likesArr.filter(x => x !== user.id);
    }
      
    post.likes = likesArr;
    userDB[user.id] = user;
    updateDB();
    updateSession(user);
    return {
      numLikes: likesArr.length,
      beenLiked: liked
    }
  }
}
