////////////////////////////////////////////////////
// USER MODEL for database
////////////////////////////////////////////////////
class User extends Data{
  constructor(obj) {
    super();
    this.id = this.id;
    this.created = this.created;
    this.timeStamp = this.timeStamp;
    this.name = obj.name;
    this.username = obj.username;
    this.password = obj.password;
    this.avatar = this.genRandomAvi();
    this.posts = [];
    this.followers = [];
    this.following = [];
    this.activity = [];
    this.notifications = [];
    this.conversations = [];

  }
  genRandomAvi(){
    const rand = Math.floor(Math.random() * 9);
      return `./assets/images/avis/anon-${rand}.jpg`;
  }
  static validPassword({ password }) {
    if (password.length >= 8) {
      const exp1 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
      if (password.match(exp1)) {
        displayError("! PASSWORD must contain Upper, lower case, number and at least a special character !");
        return false;
      } else return true;
    } else {
      displayError("! PASSWORD must at least 8 characters !");
      return false;
    }
  }
  static validUsername({ username }) {
    for (let [id, user] of Object.entries(userDB)) {
      if (username === user.username) {
        displayError('! USERNAME unavailable !')
        return false;
      }
    }
  }
  static save(obj, event) {
    const activity = new Activity( {by: obj.username, by_id: obj.id}, event)

    obj.activity.unshift(activity);
    userDB[obj.id] = obj;
    updateSession(obj);
    updateDB();
  }
  static edit(obj){
    const record = userDB[user.id];
    const newRecord = Object.assign({}, record, obj);
    
    if(!newRecord.avatar) newRecord.avatar = record.avatar;
    updateSession(newRecord);
    return newRecord;
  }
  static follow(id){
    const isFollower = userDB[user.id];
    const isFollowed = userDB[id];
    let following;
    if(!isFollower.following.includes(id)){
      const event = { type: 'followed',
        target: {
          username: isFollowed.username,
          id: isFollowed.id
        }
      }
      const activity = new Activity({by: user.username, by_id: user.id}, event);
      // Add to user and target follow arr
      user.following.push(id)
      isFollowed.followers.push(user.id)
      // Add to user activity
      user.activity.unshift(activity);
      // Add to target notifications
      isFollowed.notifications.unshift(activity);

      following = true
    }else{
      // Remove follow from all follow, activity and notification arr
      isFollowed.followers = isFollowed.followers.filter(x => x !== user.id);
      isFollowed.notifications = isFollowed.notifications.filter(x => x.target.id !== isFollowed.id);
      user.following = user.following.filter(x => x !== id);
      user.activity = user.activity.filter(x => x.target.id !== isFollowed.id);
      following = false;
    }
    userDB[user.id] = user;
    updateSession(user);
    updateDB();
    return following
  }
  static addConvo(convoID) {
    const record = userDB[user.id];
    record.conversations.push(convoID);
    updateSession(record);
    updateDB();
  }
  
  // static delConvo(convoID){
  //   const record = userDB[user.id];
  //   record.conversations = record.conversations.filter(x => x !== convoID);
  //   updateSession(record);
  //   updateDB();
  // }

}

// static addConvo(convoID, userID) {
//   const record = userDB[userID];
//   record.conversations.push(convoID);
//   updateDB();
// }