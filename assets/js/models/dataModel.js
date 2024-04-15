////////////////////////////////////////////////////
// DATA MODEL for database
////////////////////////////////////////////////////
class Data {
  constructor(){
    this.id = this.genId();
    this.created = this.genTimeStamp();
    this.timeStamp = new Date();
  }
  genTimeStamp() {
    const date = moment();
    return {
      date: date.format("MMMM Do YYYY"),
      time: date.format("h:mm:ss a")
    }
  }
  genId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  }
  static retrieve(db, id){
    return db[id];
  }
}
