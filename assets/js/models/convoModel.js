////////////////////////////////////////////////////
// CONVERSATION MODEL for database
////////////////////////////////////////////////////
class Convo extends Data {
  constructor(obj) {
    super();
    this.id = this.id
    this.created = this.created;
    this.timeStamp = this.timeStamp;
    this.author = user.username;
    this.author_id = user.id;
    this.title = obj.title;
    this.recipients = obj.recipients;
    this.messages = [];
  }
  static save(convo) {
    convoDB[convo.id] = convo;
    User.addConvo(convo.id);
    convo.recipients.map(id => {
      const record = userDB[id];
      record.conversations.push(convo.id);
    });
    updateDB();
  }
  static delete(id) {
    delete convoDB[id];
    updateDB();
  }
  static addRecipient(convoID, userID) {
    const convo = convoDB[convoID];
    const record = userDB[userID];
    convo.recipients.push(userID);
    record.conversations.push(convoID);
    
    updateDB();
  }
  // static delRecipient(id, userID) {
  //   const convo = convoDB[id];
  //   convo.recipients = convo.recipients.filter(x => x !== userID);
  //   updateDB();
  // }
  static addMsg(convoID, newMsg) {
    newMsg.id = genId();
    const convo = convoDB[convoID]
    const event = {type: 'messaged',}
    const activity = new Activity({ by: user.username, by_id: user.id, post_id: convoID, ...newMsg }, event);
    convo.recipients.map(id => {
      const target = userDB[id];
      target.notifications.unshift(activity)
    });
    convoDB[convoID].messages.unshift(newMsg)

    updateDB();
  }

}