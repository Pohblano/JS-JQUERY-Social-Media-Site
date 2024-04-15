////////////////////////////////////////////////////
// ACTIVITY MODEL for database
////////////////////////////////////////////////////
class Activity extends Data{
  constructor(obj, event) {
    super();
    this.author = obj.by;
    this.author_id = obj.by_id;
    this.event_id = this.id;
    this.event = event.type;
    this.content= obj.content;
    this.created = this.created;
    this.timeStamp= this.timeStamp;
    this.target = (event.target)?event.target : '';
    this.post_target = (obj.post_id)?obj.post_id: '';
  }
}