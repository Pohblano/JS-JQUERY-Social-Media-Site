///////////////////////////////////////////////////
// Initialize database
///////////////////////////////////////////////////
(function initDB() {
  let records = JSON.parse(localStorage.getItem('records'));
  let postRecords = JSON.parse(localStorage.getItem('post-records'));
  let convoRecords = JSON.parse(localStorage.getItem('convo-records'));
  (!records) ?  localStorage.setItem('records', JSON.stringify(data_records)) : null;
  (!postRecords)?  localStorage.setItem("post-records", JSON.stringify(data_post_records)): null;
  (!convoRecords)?  localStorage.setItem("convo-records", JSON.stringify(data_convo_records)): null;
})();

///////////////////////////////////////////////////
// Retrieve database data
///////////////////////////////////////////////////
let user = JSON.parse(sessionStorage.getItem('logged-in'));
const userDB = JSON.parse(localStorage.getItem('records')); // Object notation
const postDB = JSON.parse(localStorage.getItem('post-records'));
const convoDB = JSON.parse(localStorage.getItem('convo-records'));
const records = toArray(JSON.parse(localStorage.getItem('records')))
const post_records = toArray(JSON.parse(localStorage.getItem('post-records')))

///////////////////////////////////////////////////
// Update database data
///////////////////////////////////////////////////
function updateDB() {
  localStorage.setItem("records", JSON.stringify(userDB));
  localStorage.setItem("post-records", JSON.stringify(postDB));
  localStorage.setItem("convo-records", JSON.stringify(convoDB));
}

function updateSession(obj){
  sessionStorage.setItem("logged-in", JSON.stringify(obj))
}

///////////////////////////////////////////////////
// Checks for logged-in user
/////////////////////////////////////////////////////
function isLoggedIn(){
  if(user) return true
  else return false
}

///////////////////////////////////////////////////
// Converts DB to array
/////////////////////////////////////////////////////
function toArray(db) { // Array notation
  const records = [];
  const data = db;
  for (let x in data)
    records.push(data[x])
  return records
}

